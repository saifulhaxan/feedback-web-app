import React, { useState, useEffect, useRef } from "react";
import House from "../../assets/images/house.png";
import ProgressImg from "../../assets/images/progress.png";
import { FaPlay } from "react-icons/fa";
import { FaStop } from "react-icons/fa";
import { 
  getProjectProgressDetail,
  resumeProjectProgress,
  pauseProjectProgress,
  updateProjectProgress
} from "../../api/projectApi";

export default function SolutionTimer({ projectId }) {
  const houseWidth = 500;
  const stopOffset = 70;
  const totalTime = 20000; // fallback demo value; real end time used below
  const progressRef = useRef(null);

  const [progress, setProgress] = useState(0);
  const [progressWidth, setProgressWidth] = useState(0);
  const [maxDistance, setMaxDistance] = useState(430);
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [percentPerHour, setPercentPerHour] = useState(0);
  const [elapsedTimeStr, setElapsedTimeStr] = useState("00:00");
  const [manualControl, setManualControl] = useState(false);
  const [project, setProject] = useState(null);
  const [timerId, setTimerId] = useState(null);
  const [totalPausedMs, setTotalPausedMs] = useState(0);
  const [displayPercent, setDisplayPercent] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (progressRef.current) {
      const progWidth = progressRef.current.offsetWidth;
      setProgressWidth(progWidth);
      const calculatedMaxDistance = houseWidth - progWidth - stopOffset;
      setMaxDistance(calculatedMaxDistance);
    }
  }, [progressRef.current]);

  // Helpers mapped from provided pseudocode
  const calculateProgress = ({ startDateTime, totalPausedDuration, percentPerHour: pph, manualProgress }) => {
    const now = new Date();
    const effectiveMs = (now - startDateTime) - totalPausedDuration;
    const elapsedHours = Math.max(0, effectiveMs) / (1000 * 60 * 60);
    const prog = elapsedHours * (pph || 0);
    const actual = prog + (manualProgress || 0);
    return Math.max(0, Math.min(100, actual));
  };

  const timeConsumed = ({ start, now, pausedTime }) => {
    const durationMs = (now - start) - pausedTime;
    const safeMs = Math.max(0, durationMs);
    const hours = Math.floor(safeMs / (1000 * 60 * 60));
    const minutes = Math.floor((safeMs % (1000 * 60 * 60)) / (1000 * 60));
    const hh = String(hours).padStart(2, "0");
    const mm = String(minutes).padStart(2, "0");
    return `${hh}:${mm}`;
  };

  const refreshElapsed = (proj, now = new Date()) => {
    const start = new Date(proj?.startTime || proj?.stepConfig?.startTime);
    const pausedMs = Number(proj?.totalPauseTime || 0);
    setElapsedTimeStr(timeConsumed({ start, now, pausedTime: pausedMs }));
  };

  const loadDetail = async () => {
    if (!projectId) return;
    const res = await getProjectProgressDetail(projectId);
    const data = res?.data?.data || {};
    setProject(data);

    const start = new Date(data?.startTime || data?.stepConfig?.startTime);
    const end = new Date(data?.endTime || data?.stepConfig?.endTime);
    const pph = Number(data?.stepsPerHour || data?.stepConfig?.stepsPerHour || 0);
    const pausedMs = Number(data?.totalPauseTime || 0);

    setStartTime(start);
    setEndTime(end);
    setPercentPerHour(pph);
    setTotalPausedMs(pausedMs);

    // Initialize progress and elapsed
    const initialProgress = Number(data?.currentProgress || 0);
    setProgress(initialProgress / 100 * maxDistance);
    setDisplayPercent(initialProgress);
    refreshElapsed(data);

    // Console logging for initial data
    console.log('📊 Project Data Loaded:', {
      projectId,
      projectName: data?.projectName,
      currentProgress: data?.currentProgress,
      progressPercentage: data?.progressPercentage,
      isStarted: data?.isStarted,
      isCompleted: data?.isCompleted,
      isPaused: data?.isPaused,
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      totalDuration: `${((end - start) / (1000 * 60 * 60)).toFixed(2)} hours`,
      stepsPerHour: pph,
      totalPauseTime: `${(pausedMs / (1000 * 60)).toFixed(2)} minutes`,
      initialProgress,
      maxDistance
    });

    // Check if project is in a state where timer should be running
    if (data?.isStarted && !data?.isCompleted && !data?.isExpired && !data?.isPaused) {
      // Start animation from current progress - use API progress instead of time calculation
      startAutoTimer(start, end, pph, pausedMs, initialProgress);
    } else if (data?.isPaused) {
      // Project is paused, don't start timer but keep current progress
      setIsRunning(false);
    } else {
      // Project not started or completed/expired
      setIsRunning(false);
    }
  };

  useEffect(() => {
    loadDetail().catch(() => {});
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const startAutoTimer = (start, end, pph, pausedMs, apiProgress = 0) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsRunning(true);
    
    // Calculate total project duration (like your old totalTime)
    const totalDuration = end - start;
    const totalTimeMs = totalDuration - pausedMs;
    
    // Calculate how much time has already passed
    const now = new Date();
    const elapsedTime = now - start - pausedMs;
    
    // Calculate current progress percentage
    let currentProgressPercent = Math.min(100, (elapsedTime / totalTimeMs) * 100);
    
    // If API provides progress, use it as starting point
    if (apiProgress > 0) {
      currentProgressPercent = apiProgress;
    }
    
    // Set initial position
    const initialPx = (currentProgressPercent / 100) * maxDistance;
    setProgress(Math.min(maxDistance, initialPx));
    setDisplayPercent(currentProgressPercent);
    
    // Console logging for debugging
    console.log('🚀 Animation Started (Simplified):', {
      apiProgress,
      currentProgressPercent,
      initialPx,
      maxDistance,
      totalTimeMs: `${(totalTimeMs / (1000 * 60 * 60)).toFixed(2)} hours`,
      elapsedTime: `${(elapsedTime / (1000 * 60 * 60)).toFixed(2)} hours`,
      timeFor1Percent: `${(totalTimeMs / 100).toFixed(2)}ms per 1%`,
      timeFor1PercentSeconds: `${((totalTimeMs / 100) / 1000).toFixed(2)} seconds per 1%`
    });
    
    // If already at 100%, don't start animation
    if (currentProgressPercent >= 100) {
      console.log('✅ Project already at 100% - no animation needed');
      setIsRunning(false);
      return;
    }
    
    // Calculate remaining time for animation
    const remainingTime = Math.max(0, totalTimeMs - elapsedTime);
    const animationStep = maxDistance / (remainingTime / 100); // pixels per 100ms
    
    console.log('⏱️ Animation Timing (Simplified):', {
      totalTimeMs: `${(totalTimeMs / (1000 * 60 * 60)).toFixed(2)} hours`,
      remainingTime: `${(remainingTime / (1000 * 60 * 60)).toFixed(2)} hours`,
      animationStep: `${animationStep.toFixed(4)} pixels per 100ms`
    });
    
    let lastLoggedPercent = Math.floor(currentProgressPercent);
    let animationStartTime = Date.now();
    
    // Simple interval like your old code
    intervalRef.current = setInterval(() => {
      setProgress(prevProgress => {
        const newProgress = prevProgress + animationStep;
        if (newProgress >= maxDistance) {
          // Reached destination (100%)
          const totalAnimationTime = Date.now() - animationStartTime;
          console.log('🎉 Animation Complete:', {
            totalAnimationTime: `${(totalAnimationTime / 1000).toFixed(2)} seconds`,
            finalProgress: '100%'
          });
          setIsRunning(false);
          clearInterval(intervalRef.current);
          setDisplayPercent(100);
          return maxDistance;
        }
        
        // Update display percentage based on current position
        const currentPercent = (newProgress / maxDistance) * 100;
        setDisplayPercent(Math.min(100, currentPercent));
        
        // Log progress every 1% increase
        const currentPercentFloor = Math.floor(currentPercent);
        if (currentPercentFloor > lastLoggedPercent) {
          const timeElapsed = Date.now() - animationStartTime;
          console.log(`📈 Progress: ${currentPercentFloor}% (${currentPercent.toFixed(2)}%) - Time: ${(timeElapsed / 1000).toFixed(2)}s`);
          lastLoggedPercent = currentPercentFloor;
        }
        
        return newProgress;
      });
      
      // Update elapsed time display
      refreshElapsed(project || { startTime: start, totalPauseTime: pausedMs });
    }, 100);
  };

  const toggleTimer = async () => {
    if (!project) return;
    if (manualControl) return; // controlled by slider
    
    if (isRunning) {
      // Pause the timer
      try {
        await pauseProjectProgress(project.projectId || project.id);
      } catch (error) {
        console.error("Failed to pause project:", error);
      }
      clearInterval(intervalRef.current);
      setIsRunning(false);
    } else {
      // Resume the timer - get fresh data from API
      try {
        await resumeProjectProgress(project.projectId || project.id);
        
        // Reload project data to get updated start/end times and pause data
        const res = await getProjectProgressDetail(project.projectId || project.id);
        const updatedData = res?.data?.data || {};
        
        const start = new Date(updatedData?.startTime || updatedData?.stepConfig?.startTime);
        const end = new Date(updatedData?.endTime || updatedData?.stepConfig?.endTime);
        const pph = Number(updatedData?.stepsPerHour || updatedData?.stepConfig?.stepsPerHour || 0);
        const pausedMs = Number(updatedData?.totalPauseTime || 0);
        
        // Update state with fresh data
        setProject(updatedData);
        setStartTime(start);
        setEndTime(end);
        setPercentPerHour(pph);
        setTotalPausedMs(pausedMs);
        
        // Start animation with fresh data - use API progress
        const updatedProgress = Number(updatedData?.currentProgress || 0);
        startAutoTimer(start, end, pph, pausedMs, updatedProgress);
        
      } catch (error) {
        console.error("Failed to resume project:", error);
      }
    }
  };

  const handleManualControl = (e) => {
    setManualControl(e.target.checked);
    if (e.target.checked) {
      // Switch to manual mode - stop timer
      if (intervalRef.current) clearInterval(intervalRef.current);
      setIsRunning(false);
    } else {
      // Switch back to automatic mode - resume timer if project is started
      if (project && project.isStarted && !project.isCompleted && !project.isExpired && !project.isPaused) {
        const apiProgress = Number(project?.currentProgress || 0);
        const start = new Date(project?.startTime || project?.stepConfig?.startTime);
        const end = new Date(project?.endTime || project?.stepConfig?.endTime);
        startAutoTimer(start, end, percentPerHour, totalPausedMs, apiProgress);
      }
    }
  };

  const handleSliderChange = (e) => {
    if (!manualControl) return;
    const px = Math.min(parseInt(e.target.value, 10), maxDistance);
    setProgress(px);
    // Update display percentage
    const percent = (px / maxDistance) * 100;
    setDisplayPercent(Math.min(100, percent));
    // Update elapsed to reflect position (approximate)
    const hours = percent / (percentPerHour || 1);
    const ms = hours * 60 * 60 * 1000;
    if (startTime) setElapsedTimeStr(timeConsumed({ start: startTime, now: new Date(startTime.getTime() + ms), pausedTime: totalPausedMs }));
  };

  const handleUpdateManual = async () => {
    if (!manualControl || !project) return;
    try {
      await updateProjectProgress(project.projectId || project.id, displayPercent);
      await loadDetail();
    } catch {}
  };

  const percentDisplay = Math.round(displayPercent);

  return (
    <div className="solution-timer-wrapper">
      <div className="main-timer-wrapper">
        <div className="background-house text-center" style={{ width: houseWidth }}>
          <img src={House} alt="House" width={houseWidth} />
          <div className="progress-timer-wrap" ref={progressRef} style={{ left: `${progress}px`, transition: "left 0.1s linear" }}>
            <div className="inner-timer-text">
              <img src={ProgressImg} alt="Progress" />
              <span className="timer-span">{String(Math.min(99, percentDisplay)).padStart(2, "0")}</span>
              <span className="timer-completed-percent">{percentDisplay}% Completed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Start/Stop Button */}
      <div className="text-center mt-3">
        <button onClick={toggleTimer} disabled={manualControl} className={`btn px-4 py-2 rounded-5 ${isRunning ? "btn-danger" : "btn-primary"}`}>
          {isRunning ? <FaStop className="me-2" /> : <FaPlay className="me-2" />}
          {isRunning ? "Pause" : "Resume"}
        </button>
      </div>

      {/* Manual Control Checkbox */}
      <div className="mt-3">
        <input type="checkbox" id="manualStatus" checked={manualControl} onChange={handleManualControl} />
        <label htmlFor="manualStatus" className="ms-2">Enable Manual Status</label>
      </div>

      {/* Progress Slider */}
      <div className="text-center mt-3 timer-slider">
        <input type="range" min="0" max={maxDistance} value={progress} onChange={handleSliderChange} disabled={!manualControl} className="form-range" />
        <span className="slider-mark-0 slider-mark">0</span>
        <span className="slider-mark-50 slider-mark">50</span>
        <span className="slider-mark-10 slider-mark">100</span>
      </div>

      <div className="stimer-update-btn mt-5">
        <button className="btn btn-secondary px-3" onClick={handleUpdateManual} disabled={!manualControl}>Update</button>
      </div>
    </div>
  );
}

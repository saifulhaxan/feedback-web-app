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
    refreshElapsed(data);

    // If started and not complete/expired/paused, start timer
    if (data?.isStarted && !data?.isCompleted && !data?.isExpired && !data?.isPaused) {
      startAutoTimer(start, end, pph, pausedMs, data?.currentProgress || 0);
    }
  };

  useEffect(() => {
    loadDetail().catch(() => {});
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const startAutoTimer = (start, end, pph, pausedMs, manualProgress = 0) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      const now = new Date();
      // Stop at end time
      if (end && now >= end) {
        setIsRunning(false);
        clearInterval(intervalRef.current);
      }
      const percent = calculateProgress({ startDateTime: start, totalPausedDuration: pausedMs, percentPerHour: pph, manualProgress });
      // Map percent -> px left
      const px = (percent / 100) * maxDistance;
      setProgress(Math.min(maxDistance, px));
      refreshElapsed(project || { startTime: start, totalPauseTime: pausedMs });
    }, 100); // smooth UI updates; no API calls here
  };

  const toggleTimer = async () => {
    if (!project) return;
    if (manualControl) return; // controlled by slider
    if (isRunning) {
      try {
        await pauseProjectProgress(project.projectId || project.id);
      } catch {}
      clearInterval(intervalRef.current);
      setIsRunning(false);
    } else {
      try {
        await resumeProjectProgress(project.projectId || project.id);
      } catch {}
      const start = new Date(project?.startTime || project?.stepConfig?.startTime);
      const end = new Date(project?.endTime || project?.stepConfig?.endTime);
      startAutoTimer(start, end, percentPerHour, totalPausedMs, Number(project?.currentProgress || 0));
    }
  };

  const handleManualControl = (e) => {
    setManualControl(e.target.checked);
    if (e.target.checked) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setIsRunning(false);
    } else {
      if (project) {
        const start = new Date(project?.startTime || project?.stepConfig?.startTime);
        const end = new Date(project?.endTime || project?.stepConfig?.endTime);
        startAutoTimer(start, end, percentPerHour, totalPausedMs, Number(project?.currentProgress || 0));
      }
    }
  };

  const handleSliderChange = (e) => {
    if (!manualControl) return;
    const px = Math.min(parseInt(e.target.value, 10), maxDistance);
    setProgress(px);
    // Update elapsed to reflect position (approximate)
    const percent = (px / maxDistance) * 100;
    const hours = percent / (percentPerHour || 1);
    const ms = hours * 60 * 60 * 1000;
    if (startTime) setElapsedTimeStr(timeConsumed({ start: startTime, now: new Date(startTime.getTime() + ms), pausedTime: totalPausedMs }));
  };

  const handleUpdateManual = async () => {
    if (!manualControl || !project) return;
    const percent = (progress / maxDistance) * 100;
    try {
      await updateProjectProgress(project.projectId || project.id, percent);
      await loadDetail();
    } catch {}
  };

  const percentDisplay = Math.round((progress / maxDistance) * 100);

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

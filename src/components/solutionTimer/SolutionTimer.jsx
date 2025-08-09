import React, { useState, useEffect, useRef } from "react";
import House from "../../assets/images/house.png";
import ProgressImg from "../../assets/images/progress.png";
import { FaPlay } from "react-icons/fa";
import { FaStop } from "react-icons/fa";

export default function SolutionTimer() {
  const houseWidth = 500;
  const stopOffset = 70;
  const totalTime = 20000; // 20 seconds
  const progressRef = useRef(null);

  const [progress, setProgress] = useState(0);
  const [progressWidth, setProgressWidth] = useState(0);
  const [maxDistance, setMaxDistance] = useState(430);
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [manualControl, setManualControl] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (progressRef.current) {
      const progWidth = progressRef.current.offsetWidth;
      setProgressWidth(progWidth);

      // Ensure maxDistance is correctly set
      const calculatedMaxDistance = houseWidth - progWidth - stopOffset;
      setMaxDistance(calculatedMaxDistance);
    }
  }, [progressRef.current]); // Ensure it updates when ref is available

  const toggleTimer = () => {
    if (isRunning) {
      clearInterval(intervalRef.current);
      setIsRunning(false);
    } else {
      if (progressRef.current) {
        const progWidth = progressRef.current.offsetWidth;
        const calculatedMaxDistance = houseWidth - progWidth - stopOffset;
        setProgressWidth(progWidth);
        setMaxDistance(calculatedMaxDistance);
      }

      setIsRunning(true);
      const start = Date.now() - elapsedTime;
      setStartTime(start);
      intervalRef.current = setInterval(() => {
        const elapsed = Date.now() - start;
        setElapsedTime(elapsed);
        let percentage = Math.min(elapsed / totalTime, 1);
        let newProgress = percentage * maxDistance;

        if (newProgress >= maxDistance) {
          newProgress = maxDistance; // Stop exactly at the defined limit
          clearInterval(intervalRef.current);
          setIsRunning(false);
        }

        setProgress(newProgress);
      }, 100);
    }
  };

  const handleManualControl = (e) => {
    setManualControl(e.target.checked);
    if (e.target.checked) {
      clearInterval(intervalRef.current);
      setIsRunning(false);
    } else {
      setElapsedTime((progress / maxDistance) * totalTime);
      toggleTimer();
    }
  };

  const handleSliderChange = (e) => {
    if (manualControl) {
      const newProgress = Math.min(parseInt(e.target.value), maxDistance);
      setProgress(newProgress);
      setElapsedTime((newProgress / maxDistance) * totalTime);
    }
  };

  return (
    <div className="solution-timer-wrapper">
      <div className="main-timer-wrapper">
        <div
          className="background-house text-center"
          style={{ width: houseWidth }}
        >
          <img src={House} alt="House" width={houseWidth} />
          <div
            className="progress-timer-wrap"
            ref={progressRef}
            style={{
              left: `${progress}px`,
              transition: "left 0.1s linear",
            }}
          >
            <div className="inner-timer-text">
              <img src={ProgressImg} alt="Progress" />
              <span className="timer-span">
                {String(Math.min(20, Math.ceil(elapsedTime / 1000))).padStart(
                  2,
                  "0"
                )}
              </span>
              <span className="timer-completed-percent">
                {Math.min(100, Math.round((elapsedTime / totalTime) * 100))}%
                Completed
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Start/Stop Button */}
      <div className="text-center mt-3">
        <button
          onClick={toggleTimer}
          disabled={manualControl}
          className={`btn px-4 py-2 rounded-5 ${
            isRunning ? "btn-danger" : "btn-primary"
          }`}
        >
          {isRunning ? (
            <FaStop className="me-2" />
          ) : (
            <FaPlay className="me-2" />
          )}

          {isRunning ? "Stop" : "Resume"}
        </button>
      </div>

      {/* Manual Control Checkbox */}
      <div className="mt-3">
        <input
          type="checkbox"
          id="manualStatus"
          checked={manualControl}
          onChange={handleManualControl}
        />
        <label htmlFor="manualStatus" className="ms-2">
          Enable Manual Status
        </label>
      </div>

      {/* Progress Slider */}
      <div className="text-center mt-3 timer-slider">
        <input
          type="range"
          min="0"
          max={maxDistance}
          value={progress}
          onChange={handleSliderChange}
          disabled={!manualControl}
          className="form-range"
        />
        <span className="slider-mark-0 slider-mark">0</span>
        <span className="slider-mark-50 slider-mark">50</span>
        <span className="slider-mark-10 slider-mark">100</span>
      </div>

      <div className="stimer-update-btn mt-5">
        <button className="btn btn-secondary px-3" disabled>
          Update
        </button>
      </div>
    </div>
  );
}

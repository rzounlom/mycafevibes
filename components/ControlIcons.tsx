"use client";

import { FaClock, FaListUl, FaMoon, FaTimes } from "react-icons/fa";
import { useEffect, useState } from "react";

export default function ControlIcons() {
  const [active, setActive] = useState({
    timer: false,
    darkMode: false,
    todo: false,
  });

  const [showTimer, setShowTimer] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState(25);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timerMinutes * 60);
  const [timerFinished, setTimerFinished] = useState(false);

  // Timer countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (timerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setTimerRunning(false);
            setTimerFinished(true);
            // Play notification sound
            const audio = new Audio("/audio/espresso.wav");
            audio.volume = 0.3;
            audio.play().catch(() => {}); // Ignore errors if audio fails to play
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning, timeLeft]);

  // Update timeLeft when timerMinutes changes
  useEffect(() => {
    if (!timerRunning) {
      setTimeLeft(timerMinutes * 60);
    }
  }, [timerMinutes, timerRunning]);

  // Reset timer finished state when starting new timer
  useEffect(() => {
    if (timerRunning) {
      setTimerFinished(false);
    }
  }, [timerRunning]);

  const toggle = (key: keyof typeof active) => {
    if (key === "timer") {
      setShowTimer(!showTimer);
    }
    setActive((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const startTimer = () => {
    setTimerRunning(true);
    setTimeLeft(timerMinutes * 60);
    setTimerFinished(false);
  };

  const stopTimer = () => {
    setTimerRunning(false);
  };

  const resetTimer = () => {
    setTimerRunning(false);
    setTimeLeft(timerMinutes * 60);
    setTimerFinished(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <>
      <div className="fixed top-6 right-6 flex gap-4 z-50">
        <button
          onClick={() => toggle("timer")}
          className={`p-3 rounded-xl shadow-lg transition-all duration-300 hover:scale-110 backdrop-blur-sm border ${
            active.timer
              ? "bg-green-500/90 text-white border-green-400/50"
              : "bg-gray-800/80 text-gray-300 border-gray-700/50 hover:bg-gray-700/80 hover:text-white"
          }`}
          title="Timer"
        >
          <FaClock size={18} />
        </button>
        <button
          onClick={() => toggle("darkMode")}
          className={`p-3 rounded-xl shadow-lg transition-all duration-300 hover:scale-110 backdrop-blur-sm border ${
            active.darkMode
              ? "bg-blue-500/90 text-white border-blue-400/50"
              : "bg-gray-800/80 text-gray-300 border-gray-700/50 hover:bg-gray-700/80 hover:text-white"
          }`}
          title="Dark Mode"
        >
          <FaMoon size={18} />
        </button>
        <button
          onClick={() => toggle("todo")}
          className={`p-3 rounded-xl shadow-lg transition-all duration-300 hover:scale-110 backdrop-blur-sm border ${
            active.todo
              ? "bg-purple-500/90 text-white border-purple-400/50"
              : "bg-gray-800/80 text-gray-300 border-gray-700/50 hover:bg-gray-700/80 hover:text-white"
          }`}
          title="To-Do List"
        >
          <FaListUl size={18} />
        </button>
      </div>

      {/* Timer Modal */}
      {showTimer && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800/90 backdrop-blur-md rounded-2xl p-8 border border-gray-700/50 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold text-white">Timer</h3>
              <button
                onClick={() => setShowTimer(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div className="text-center mb-6">
              <div
                className={`text-6xl font-mono font-bold mb-4 transition-colors ${
                  timerFinished ? "text-green-400 animate-pulse" : "text-white"
                }`}
              >
                {formatTime(timeLeft)}
              </div>

              {timerFinished && (
                <div className="text-green-400 text-lg font-medium mb-4 animate-pulse">
                  Time&apos;s up! ☕
                </div>
              )}

              <div className="flex gap-2 mb-6">
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={timerMinutes}
                  onChange={(e) =>
                    setTimerMinutes(parseInt(e.target.value) || 25)
                  }
                  className="bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-green-500 focus:outline-none w-20 text-center"
                  disabled={timerRunning}
                />
                <span className="text-gray-300 self-center">minutes</span>
              </div>

              <div className="flex gap-3 justify-center">
                {!timerRunning ? (
                  <button
                    onClick={startTimer}
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Start
                  </button>
                ) : (
                  <button
                    onClick={stopTimer}
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Stop
                  </button>
                )}
                <button
                  onClick={resetTimer}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

"use client";

import {
  FaBook,
  FaClock,
  FaInfoCircle,
  FaListUl,
  FaMoon,
  FaPause,
  FaPlay,
  FaRedo,
  FaSun,
  FaTimes,
} from "react-icons/fa";
import { useEffect, useState } from "react";

import TodoList from "./TodoList";
import { useTheme } from "./ThemeContext";

type TimerMode = "pomodoro" | "shortBreak" | "longBreak";

// Storage keys for pomodoro preferences
const POMODORO_STORAGE_KEYS = {
  TIMER_MODE: "mycafevibes_timer_mode",
  AUTO_START: "mycafevibes_auto_start",
  SAVE_PREFERENCES: "mycafevibes_save_preferences",
  CUSTOM_DURATIONS: "mycafevibes_custom_durations",
  FOCUS_SESSIONS_BEFORE_LONG_BREAK:
    "mycafevibes_focus_sessions_before_long_break",
};

export default function ControlIcons() {
  const { theme, toggleTheme } = useTheme();
  const [active, setActive] = useState({
    timer: false,
    darkMode: false,
    todo: false,
    info: false,
  });

  const [showTimer, setShowTimer] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showTodoList, setShowTodoList] = useState(false);
  const [timerMode, setTimerMode] = useState<TimerMode>("pomodoro");
  const [timerMinutes, setTimerMinutes] = useState(25);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timerMinutes * 60);
  const [timerFinished, setTimerFinished] = useState(false);
  const [autoStart, setAutoStart] = useState(false);
  const [savePreferences, setSavePreferences] = useState(false);
  const [customDurations, setCustomDurations] = useState({
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15,
  });
  const [focusSessionsBeforeLongBreak, setFocusSessionsBeforeLongBreak] =
    useState(4);
  const [completedFocusSessions, setCompletedFocusSessions] = useState(0);
  const [showCustomSettings, setShowCustomSettings] = useState(false);

  // Timer durations (use custom if available, otherwise defaults)
  const timerDurations = customDurations;

  // Load pomodoro preferences on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        // Load save preferences setting first
        const savedSavePrefs = localStorage.getItem(
          POMODORO_STORAGE_KEYS.SAVE_PREFERENCES
        );
        const shouldSave = savedSavePrefs ? JSON.parse(savedSavePrefs) : false;
        setSavePreferences(shouldSave);

        if (shouldSave) {
          // Load timer mode
          const savedTimerMode = localStorage.getItem(
            POMODORO_STORAGE_KEYS.TIMER_MODE
          );
          if (savedTimerMode) {
            setTimerMode(JSON.parse(savedTimerMode));
          }

          // Load auto-start setting
          const savedAutoStart = localStorage.getItem(
            POMODORO_STORAGE_KEYS.AUTO_START
          );
          if (savedAutoStart) {
            setAutoStart(JSON.parse(savedAutoStart));
          }

          // Load custom durations
          const savedCustomDurations = localStorage.getItem(
            POMODORO_STORAGE_KEYS.CUSTOM_DURATIONS
          );
          if (savedCustomDurations) {
            setCustomDurations(JSON.parse(savedCustomDurations));
          }

          // Load focus sessions before long break
          const savedFocusSessions = localStorage.getItem(
            POMODORO_STORAGE_KEYS.FOCUS_SESSIONS_BEFORE_LONG_BREAK
          );
          if (savedFocusSessions) {
            setFocusSessionsBeforeLongBreak(JSON.parse(savedFocusSessions));
          }
        }
      } catch (error) {
        console.error("Error loading pomodoro preferences:", error);
      }
    }
  }, []);

  // Save pomodoro preferences
  const savePomodoroPreference = (key: string, value: string | boolean) => {
    if (typeof window !== "undefined" && savePreferences) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error("Error saving pomodoro preferences:", error);
      }
    }
  };

  // Update active state based on current theme and modal states
  useEffect(() => {
    setActive((prev) => ({
      ...prev,
      darkMode: theme === "dark",
      info: showInfo,
      timer: showTimer,
      todo: showTodoList,
    }));
  }, [theme, showInfo, showTimer, showTodoList]);

  // Update timer duration when mode changes
  useEffect(() => {
    setTimerMinutes(timerDurations[timerMode]);
    if (!timerRunning) {
      setTimeLeft(timerDurations[timerMode] * 60);
    }
  }, [timerMode, timerRunning]);

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

            // Auto-start next timer if enabled
            if (autoStart) {
              setTimeout(() => {
                if (timerMode === "pomodoro") {
                  // Increment completed focus sessions
                  const newCompletedSessions = completedFocusSessions + 1;
                  setCompletedFocusSessions(newCompletedSessions);

                  // Check if it's time for a long break
                  if (newCompletedSessions >= focusSessionsBeforeLongBreak) {
                    setTimerMode("longBreak");
                    setCompletedFocusSessions(0); // Reset counter after long break
                  } else {
                    setTimerMode("shortBreak");
                  }
                } else if (timerMode === "shortBreak") {
                  setTimerMode("pomodoro");
                } else {
                  // Long break finished, start new focus session
                  setTimerMode("pomodoro");
                }
                setTimerFinished(false);
                setTimerRunning(true);
              }, 2000);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning, timeLeft, autoStart, timerMode]);

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
    } else if (key === "darkMode") {
      toggleTheme();
    } else if (key === "info") {
      setShowInfo(!showInfo);
    } else if (key === "todo") {
      setShowTodoList(!showTodoList);
    }
    // Only update active state for dark mode toggle, others are managed by useEffect
    if (key === "darkMode") {
      setActive((prev) => ({ ...prev, [key]: !prev[key] }));
    }
  };

  const startTimer = () => {
    setTimerRunning(true);
    setTimerFinished(false);
  };

  const pauseTimer = () => {
    setTimerRunning(false);
  };

  const resetTimer = () => {
    setTimerRunning(false);
    setTimeLeft(timerDurations[timerMode] * 60);
    setTimerFinished(false);
    setCompletedFocusSessions(0); // Reset session counter
  };

  const handleTimerModeChange = (mode: TimerMode) => {
    setTimerMode(mode);
    savePomodoroPreference(POMODORO_STORAGE_KEYS.TIMER_MODE, mode);
  };

  const handleAutoStartChange = (checked: boolean) => {
    setAutoStart(checked);
    savePomodoroPreference(POMODORO_STORAGE_KEYS.AUTO_START, checked);
  };

  const handleSavePreferencesChange = (checked: boolean) => {
    setSavePreferences(checked);
    localStorage.setItem(
      POMODORO_STORAGE_KEYS.SAVE_PREFERENCES,
      JSON.stringify(checked)
    );

    // If turning off save preferences, clear all saved pomodoro data
    if (!checked) {
      Object.values(POMODORO_STORAGE_KEYS).forEach((key) => {
        if (key !== POMODORO_STORAGE_KEYS.SAVE_PREFERENCES) {
          localStorage.removeItem(key);
        }
      });
    }
  };

  const handleCustomDurationChange = (mode: TimerMode, value: number) => {
    const newDurations = {
      ...customDurations,
      [mode]: Math.max(1, Math.min(120, value)),
    };
    setCustomDurations(newDurations);

    // Update current timer if it's the active mode
    if (timerMode === mode && !timerRunning) {
      setTimeLeft(newDurations[mode] * 60);
    }

    // Save to localStorage if preferences are enabled
    if (savePreferences) {
      localStorage.setItem(
        POMODORO_STORAGE_KEYS.CUSTOM_DURATIONS,
        JSON.stringify(newDurations)
      );
    }
  };

  const handleFocusSessionsChange = (value: number) => {
    const newValue = Math.max(1, Math.min(10, value));
    setFocusSessionsBeforeLongBreak(newValue);

    // Save to localStorage if preferences are enabled
    if (savePreferences) {
      localStorage.setItem(
        POMODORO_STORAGE_KEYS.FOCUS_SESSIONS_BEFORE_LONG_BREAK,
        JSON.stringify(newValue)
      );
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const getModeLabel = (mode: TimerMode) => {
    switch (mode) {
      case "pomodoro":
        return "Focus Time";
      case "shortBreak":
        return "Short Break";
      case "longBreak":
        return "Long Break";
    }
  };

  const getModeColor = (mode: TimerMode) => {
    switch (mode) {
      case "pomodoro":
        return "text-red-500";
      case "shortBreak":
        return "text-green-500";
      case "longBreak":
        return "text-blue-500";
    }
  };

  return (
    <>
      <div className="fixed top-6 right-6 flex gap-4 z-40">
        <button
          onClick={() => toggle("info")}
          className="p-3 rounded-xl shadow-lg transition-all duration-300 hover:scale-110 backdrop-blur-sm border cursor-pointer bg-purple-500/90 text-white border-purple-400/50"
          title="Quick Start Guide"
        >
          <FaInfoCircle size={18} />
        </button>
        <button
          onClick={() => toggle("darkMode")}
          className={`p-3 rounded-xl shadow-lg transition-all duration-300 hover:scale-110 backdrop-blur-sm border cursor-pointer ${
            active.darkMode
              ? "bg-blue-500/90 text-white border-blue-400/50"
              : "bg-gray-800/80 text-gray-300 border-gray-700/50 hover:bg-gray-700/80 hover:text-white dark:bg-gray-800/80 dark:text-gray-300 dark:border-gray-700/50 dark:hover:bg-gray-700/80 dark:hover:text-white"
          }`}
          title={
            theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"
          }
        >
          {theme === "dark" ? <FaSun size={18} /> : <FaMoon size={18} />}
        </button>
        <button
          onClick={() => toggle("timer")}
          className={`p-3 rounded-xl shadow-lg transition-all duration-300 hover:scale-110 backdrop-blur-sm border cursor-pointer ${
            active.timer
              ? "bg-green-500/90 text-white border-green-400/50"
              : timerRunning
              ? "bg-orange-500/90 text-white border-orange-400/50"
              : "bg-gray-800/80 text-gray-300 border-gray-700/50 hover:bg-gray-700/80 hover:text-white dark:bg-gray-800/80 dark:text-gray-300 dark:border-gray-700/50 dark:hover:bg-gray-700/80 dark:hover:text-white"
          }`}
          title={timerRunning ? `Timer: ${formatTime(timeLeft)}` : "Timer"}
        >
          {timerRunning ? (
            <div className="text-xs font-mono font-bold w-8 text-center">
              {formatTime(timeLeft)}
            </div>
          ) : (
            <FaClock size={18} />
          )}
        </button>
        <button
          onClick={() => toggle("todo")}
          className={`p-3 rounded-xl shadow-lg transition-all duration-300 hover:scale-110 backdrop-blur-sm border cursor-pointer ${
            active.todo
              ? "bg-purple-500/90 text-white border-purple-400/50"
              : "bg-gray-800/80 text-gray-300 border-gray-700/50 hover:bg-gray-700/80 hover:text-white dark:bg-gray-800/80 dark:text-gray-300 dark:border-gray-700/50 dark:hover:bg-gray-700/80 dark:hover:text-white"
          }`}
          title="Notes"
        >
          <FaBook size={18} />
        </button>
      </div>

      {/* Timer Modal */}
      {showTimer && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowTimer(false)}
        >
          <div
            className="bg-[var(--modal-bg)] backdrop-blur-md rounded-2xl p-8 border border-[var(--modal-border)] max-w-md w-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold text-[var(--text-primary)]">
                Pomodoro Timer
              </h3>
              <button
                onClick={() => setShowTimer(false)}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer p-2 rounded-lg hover:bg-[var(--button-bg)]"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Timer Mode Selection */}
            <div className="flex gap-2 mb-6">
              {(["pomodoro", "shortBreak", "longBreak"] as TimerMode[]).map(
                (mode) => (
                  <button
                    key={mode}
                    onClick={() => handleTimerModeChange(mode)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                      timerMode === mode
                        ? "bg-[var(--accent)] text-white"
                        : "bg-[var(--button-bg)] text-[var(--text-secondary)] hover:bg-[var(--button-hover)]"
                    }`}
                  >
                    {getModeLabel(mode)}
                  </button>
                )
              )}
            </div>

            <div className="text-center mb-6">
              <div
                className={`text-6xl font-mono font-bold mb-4 transition-colors ${getModeColor(
                  timerMode
                )} ${timerFinished ? "animate-pulse" : ""}`}
              >
                {timerRunning
                  ? formatTime(timeLeft)
                  : formatTime(timerDurations[timerMode] * 60)}
              </div>

              <div
                className={`text-lg font-medium mb-4 ${getModeColor(
                  timerMode
                )}`}
              >
                {getModeLabel(timerMode)}
                {timerMode === "pomodoro" && (
                  <span className="text-sm text-[var(--text-muted)] ml-2">
                    ({completedFocusSessions + 1}/{focusSessionsBeforeLongBreak}
                    )
                  </span>
                )}
              </div>

              {timerFinished && (
                <div className="text-[var(--accent)] text-lg font-medium mb-4 animate-pulse">
                  Time&apos;s up! ☕
                </div>
              )}

              {/* Auto-start toggle */}
              <div className="mb-6">
                <label className="flex items-center gap-3 text-[var(--text-secondary)] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoStart}
                    onChange={(e) => handleAutoStartChange(e.target.checked)}
                    className="w-4 h-4 text-[var(--accent)] bg-[var(--button-bg)] border-[var(--card-border)] rounded focus:ring-[var(--accent)] focus:ring-2"
                  />
                  <span>Auto-start next timer</span>
                </label>
              </div>

              {/* Custom Duration Settings */}
              <div className="mb-6">
                <button
                  onClick={() => setShowCustomSettings(!showCustomSettings)}
                  className="text-[var(--accent)] hover:text-[var(--accent-hover)] text-sm font-medium transition-colors cursor-pointer flex items-center gap-2"
                >
                  {showCustomSettings ? "Hide" : "Show"} Custom Times
                </button>

                {showCustomSettings && (
                  <div className="mt-4 p-4 bg-[var(--button-bg)] rounded-lg border border-[var(--card-border)]">
                    <h4 className="text-sm font-medium text-[var(--text-primary)] mb-3">
                      Custom Timer Durations (minutes)
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-sm text-[var(--text-secondary)]">
                          Focus Time:
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="120"
                          value={customDurations.pomodoro}
                          onChange={(e) =>
                            handleCustomDurationChange(
                              "pomodoro",
                              parseInt(e.target.value) || 25
                            )
                          }
                          className="w-16 px-2 py-1 text-sm bg-[var(--background)] border border-[var(--card-border)] rounded text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm text-[var(--text-secondary)]">
                          Short Break:
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="60"
                          value={customDurations.shortBreak}
                          onChange={(e) =>
                            handleCustomDurationChange(
                              "shortBreak",
                              parseInt(e.target.value) || 5
                            )
                          }
                          className="w-16 px-2 py-1 text-sm bg-[var(--background)] border border-[var(--card-border)] rounded text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm text-[var(--text-secondary)]">
                          Long Break:
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="60"
                          value={customDurations.longBreak}
                          onChange={(e) =>
                            handleCustomDurationChange(
                              "longBreak",
                              parseInt(e.target.value) || 15
                            )
                          }
                          className="w-16 px-2 py-1 text-sm bg-[var(--background)] border border-[var(--card-border)] rounded text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm text-[var(--text-secondary)]">
                          Focus Sessions before Long Break:
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={focusSessionsBeforeLongBreak}
                          onChange={(e) =>
                            handleFocusSessionsChange(
                              parseInt(e.target.value) || 4
                            )
                          }
                          className="w-16 px-2 py-1 text-sm bg-[var(--background)] border border-[var(--card-border)] rounded text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Save preferences toggle */}
              <div className="mb-6">
                <label className="flex items-center gap-3 text-[var(--text-secondary)] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={savePreferences}
                    onChange={(e) =>
                      handleSavePreferencesChange(e.target.checked)
                    }
                    className="w-4 h-4 text-[var(--accent)] bg-[var(--button-bg)] border-[var(--card-border)] rounded focus:ring-[var(--accent)] focus:ring-2"
                  />
                  <span>Save preferences</span>
                </label>
              </div>

              {/* Timer Controls */}
              <div className="flex gap-3 justify-center">
                {!timerRunning ? (
                  <button
                    onClick={startTimer}
                    className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white px-6 py-3 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <FaPlay size={14} />
                    Start
                  </button>
                ) : (
                  <button
                    onClick={pauseTimer}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <FaPause size={14} />
                    Pause
                  </button>
                )}
                <button
                  onClick={resetTimer}
                  className="bg-[var(--button-bg)] hover:bg-[var(--button-hover)] text-[var(--button-text)] px-6 py-3 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-2"
                >
                  <FaRedo size={14} />
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Start Info Modal */}
      {showInfo && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowInfo(false)}
        >
          <div
            className="bg-[var(--modal-bg)] backdrop-blur-md rounded-2xl p-8 border border-[var(--modal-border)] max-w-lg w-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold text-[var(--text-primary)]">
                Quick Start Guide
              </h3>
              <button
                onClick={() => setShowInfo(false)}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer p-2 rounded-lg hover:bg-[var(--button-bg)]"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div className="space-y-4 text-[var(--text-secondary)]">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[var(--accent)] rounded-full mt-2 flex-shrink-0"></div>
                <p>Use the master volume to control overall sound level</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[var(--accent)] rounded-full mt-2 flex-shrink-0"></div>
                <p>Mix individual sounds to create your perfect atmosphere</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[var(--accent)] rounded-full mt-2 flex-shrink-0"></div>
                <p>
                  Set a timer to take regular breaks using the Pomodoro
                  technique
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[var(--accent)] rounded-full mt-2 flex-shrink-0"></div>
                <p>
                  Enable &quot;Save preferences&quot; to remember your settings
                  across sessions
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[var(--accent)] rounded-full mt-2 flex-shrink-0"></div>
                <p>Toggle between light and dark themes for your comfort</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[var(--accent)] rounded-full mt-2 flex-shrink-0"></div>
                <p>
                  Use the notebook icon to manage your tasks and stay organized
                </p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[var(--card-border)]">
              <p className="text-sm text-[var(--text-muted)] text-center">
                Enjoy your perfect cafe atmosphere! ☕
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Todo List Modal */}
      {showTodoList && <TodoList onClose={() => setShowTodoList(false)} />}
    </>
  );
}

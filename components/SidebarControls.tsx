"use client";

import { FaPause, FaPlay, FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";

const SOUND_CONTROLS = [
  { label: "Café Chatter", file: "/audio/cafe-chatter.wav", key: "chatter" },
  {
    label: "Café With Live Guitar",
    file: "/audio/cafe-live-guitar.wav",
    key: "live-guitar",
  },
  { label: "Espresso Machine", file: "/audio/espresso.wav", key: "espresso" },
  { label: "Fireplace", file: "/audio/fireplace.wav", key: "fireplace" },
  {
    label: "Preparing Drinks",
    file: "/audio/preparing-drinks.wav",
    key: "preparing-drinks",
  },
  { label: "Rainy Day", file: "/audio/rainy-day.wav", key: "rainy-day" },
  { label: "Sunny Day", file: "/audio/sunny-day.wav", key: "sunny-day" },
  { label: "Typing", file: "/audio/typing.mp3", key: "typing" },
  {
    label: "Subway Station",
    file: "/audio/subway-station.wav",
    key: "subway-station",
  },
];

// Storage keys
const STORAGE_KEYS = {
  VOLUMES: "mycafevibes_volumes",
  PANS: "mycafevibes_pans",
  MASTER_VOLUME: "mycafevibes_master_volume",
  SHOW_PAN_CONTROLS: "mycafevibes_show_pan_controls",
  SAVE_PREFERENCES: "mycafevibes_save_preferences",
};

export default function SidebarControls({
  showPlayPause = false,
}: {
  showPlayPause?: boolean;
}) {
  const [volumes, setVolumes] = useState<Record<string, number>>(
    SOUND_CONTROLS.reduce((acc, { key }) => ({ ...acc, [key]: 0.7 }), {})
  );
  const [pans, setPans] = useState<Record<string, number>>(
    SOUND_CONTROLS.reduce((acc, { key }) => ({ ...acc, [key]: 0.5 }), {})
  );
  const [masterVolume, setMasterVolume] = useState(0.8);
  const [playing, setPlaying] = useState<{ [key: string]: boolean }>({});
  const [muted, setMuted] = useState(false);
  const [showPanControls, setShowPanControls] = useState(false);
  const [savePreferences, setSavePreferences] = useState(false);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement | null }>({});

  // Load preferences on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        // Load save preferences setting first
        const savedSavePrefs = localStorage.getItem(
          STORAGE_KEYS.SAVE_PREFERENCES
        );
        const shouldSave = savedSavePrefs ? JSON.parse(savedSavePrefs) : false;
        setSavePreferences(shouldSave);

        if (shouldSave) {
          // Load volumes
          const savedVolumes = localStorage.getItem(STORAGE_KEYS.VOLUMES);
          if (savedVolumes) {
            setVolumes(JSON.parse(savedVolumes));
          }

          // Load pans
          const savedPans = localStorage.getItem(STORAGE_KEYS.PANS);
          if (savedPans) {
            setPans(JSON.parse(savedPans));
          }

          // Load master volume
          const savedMasterVolume = localStorage.getItem(
            STORAGE_KEYS.MASTER_VOLUME
          );
          if (savedMasterVolume) {
            setMasterVolume(JSON.parse(savedMasterVolume));
          }

          // Load pan controls visibility
          const savedShowPanControls = localStorage.getItem(
            STORAGE_KEYS.SHOW_PAN_CONTROLS
          );
          if (savedShowPanControls) {
            setShowPanControls(JSON.parse(savedShowPanControls));
          }
        }
      } catch (error) {
        console.error("Error loading preferences:", error);
      }
    }
  }, []);

  // Save preferences whenever they change
  const saveToStorage = (
    key: string,
    value: string | number | boolean | Record<string, unknown>
  ) => {
    if (typeof window !== "undefined" && savePreferences) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error("Error saving preferences:", error);
      }
    }
  };

  useEffect(() => {
    const newRefs: { [key: string]: HTMLAudioElement | null } = {};
    SOUND_CONTROLS.forEach(({ file, key }) => {
      const audio = new Audio(file);
      audio.loop = true;
      newRefs[key] = audio;
    });
    audioRefs.current = newRefs;
  }, []);

  const togglePlay = (key: string) => {
    const audio = audioRefs.current[key];
    if (!audio) return;
    if (playing[key]) {
      audio.pause();
    } else {
      const effectiveVolume = muted ? 0 : (volumes[key] ?? 0.7) * masterVolume;
      audio.volume = effectiveVolume;
      audio.play();
    }
    setPlaying((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleVolumeChange = (key: string, value: number) => {
    setVolumes((prev) => ({ ...prev, [key]: value }));
    saveToStorage(STORAGE_KEYS.VOLUMES, { ...volumes, [key]: value });

    const audio = audioRefs.current[key];
    if (audio) {
      const effectiveVolume = muted ? 0 : value * masterVolume;
      audio.volume = effectiveVolume;
    }
  };

  const handlePanChange = (key: string, value: number) => {
    setPans((prev) => ({ ...prev, [key]: value }));
    saveToStorage(STORAGE_KEYS.PANS, { ...pans, [key]: value });

    const audio = audioRefs.current[key];
    if (audio) {
      // Convert pan value from -1 to 1 range to stereo panning
      const panValue = (value - 0.5) * 2; // Convert 0-1 to -1 to 1
      audio.style.transform = `translateX(${panValue * 50}%)`;
    }
  };

  const handleMasterVolumeChange = (value: number) => {
    setMasterVolume(value);
    setMuted(value === 0);
    saveToStorage(STORAGE_KEYS.MASTER_VOLUME, value);

    // Update all playing audio volumes
    Object.keys(audioRefs.current).forEach((key) => {
      const audio = audioRefs.current[key];
      if (audio && playing[key]) {
        const effectiveVolume = value === 0 ? 0 : (volumes[key] ?? 0.7) * value;
        audio.volume = effectiveVolume;
      }
    });
  };

  const toggleMute = () => {
    setMuted(!muted);

    // Update all playing audio volumes
    Object.keys(audioRefs.current).forEach((key) => {
      const audio = audioRefs.current[key];
      if (audio && playing[key]) {
        const effectiveVolume = !muted
          ? 0
          : (volumes[key] ?? 0.7) * masterVolume;
        audio.volume = effectiveVolume;
      }
    });
  };

  const handleShowPanControlsChange = (checked: boolean) => {
    setShowPanControls(checked);
    saveToStorage(STORAGE_KEYS.SHOW_PAN_CONTROLS, checked);
  };

  const handleSavePreferencesChange = (checked: boolean) => {
    setSavePreferences(checked);
    localStorage.setItem(
      STORAGE_KEYS.SAVE_PREFERENCES,
      JSON.stringify(checked)
    );

    // If turning off save preferences, clear all saved data
    if (!checked) {
      Object.values(STORAGE_KEYS).forEach((key) => {
        if (key !== STORAGE_KEYS.SAVE_PREFERENCES) {
          localStorage.removeItem(key);
        }
      });
    }
  };

  return (
    <aside className="w-full max-w-full lg:max-w-md max-h-[85vh] overflow-hidden flex flex-col relative z-30">
      {/* Master Volume Control */}
      <div className="bg-[var(--card-bg)] backdrop-blur-sm rounded-2xl p-6 border border-[var(--card-border)] mb-6 flex-shrink-0 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-[var(--text-primary)]">
            Master Volume
          </h3>
          <button
            onClick={toggleMute}
            className={`p-2 rounded-full transition-all duration-200 hover:scale-110 ${
              muted || masterVolume === 0
                ? "bg-red-500/90 text-white"
                : "bg-[var(--button-bg)] text-[var(--button-text)] hover:bg-[var(--button-hover)]"
            }`}
          >
            {muted || masterVolume === 0 ? (
              <FaVolumeMute size={16} />
            ) : (
              <FaVolumeUp size={16} />
            )}
          </button>
        </div>

        <div className="space-y-3">
          <div className="relative">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={masterVolume}
              onChange={(e) =>
                handleMasterVolumeChange(parseFloat(e.target.value))
              }
              className="w-full h-3 bg-[var(--slider-bg)] rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, var(--slider-fill) 0%, var(--slider-fill) ${
                  masterVolume * 100
                }%, var(--slider-bg) ${
                  masterVolume * 100
                }%, var(--slider-bg) 100%)`,
              }}
            />
            <div className="flex justify-between text-xs text-[var(--text-muted)] mt-1">
              <span>0</span>
              <span>100</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sound Mixer - Scrollable */}
      <div className="bg-[var(--card-bg)] backdrop-blur-sm rounded-2xl p-6 border border-[var(--card-border)] flex-1 overflow-hidden flex flex-col shadow-lg">
        <h2 className="text-2xl font-semibold mb-6 text-[var(--text-primary)] flex-shrink-0">
          Sound Mixer
        </h2>

        {/* Settings Panel - Always visible above sounds */}
        <div className="mb-6 pb-6 border-b border-[var(--card-border)] flex-shrink-0">
          <h3 className="text-lg font-medium mb-4 text-[var(--text-primary)]">
            Settings
          </h3>
          <div className="space-y-3 text-sm">
            <label className="flex items-center gap-3 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer">
              <input
                type="checkbox"
                checked={showPanControls}
                onChange={(e) => handleShowPanControlsChange(e.target.checked)}
                className="w-4 h-4 text-purple-500 bg-[var(--button-bg)] border-[var(--card-border)] rounded focus:ring-purple-500 focus:ring-2 cursor-pointer"
              />
              <span>Show pan controls</span>
            </label>
            <label className="flex items-center gap-3 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer">
              <input
                type="checkbox"
                checked={savePreferences}
                onChange={(e) => handleSavePreferencesChange(e.target.checked)}
                className="w-4 h-4 text-[var(--accent)] bg-[var(--button-bg)] border-[var(--card-border)] rounded focus:ring-[var(--accent)] focus:ring-2 cursor-pointer"
              />
              <span>Save preferences</span>
            </label>
          </div>
        </div>

        {/* Scrollable Sounds */}
        <div className="space-y-6 overflow-y-auto flex-1 pr-2">
          {SOUND_CONTROLS.map(({ label, key }) => (
            <div key={key} className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[var(--text-secondary)] font-medium">
                  {label}
                </span>
                <div className="flex items-center gap-3">
                  {showPlayPause && (
                    <button
                      onClick={() => togglePlay(key)}
                      className={`p-2 rounded-full transition-all duration-200 hover:scale-110 cursor-pointer ${
                        playing[key]
                          ? "bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]"
                          : "bg-[var(--button-bg)] text-[var(--button-text)] hover:bg-[var(--button-hover)]"
                      }`}
                    >
                      {playing[key] ? (
                        <FaPause size={12} />
                      ) : (
                        <FaPlay size={12} />
                      )}
                    </button>
                  )}
                  <FaVolumeUp className="text-[var(--text-muted)] text-sm" />
                </div>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volumes[key]}
                  onChange={(e) =>
                    handleVolumeChange(key, parseFloat(e.target.value))
                  }
                  className="w-full h-2 bg-[var(--slider-bg)] rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, var(--slider-fill) 0%, var(--slider-fill) ${
                      volumes[key] * 100
                    }%, var(--slider-bg) ${
                      volumes[key] * 100
                    }%, var(--slider-bg) 100%)`,
                  }}
                />
                <div className="flex justify-between text-xs text-[var(--text-muted)] mt-1">
                  <span>0</span>
                  <span>100</span>
                </div>
              </div>

              {/* Pan Control Slider */}
              {showPanControls && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                    <span>L</span>
                    <span>Pan</span>
                    <span>R</span>
                  </div>
                  <div className="relative">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={pans[key]}
                      onChange={(e) =>
                        handlePanChange(key, parseFloat(e.target.value))
                      }
                      className="w-full h-2 bg-[var(--slider-bg)] rounded-lg appearance-none cursor-pointer pan-slider"
                      style={{
                        background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${
                          pans[key] * 100
                        }%, var(--slider-bg) ${
                          pans[key] * 100
                        }%, var(--slider-bg) 100%)`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

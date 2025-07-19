"use client";

import { FaPause, FaPlay, FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";

const SOUND_CONTROLS = [
  { label: "Café Chatter", file: "/audio/cafe-chatter.mp3", key: "chatter" },
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

export default function SidebarControls({
  showPlayPause = false,
}: {
  showPlayPause?: boolean;
}) {
  const [volumes, setVolumes] = useState<Record<string, number>>(
    SOUND_CONTROLS.reduce((acc, { key }) => ({ ...acc, [key]: 0.7 }), {})
  );
  const [masterVolume, setMasterVolume] = useState(0.8);
  const [playing, setPlaying] = useState<{ [key: string]: boolean }>({});
  const [muted, setMuted] = useState(false);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement | null }>({});

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
    const audio = audioRefs.current[key];
    if (audio) {
      const effectiveVolume = muted ? 0 : value * masterVolume;
      audio.volume = effectiveVolume;
    }
  };

  const handleMasterVolumeChange = (value: number) => {
    setMasterVolume(value);
    setMuted(value === 0);

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

  return (
    <aside className="w-full space-y-8">
      {/* Master Volume Control */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">Master Volume</h3>
          <button
            onClick={toggleMute}
            className={`p-2 rounded-full transition-all duration-200 hover:scale-110 ${
              muted || masterVolume === 0
                ? "bg-red-500/90 text-white"
                : "bg-gray-600 text-gray-300 hover:bg-gray-500 hover:text-white"
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
              className="w-full h-3 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #10b981 0%, #10b981 ${
                  masterVolume * 100
                }%, #4b5563 ${masterVolume * 100}%, #4b5563 100%)`,
              }}
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>0</span>
              <span>100</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sound Mixer */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
        <h2 className="text-2xl font-semibold mb-6 text-white">Sound Mixer</h2>

        <div className="space-y-6">
          {SOUND_CONTROLS.map(({ label, key }) => (
            <div key={key} className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-200 font-medium">{label}</span>
                <div className="flex items-center gap-3">
                  {showPlayPause && (
                    <button
                      onClick={() => togglePlay(key)}
                      className={`p-2 rounded-full transition-all duration-200 hover:scale-110 ${
                        playing[key]
                          ? "bg-green-500 text-white hover:bg-green-600"
                          : "bg-gray-600 text-gray-300 hover:bg-gray-500 hover:text-white"
                      }`}
                    >
                      {playing[key] ? (
                        <FaPause size={12} />
                      ) : (
                        <FaPlay size={12} />
                      )}
                    </button>
                  )}
                  <FaVolumeUp className="text-gray-400 text-sm" />
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
                  className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #10b981 0%, #10b981 ${
                      volumes[key] * 100
                    }%, #4b5563 ${volumes[key] * 100}%, #4b5563 100%)`,
                  }}
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>0</span>
                  <span>100</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Settings Panel */}
      <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 border border-gray-700/30">
        <h3 className="text-lg font-medium mb-4 text-gray-200">Settings</h3>
        <div className="space-y-3 text-sm">
          <label className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 text-green-500 bg-gray-700 border-gray-600 rounded focus:ring-green-500 focus:ring-2"
            />
            <span>Show pan controls</span>
          </label>
          <label className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 text-green-500 bg-gray-700 border-gray-600 rounded focus:ring-green-500 focus:ring-2"
            />
            <span>Save preferences</span>
          </label>
        </div>
      </div>
    </aside>
  );
}

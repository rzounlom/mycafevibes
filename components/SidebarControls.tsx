"use client";

import { FaPause, FaPlay, FaVolumeUp } from "react-icons/fa";
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
  const [playing, setPlaying] = useState<{ [key: string]: boolean }>({});
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
      audio.volume = volumes[key] ?? 0.7;
      audio.play();
    }
    setPlaying((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleVolumeChange = (key: string, value: number) => {
    setVolumes((prev) => ({ ...prev, [key]: value }));
    const audio = audioRefs.current[key];
    if (audio) audio.volume = value;
  };

  return (
    <aside className="w-full max-w-xs lg:ml-10 mt-10 lg:mt-0 space-y-6">
      <div className="flex flex-col gap-4">
        {SOUND_CONTROLS.map(({ label, key }) => (
          <div key={key} className="space-y-1">
            <div className="flex items-center justify-between">
              <span>{label}</span>
              <div className="flex gap-2">
                {showPlayPause && (
                  <button
                    onClick={() => togglePlay(key)}
                    className="text-white hover:text-green-400 transition hover:cursor-pointer"
                  >
                    {playing[key] ? <FaPause /> : <FaPlay />}
                  </button>
                )}
                <FaVolumeUp className="text-sm" />
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volumes[key]}
              onChange={(e) =>
                handleVolumeChange(key, parseFloat(e.target.value))
              }
              className="w-full accent-white"
            />
          </div>
        ))}
      </div>

      {/* Toggle checkboxes */}
      <div className="space-y-2 text-sm text-gray-300">
        <label className="flex items-center gap-2">
          <input type="checkbox" /> show pan controls
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" /> save preferences
        </label>
      </div>
    </aside>
  );
}

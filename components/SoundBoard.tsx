"use client";

import { FaPause, FaPlay } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";

const SOUND_OPTIONS = [
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

export default function SoundBoard() {
  const [playing, setPlaying] = useState<{ [key: string]: boolean }>({});
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement | null }>({});

  useEffect(() => {
    const newRefs: { [key: string]: HTMLAudioElement | null } = {};
    SOUND_OPTIONS.forEach((sound) => {
      const audio = new Audio(sound.file);
      audio.loop = true;
      newRefs[sound.key] = audio;
    });
    audioRefs.current = newRefs;
  }, []);

  const toggleSound = (key: string) => {
    const audio = audioRefs.current[key];
    if (!(audio instanceof HTMLAudioElement)) return;

    if (playing[key]) {
      audio.pause();
    } else {
      audio.play();
    }

    setPlaying((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-4xl">
      {SOUND_OPTIONS.map((sound) => (
        <button
          key={sound.key}
          onClick={() => toggleSound(sound.key)}
          className={`px-6 py-4 rounded-2xl text-lg transition duration-300 hover:cursor-pointer font-medium border shadow-md flex items-center justify-center gap-3 ${
            playing[sound.key]
              ? "bg-green-400 text-white hover:bg-green-500"
              : "bg-white text-gray-500 hover:bg-amber-200"
          }`}
        >
          <p>{playing[sound.key] ? <FaPause /> : <FaPlay />}</p>
          <p className="w-[90%]">{sound.label}</p>
        </button>
      ))}
    </div>
  );
}

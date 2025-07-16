"use client";

import { FaClock, FaListUl, FaMoon } from "react-icons/fa";

import { useState } from "react";

export default function ControlIcons() {
  const [active, setActive] = useState({
    timer: false,
    darkMode: false,
    todo: false,
  });

  const toggle = (key: keyof typeof active) => {
    setActive((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="fixed top-4 right-4 flex gap-3 z-50">
      <button
        onClick={() => toggle("timer")}
        className="bg-white/80 text-gray-800 p-2 rounded-full shadow hover:bg-white transition hover:cursor-pointer"
        title="Toggle Timer"
      >
        <FaClock />
      </button>
      <button
        onClick={() => toggle("darkMode")}
        className="bg-white/80 text-gray-800 p-2 rounded-full shadow hover:bg-white transition hover:cursor-pointer"
        title="Toggle Dark Mode"
      >
        <FaMoon />
      </button>
      <button
        onClick={() => toggle("todo")}
        className="bg-white/80 text-gray-800 p-2 rounded-full shadow hover:bg-white transition hover:cursor-pointer"
        title="Toggle To-Do"
      >
        <FaListUl />
      </button>
    </div>
  );
}

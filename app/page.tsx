import ControlIcons from "@/components/ControlIcons";
import SidebarControls from "@/components/SidebarControls";

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-gray-900 text-white font-sans relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px),
                           radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Floating Icons (top right) */}
      <ControlIcons />

      {/* Center Content */}
      <div className="relative z-10 flex flex-col lg:flex-row items-start justify-between w-full h-full p-8 lg:p-12 max-w-7xl mx-auto">
        {/* Left Text Content */}
        <div className="flex-1 lg:pr-16 mb-12 lg:mb-0">
          <h1 className="text-6xl lg:text-8xl font-bold font-serif leading-tight mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            I Miss
            <br />
            My Cafe
          </h1>
          <p className="text-xl lg:text-2xl text-gray-300 mb-8 leading-relaxed">
            Take a seat and stay awhile.
          </p>

          {/* Description */}
          <div className="text-gray-400 text-lg leading-relaxed max-w-2xl">
            <p className="mb-4">
              Missing the ambient sounds of your favorite coffee shop? Recreate
              that perfect cafe atmosphere with carefully curated sounds.
            </p>
            <p>
              Mix and match different audio elements to create your ideal
              working environment, just like being back at your local cafe.
            </p>
          </div>

          {/* Quick Start Guide */}
          <div className="mt-8 p-6 bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/30">
            <h3 className="text-lg font-semibold text-white mb-3">
              Quick Start
            </h3>
            <div className="text-sm text-gray-300 space-y-2">
              <p>• Use the master volume to control overall sound level</p>
              <p>• Mix individual sounds to create your perfect atmosphere</p>
              <p>• Set a timer to take regular breaks</p>
              <p>• Save your preferences for next time</p>
            </div>
          </div>
        </div>

        {/* Right Sidebar Controls */}
        <div className="w-full lg:w-96 lg:flex-shrink-0">
          <SidebarControls showPlayPause={true} />
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 absolute bottom-4 left-6 text-sm text-gray-500">
        <p>
          code and illustrations by ifthencreate, sound design by evan cook,
        </p>
        <p>inspired by imissmybar, imisstheoffice, and coffitivity.</p>
      </footer>
    </main>
  );
}

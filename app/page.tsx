import ControlIcons from "@/components/ControlIcons";
import SidebarControls from "@/components/SidebarControls";

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-gray-700 text-white font-sans relative overflow-hidden">
      {/* Floating Icons (top right) */}
      <ControlIcons />

      {/* Center Content */}
      <div className="flex flex-col lg:flex-row items-center justify-between w-full h-full p-6">
        {/* Left Text and Playlist */}
        <div className="max-w-md flex flex-col gap-6">
          <h1 className="text-5xl font-extrabold font-serif">
            I Miss
            <br />
            My Cafe
          </h1>
          <p className="text-lg">Take a seat and stay awhile.</p>

          {/* Playlist embed placeholder */}
          <div className="bg-black/40 w-full h-64 rounded shadow flex items-center justify-center">
            <p className="text-sm text-gray-300">[Playlist Embed]</p>
          </div>
        </div>

        {/* Right Sidebar Controls */}
        <SidebarControls showPlayPause={true} />
      </div>

      {/* Footer */}
      <footer className="absolute bottom-2 left-4 text-xs text-gray-300">
        code and illustrations by ifthencreate, sound design by evan cook,
        inspired by imissmybar, imisstheoffice, and coffitivity.
      </footer>
    </main>
  );
}

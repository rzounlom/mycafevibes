import ControlIcons from "@/components/ControlIcons";
import SidebarControls from "@/components/SidebarControls";
import SpotifyPlayer from "@/components/SpotifyPlayer";

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-[var(--background)] text-[var(--foreground)] font-sans relative overflow-hidden">
      {/* Cafe Sketch Background */}
      <div className="cafe-sketch-bg"></div>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-3">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(0,0,0,0.1) 1px, transparent 1px),
                           radial-gradient(circle at 75% 75%, rgba(0,0,0,0.1) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Floating Icons (top right) */}
      <ControlIcons />

      {/* Center Content */}
      <div className="relative z-10 flex flex-col lg:flex-row items-start justify-between w-full h-full p-4 lg:pt-12 lg:p-4 max-w-7xl mx-auto mt-14 lg:mt-7.5">
        {/* Left Text Content */}
        <div className="flex-1 pr-0 lg:pr-6 mb-8 lg:mb-0">
          <h1 className="text-6xl lg:text-8xl font-bold font-serif leading-tight mb-6 bg-gradient-to-r from-[var(--text-primary)] to-[var(--text-secondary)] bg-clip-text text-transparent whitespace-nowrap">
            MyCafeVibes
          </h1>
          <p className="text-xl lg:text-2xl text-[var(--text-secondary)] mb-1 leading-relaxed">
            Take a seat and stay awhile.
          </p>

          {/* Description */}
          <div className="text-[var(--text-muted)] text-lg leading-relaxed max-w-2xl mb-4">
            <p className="mb-4">
              Missing the ambient sounds of your favorite coffee shop? Recreate
              that perfect cafe atmosphere with carefully curated sounds.
            </p>
            <p>
              Mix and match different audio elements to create your ideal
              working environment, just like being back at your local cafe.
            </p>
          </div>

          {/* Spotify Playlist Section */}
          <SpotifyPlayer
            clientId={process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || ""}
            defaultPlaylistId="37i9dQZF1DX5Vy6DFOcx00"
          />
        </div>

        {/* Right Sidebar Controls */}
        <div className="w-full lg:w-96">
          <SidebarControls showPlayPause={true} />
        </div>
      </div>

      {/* Floating Buy Us a Coffee Button */}
      <a
        href="https://ko-fi.com/mycafevibes"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 left-6 lg:top-6 lg:bottom-auto z-50 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-medium text-sm flex items-center gap-2 backdrop-blur-sm border border-blue-400/30 hover:cursor-pointer"
      >
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M18.5 3H6c-1.1 0-2 .9-2 2v5.71c0 3.83 2.95 7.18 6.78 7.29 3.96.12 7.22-3.06 7.22-7v-1h.5c1.93 0 3.5-1.57 3.5-3.5S20.43 3 18.5 3zM16 5v3h-2V5h2zm-2.5 0c-.83 0-1.5.67-1.5 1.5S12.67 8 13.5 8 15 7.33 15 6.5 14.33 5 13.5 5zm5.5 5.5c0 2.76-2.24 5-5 5s-5-2.24-5-5V5h10v5.5z" />
          <path d="M2 19h18v2H2z" />
        </svg>
        Buy us a coffee?
      </a>

      {/* Footer */}
      <footer className="text-center relative z-10 absolute bottom-4 left-6 text-sm text-[var(--text-muted)] mt-6 lg:mt-0">
        <p>Created by MyCafeVibes © 2025. All rights reserved.</p>
      </footer>
    </main>
  );
}

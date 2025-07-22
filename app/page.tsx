import ControlIcons from "@/components/ControlIcons";
import SidebarControls from "@/components/SidebarControls";
import SpotifyPlayer from "@/components/SpotifyPlayer";

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-[var(--background)] text-[var(--foreground)] font-sans relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
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
      <div className="relative z-10 flex flex-col lg:flex-row items-start justify-between w-full h-full p-4 lg:p-12 max-w-7xl mx-auto mt-7.5">
        {/* Left Text Content */}
        <div className="flex-1 lg:pr-16 mb-8 lg:mb-0">
          <h1 className="text-6xl lg:text-8xl font-bold font-serif leading-tight mb-6 bg-gradient-to-r from-[var(--text-primary)] to-[var(--text-secondary)] bg-clip-text text-transparent whitespace-nowrap">
            Cloud Cafe
          </h1>
          <p className="text-xl lg:text-2xl text-[var(--text-secondary)] mb-1 leading-relaxed">
            Take a seat and stay awhile.
          </p>

          {/* Description */}
          <div className="text-[var(--text-muted)] text-lg leading-relaxed max-w-2xl mb-8 lg:mb-7.5">
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
        <div className="w-full lg:w-96 lg:flex-shrink-0">
          <SidebarControls showPlayPause={true} />
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center relative z-10 absolute bottom-4 left-6 text-sm text-[var(--text-muted)] mt-6 lg:mt-0">
        <p>Created by Cloud Cafe © 2025. All rights reserved.</p>
      </footer>
    </main>
  );
}

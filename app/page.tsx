import ControlIcons from "@/components/ControlIcons";
import SidebarControls from "@/components/SidebarControls";

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
      <div className="relative z-10 flex flex-col lg:flex-row items-start justify-between w-full h-full p-4 lg:p-12 max-w-7xl mx-auto mt-14">
        {/* Left Text Content */}
        <div className="flex-1 lg:pr-16 mb-8 lg:mb-0">
          <h1 className="text-6xl lg:text-8xl font-bold font-serif leading-tight mb-6 bg-gradient-to-r from-[var(--text-primary)] to-[var(--text-secondary)] bg-clip-text text-transparent whitespace-nowrap">
            Cloud Cafe
          </h1>
          <p className="text-xl lg:text-2xl text-[var(--text-secondary)] mb-8 leading-relaxed">
            Take a seat and stay awhile.
          </p>

          {/* Description */}
          <div className="text-[var(--text-muted)] text-lg leading-relaxed max-w-2xl mb-8">
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
          <div className="bg-[var(--card-bg)] backdrop-blur-sm rounded-2xl p-6 border border-[var(--card-border)] shadow-lg w-full max-w-full ">
            <h2 className="text-2xl font-semibold mb-4 text-[var(--text-primary)]">
              Cafe Vibes Playlist
            </h2>
            <p className="text-[var(--text-secondary)] mb-4">
              Enjoy our curated Spotify playlist featuring the perfect cafe
              atmosphere music.
            </p>
            <div className="bg-[var(--button-bg)] rounded-lg p-4 border border-[var(--card-border)]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--text-primary)]">
                    Cloud Cafe Vibes
                  </h3>
                  <p className="text-sm text-[var(--text-muted)]">
                    Curated by Cloud Cafe
                  </p>
                </div>
              </div>
              <div className="bg-[var(--background)] rounded-lg p-4 border border-[var(--card-border)]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[var(--text-secondary)]">
                    Now Playing
                  </span>
                  <span className="text-xs text-[var(--text-muted)]">
                    3:24 / 4:12
                  </span>
                </div>
                <div className="w-full bg-[var(--slider-bg)] rounded-full h-2 mb-3">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: "78%" }}
                  ></div>
                </div>
                <div className="flex items-center gap-3">
                  <button className="p-2 rounded-full bg-[var(--button-bg)] text-[var(--text-primary)] hover:bg-[var(--button-hover)] transition-colors cursor-pointer">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </button>
                  <button className="p-2 rounded-full bg-[var(--button-bg)] text-[var(--text-primary)] hover:bg-[var(--button-hover)] transition-colors cursor-pointer">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                    </svg>
                  </button>
                  <button className="p-2 rounded-full bg-[var(--button-bg)] text-[var(--text-primary)] hover:bg-[var(--button-hover)] transition-colors cursor-pointer">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </button>
                  <div className="flex-1"></div>
                  <button className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar Controls */}
        <div className="w-full lg:w-96 lg:flex-shrink-0">
          <SidebarControls showPlayPause={true} />
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 absolute bottom-4 left-6 text-sm text-[var(--text-muted)]">
        <p>Created by Cloud Cafe © 2025. All rights reserved.</p>
      </footer>
    </main>
  );
}

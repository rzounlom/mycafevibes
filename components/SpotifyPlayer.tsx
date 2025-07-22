"use client";

import {
  FaPause,
  FaPlay,
  FaRandom,
  FaRedo,
  FaStepBackward,
  FaStepForward,
} from "react-icons/fa";
import { useEffect, useRef, useState } from "react";

// Spotify Web Playback SDK types
declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
    Spotify: {
      Player: new (config: {
        name: string;
        getOAuthToken: (callback: (token: string) => void) => void;
      }) => {
        addListener: (event: string, callback: (data: unknown) => void) => void;
        connect: () => Promise<boolean>;
      };
    };
  }
}

interface SpotifyPlayerState {
  paused: boolean;
  position: number;
  duration: number;
  track_window: {
    current_track: {
      id: string;
      name: string;
      artists: Array<{ name: string }>;
      album: {
        name: string;
        images: Array<{ url: string }>;
      };
    };
  };
}

interface SpotifyTrack {
  id: string;
  name: string;
  artist: string;
  album: string;
  duration: number;
  image: string;
}

interface SpotifyPlayerProps {
  clientId: string;
  defaultPlaylistId: string;
}

export default function SpotifyPlayer({
  clientId,
  defaultPlaylistId,
}: SpotifyPlayerProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<SpotifyTrack | null>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [volume, setVolume] = useState(50);
  const [playlistTracks, setPlaylistTracks] = useState<SpotifyTrack[]>([]);
  const [currentPlaylistId, setCurrentPlaylistId] = useState(defaultPlaylistId);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  // Default cafe playlist tracks (fallback when not connected)
  const defaultTracks: SpotifyTrack[] = [
    {
      id: "1",
      name: "Coffee Shop Vibes",
      artist: "Cafe Ambience",
      album: "Cloud Cafe Collection",
      duration: 252,
      image:
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h=300&fit=crop&crop=center",
    },
    {
      id: "2",
      name: "Morning Brew",
      artist: "Jazz Ensemble",
      album: "Cloud Cafe Collection",
      duration: 198,
      image:
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h=300&fit=crop&crop=center",
    },
  ];

  // Initialize with default tracks
  useEffect(() => {
    setPlaylistTracks(defaultTracks);
    setCurrentTrack(defaultTracks[0]);
    setDuration(defaultTracks[0].duration);
  }, []);

  // Spotify Web Playback SDK initialization
  useEffect(() => {
    if (typeof window !== "undefined" && accessToken) {
      // Only initialize SDK when we have a valid access token
      const script = document.createElement("script");
      script.src = "https://sdk.scdn.co/spotify-player.js";
      script.async = true;

      script.onload = () => {
        if (window.onSpotifyWebPlaybackSDKReady) {
          window.onSpotifyWebPlaybackSDKReady();
        }
      };

      document.body.appendChild(script);

      window.onSpotifyWebPlaybackSDKReady = () => {
        const player = new window.Spotify.Player({
          name: "Cloud Cafe Player",
          getOAuthToken: (cb) => {
            cb(accessToken);
          },
        });

        player.addListener("ready", (data: unknown) => {
          const { device_id } = data as { device_id: string };
          setDeviceId(device_id);
          setIsConnected(true);
        });

        player.addListener("not_ready", () => {
          setIsConnected(false);
        });

        player.addListener("player_state_changed", (data: unknown) => {
          const state = data as SpotifyPlayerState | null;
          if (state) {
            setIsPlaying(!state.paused);
            setProgress(state.position);
            setDuration(state.duration);

            if (state.track_window.current_track) {
              setCurrentTrack({
                id: state.track_window.current_track.id,
                name: state.track_window.current_track.name,
                artist: state.track_window.current_track.artists[0].name,
                album: state.track_window.current_track.album.name,
                duration: state.duration,
                image:
                  state.track_window.current_track.album.images[0]?.url || "",
              });
            }
          }
        });

        player.connect().catch((error: Error) => {
          console.error("Failed to connect to Spotify:", error);
          setIsConnected(false);
        });
      };
    }
  }, [accessToken]);

  // Progress bar update
  useEffect(() => {
    if (isPlaying && duration > 0) {
      progressInterval.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= duration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1000;
        });
      }, 1000);
    } else {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    }

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [isPlaying, duration]);

  // Spotify API functions
  const callSpotifyAPI = async (
    endpoint: string,
    method = "GET",
    body?: Record<string, unknown>
  ) => {
    if (!accessToken) return null;

    try {
      const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
        method,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      if (response.status === 401) {
        // Token expired or invalid
        console.error("Spotify token expired or invalid");
        disconnectSpotify();
        return null;
      }

      if (!response.ok) {
        console.error(
          `Spotify API error: ${response.status} ${response.statusText}`
        );
        return null;
      }

      return response.json();
    } catch (error) {
      console.error("Spotify API call failed:", error);
      return null;
    }
  };

  const playPause = async () => {
    if (isConnected && deviceId) {
      if (isPlaying) {
        await callSpotifyAPI("/me/player/pause", "PUT");
      } else {
        await callSpotifyAPI("/me/player/play", "PUT");
      }
    } else {
      // Fallback for demo mode
      setIsPlaying(!isPlaying);
    }
  };

  const nextTrack = async () => {
    if (isConnected && deviceId) {
      await callSpotifyAPI("/me/player/next", "POST");
    } else {
      // Fallback for demo mode
      const currentIndex = playlistTracks.findIndex(
        (track) => track.id === currentTrack?.id
      );
      const nextIndex = (currentIndex + 1) % playlistTracks.length;
      setCurrentTrack(playlistTracks[nextIndex]);
      setProgress(0);
      setDuration(playlistTracks[nextIndex].duration);
    }
  };

  const previousTrack = async () => {
    if (isConnected && deviceId) {
      await callSpotifyAPI("/me/player/previous", "POST");
    } else {
      // Fallback for demo mode
      const currentIndex = playlistTracks.findIndex(
        (track) => track.id === currentTrack?.id
      );
      const prevIndex =
        currentIndex === 0 ? playlistTracks.length - 1 : currentIndex - 1;
      setCurrentTrack(playlistTracks[prevIndex]);
      setProgress(0);
      setDuration(playlistTracks[prevIndex].duration);
    }
  };

  const toggleShuffle = async () => {
    if (isConnected && deviceId) {
      await callSpotifyAPI(`/me/player/shuffle?state=${!shuffle}`, "PUT");
      setShuffle(!shuffle);
    } else {
      setShuffle(!shuffle);
    }
  };

  const toggleRepeat = async () => {
    if (isConnected && deviceId) {
      const repeatMode = repeat ? "off" : "track";
      await callSpotifyAPI(`/me/player/repeat?state=${repeatMode}`, "PUT");
      setRepeat(!repeat);
    } else {
      setRepeat(!repeat);
    }
  };

  const seekTo = async (position: number) => {
    if (isConnected && deviceId) {
      await callSpotifyAPI(`/me/player/seek?position_ms=${position}`, "PUT");
    } else {
      setProgress(position);
    }
  };

  const connectSpotify = () => {
    const scopes = [
      "user-read-private",
      "user-read-email",
      "user-read-playback-state",
      "user-modify-playback-state",
      "user-read-currently-playing",
      "playlist-read-private",
      "playlist-read-collaborative",
    ];

    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(
      window.location.origin
    )}&scope=${encodeURIComponent(scopes.join(" "))}`;

    window.location.href = authUrl;
  };

  const disconnectSpotify = () => {
    setAccessToken(null);
    setDeviceId(null);
    setIsConnected(false);
    setIsPlaying(false);
    setCurrentTrack(null);
    setProgress(0);
    setDuration(0);

    // Clear stored tokens
    localStorage.removeItem("spotify_access_token");
    localStorage.removeItem("spotify_token_expires");

    // Reset to default tracks
    setPlaylistTracks(defaultTracks);
    setCurrentTrack(defaultTracks[0]);
    setDuration(defaultTracks[0].duration);
  };

  // Handle auth callback
  useEffect(() => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const token = params.get("access_token");
    const expiresIn = params.get("expires_in");

    if (token) {
      setAccessToken(token);

      // Store token with expiration
      if (expiresIn) {
        const expiresAt = Date.now() + parseInt(expiresIn) * 1000;
        localStorage.setItem("spotify_token_expires", expiresAt.toString());
      }
      localStorage.setItem("spotify_access_token", token);

      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      // Check for existing token
      const existingToken = localStorage.getItem("spotify_access_token");
      const expiresAt = localStorage.getItem("spotify_token_expires");

      if (existingToken && expiresAt && Date.now() < parseInt(expiresAt)) {
        setAccessToken(existingToken);
      } else if (existingToken) {
        // Token expired, clear it
        localStorage.removeItem("spotify_access_token");
        localStorage.removeItem("spotify_token_expires");
      }
    }
  }, []);

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="bg-[var(--card-bg)] backdrop-blur-sm rounded-2xl p-6 border border-[var(--card-border)] shadow-lg w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
          Cafe Vibes Playlist
        </h2>
        {isConnected ? (
          <button
            onClick={disconnectSpotify}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors cursor-pointer text-sm font-medium"
          >
            Disconnect
          </button>
        ) : (
          <button
            onClick={connectSpotify}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors cursor-pointer text-sm font-medium"
          >
            Connect Spotify
          </button>
        )}
      </div>

      <p className="text-[var(--text-secondary)] mb-4">
        {isConnected
          ? "Connected to Spotify - Enjoy your personalized cafe atmosphere!"
          : "Enjoy our curated cafe atmosphere music. Connect your Spotify for personalized playlists."}
      </p>

      {isConnected ? (
        // Custom player controls when connected to Spotify
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
                {currentTrack?.name || "Cloud Cafe Vibes"}
              </h3>
              <p className="text-sm text-[var(--text-muted)]">
                {currentTrack?.artist || "Curated by Cloud Cafe"}
              </p>
            </div>
          </div>

          <div className="bg-[var(--background)] rounded-lg p-4 border border-[var(--card-border)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[var(--text-secondary)]">
                {isPlaying ? "Now Playing" : "Paused"}
              </span>
              <span className="text-xs text-[var(--text-muted)]">
                {formatTime(progress)} / {formatTime(duration)}
              </span>
            </div>

            <div className="relative mb-3">
              <input
                type="range"
                min="0"
                max={duration}
                value={progress}
                onChange={(e) => seekTo(parseInt(e.target.value))}
                className="w-full h-2 bg-[var(--slider-bg)] rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, var(--slider-fill) 0%, var(--slider-fill) ${
                    (progress / duration) * 100
                  }%, var(--slider-bg) ${
                    (progress / duration) * 100
                  }%, var(--slider-bg) 100%)`,
                }}
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={previousTrack}
                className="p-2 rounded-full bg-[var(--button-bg)] text-[var(--text-primary)] hover:bg-[var(--button-hover)] transition-colors cursor-pointer"
                title="Previous"
              >
                <FaStepBackward size={14} />
              </button>
              <button
                onClick={playPause}
                className="p-3 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors cursor-pointer"
                title="Play/Pause"
              >
                {isPlaying ? <FaPause size={16} /> : <FaPlay size={16} />}
              </button>
              <button
                onClick={nextTrack}
                className="p-2 rounded-full bg-[var(--button-bg)] text-[var(--text-primary)] hover:bg-[var(--button-hover)] transition-colors cursor-pointer"
                title="Next"
              >
                <FaStepForward size={14} />
              </button>
              <div className="flex-1"></div>
              <button
                onClick={toggleShuffle}
                className={`p-2 rounded-full transition-colors cursor-pointer ${
                  shuffle
                    ? "bg-green-500 text-white"
                    : "bg-[var(--button-bg)] text-[var(--text-primary)] hover:bg-[var(--button-hover)]"
                }`}
                title="Shuffle"
              >
                <FaRandom size={14} />
              </button>
              <button
                onClick={toggleRepeat}
                className={`p-2 rounded-full transition-colors cursor-pointer ${
                  repeat
                    ? "bg-green-500 text-white"
                    : "bg-[var(--button-bg)] text-[var(--text-primary)] hover:bg-[var(--button-hover)]"
                }`}
                title="Repeat"
              >
                <FaRedo size={14} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Spotify embed when not connected
        <div className="w-full">
          <iframe
            data-testid="embed-iframe"
            style={{ borderRadius: "12px" }}
            src="https://open.spotify.com/embed/album/1nMHkGDJwTvoW3LTTdUVwA?utm_source=generator"
            width="100%"
            height="352"
            frameBorder="0"
            allowFullScreen
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            title="Cafe Vibes Playlist"
          />
        </div>
      )}
    </div>
  );
}

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
  // TODO: Implement Spotify connection functionality
  // const [isConnected, setIsConnected] = useState(false);
  // const [isPlaying, setIsPlaying] = useState(false);
  // const [currentTrack, setCurrentTrack] = useState<SpotifyTrack | null>(null);
  // const [progress, setProgress] = useState(0);
  // const [duration, setDuration] = useState(0);
  // const [shuffle, setShuffle] = useState(false);
  // const [repeat, setRepeat] = useState(false);
  // const [volume, setVolume] = useState(50);
  // const [playlistTracks, setPlaylistTracks] = useState<SpotifyTrack[]>([]);
  // const [currentPlaylistId, setCurrentPlaylistId] = useState(defaultPlaylistId);
  // const [accessToken, setAccessToken] = useState<string | null>(null);
  // const [deviceId, setDeviceId] = useState<string | null>(null);
  // const progressInterval = useRef<NodeJS.Timeout | null>(null);

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

  // TODO: Initialize with default tracks
  // useEffect(() => {
  //   setPlaylistTracks(defaultTracks);
  //   setCurrentTrack(defaultTracks[0]);
  //   setDuration(defaultTracks[0].duration);
  // }, []);

  // TODO: Spotify Web Playback SDK initialization
  // useEffect(() => {
  //   if (typeof window !== "undefined" && accessToken) {
  //     // Only initialize SDK when we have a valid access token
  //     const script = document.createElement("script");
  //     script.src = "https://sdk.scdn.co/spotify-player.js";
  //     script.async = true;

  //     script.onload = () => {
  //       if (window.onSpotifyWebPlaybackSDKReady) {
  //         window.onSpotifyWebPlaybackSDKReady();
  //       }
  //     };

  //     document.body.appendChild(script);

  //     window.onSpotifyWebPlaybackSDKReady = () => {
  //       const player = new window.Spotify.Player({
  //         name: "MyCafeVibes Player",
  //         getOAuthToken: (cb) => {
  //           cb(accessToken);
  //         },
  //       });

  //       player.addListener("ready", (data: unknown) => {
  //         const { device_id } = data as { device_id: string };
  //         setDeviceId(device_id);
  //         setIsConnected(true);
  //       });

  //       player.addListener("not_ready", () => {
  //         setIsConnected(false);
  //       });

  //       player.addListener("player_state_changed", (data: unknown) => {
  //         const state = data as SpotifyPlayerState | null;
  //         if (state) {
  //           setIsPlaying(!state.paused);
  //           setProgress(state.position);
  //           setDuration(state.duration);

  //           if (state.track_window.current_track) {
  //             setCurrentTrack({
  //               id: state.track_window.current_track.id,
  //               name: state.track_window.current_track.name,
  //               artist: state.track_window.current_track.artists[0].name,
  //               album: state.track_window.current_track.album.name,
  //               duration: state.duration,
  //               image:
  //                 state.track_window.current_track.album.images[0]?.url || "",
  //             });
  //           }
  //         }
  //       });

  //       player.connect().catch((error: Error) => {
  //         console.error("Failed to connect to Spotify:", error);
  //         setIsConnected(false);
  //       });
  //     };
  //   }
  // }, [accessToken]);

  // TODO: Progress bar update
  // useEffect(() => {
  //   if (isPlaying && duration > 0) {
  //     progressInterval.current = setInterval(() => {
  //       setProgress((prev) => {
  //         if (prev >= duration) {
  //           setIsPlaying(false);
  //           return 0;
  //         }
  //         return prev + 1000;
  //       });
  //     }, 1000);
  //   } else {
  //     if (progressInterval.current) {
  //       clearInterval(progressInterval.current);
  //     }
  //   }

  //   return () => {
  //     if (progressInterval.current) {
  //       clearInterval(progressInterval.current);
  //     }
  //   };
  // }, [isPlaying, duration]);

  // TODO: Spotify API functions
  // const callSpotifyAPI = async (
  //   endpoint: string,
  //   method = "GET",
  //   body?: Record<string, unknown>
  // ) => {
  //   if (!accessToken) return null;

  //   try {
  //     const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
  //       method,
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //         "Content-Type": "application/json",
  //       },
  //       body: body ? JSON.stringify(body) : undefined,
  //     });

  //     if (response.status === 401) {
  //       // Token expired or invalid
  //       console.error("Spotify token expired or invalid");
  //       disconnectSpotify();
  //       return null;
  //     }

  //     if (!response.ok) {
  //       console.error(
  //         `Spotify API error: ${response.status} ${response.statusText}`
  //       );
  //       return null;
  //     }

  //     return response.json();
  //   } catch (error) {
  //     console.error("Spotify API call failed:", error);
  //     return null;
  //   }
  // };

  // TODO: Player control functions
  // const playPause = async () => {
  //   if (isConnected && deviceId) {
  //     if (isPlaying) {
  //       await callSpotifyAPI("/me/player/pause", "PUT");
  //     } else {
  //       await callSpotifyAPI("/me/player/play", "PUT");
  //     }
  //   } else {
  //     // Fallback for demo mode
  //     setIsPlaying(!isPlaying);
  //   }
  // };

  // const nextTrack = async () => {
  //   if (isConnected && deviceId) {
  //     await callSpotifyAPI("/me/player/next", "POST");
  //   } else {
  //     // Fallback for demo mode
  //     const currentIndex = playlistTracks.findIndex(
  //       (track) => track.id === currentTrack?.id
  //     );
  //     const nextIndex = (currentIndex + 1) % playlistTracks.length;
  //     setCurrentTrack(playlistTracks[nextIndex]);
  //     setProgress(0);
  //     setDuration(playlistTracks[nextIndex].duration);
  //   }
  // };

  // const previousTrack = async () => {
  //   if (isConnected && deviceId) {
  //     await callSpotifyAPI("/me/player/previous", "POST");
  //   } else {
  //     // Fallback for demo mode
  //     const currentIndex = playlistTracks.findIndex(
  //       (track) => track.id === currentTrack?.id
  //     );
  //     const prevIndex =
  //       currentIndex === 0 ? playlistTracks.length - 1 : currentIndex - 1;
  //     setCurrentTrack(playlistTracks[prevIndex]);
  //     setProgress(0);
  //     setDuration(playlistTracks[prevIndex].duration);
  //   }
  // };

  // const toggleShuffle = async () => {
  //   if (isConnected && deviceId) {
  //     await callSpotifyAPI(`/me/player/shuffle?state=${!shuffle}`, "PUT");
  //     setShuffle(!shuffle);
  //   } else {
  //     setShuffle(!shuffle);
  //   }
  // };

  // const toggleRepeat = async () => {
  //   if (isConnected && deviceId) {
  //     const repeatMode = repeat ? "off" : "track";
  //     await callSpotifyAPI(`/me/player/repeat?state=${repeatMode}`, "PUT");
  //     setRepeat(!repeat);
  //   } else {
  //     setRepeat(!repeat);
  //   }
  // };

  // const seekTo = async (position: number) => {
  //   if (isConnected && deviceId) {
  //     await callSpotifyAPI(`/me/player/seek?position_ms=${position}`, "PUT");
  //   } else {
  //     setProgress(position);
  //   }
  // };

  // TODO: Spotify connection functions
  // const connectSpotify = () => {
  //   const scopes = [
  //     "user-read-private",
  //     "user-read-email",
  //     "user-read-playback-state",
  //     "user-modify-playback-state",
  //     "user-read-currently-playing",
  //     "playlist-read-private",
  //     "playlist-read-collaborative",
  //   ];

  //   const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(
  //     window.location.origin
  //   )}&scope=${encodeURIComponent(scopes.join(" "))}`;

  //   window.location.href = authUrl;
  // };

  // const disconnectSpotify = () => {
  //   setAccessToken(null);
  //   setDeviceId(null);
  //   setIsConnected(false);
  //   setIsPlaying(false);
  //   setCurrentTrack(null);
  //   setProgress(0);
  //   setDuration(0);

  //   // Clear stored tokens
  //   localStorage.removeItem("spotify_access_token");
  //   localStorage.removeItem("spotify_token_expires");

  //   // Reset to default tracks
  //   setPlaylistTracks(defaultTracks);
  //   setCurrentTrack(defaultTracks[0]);
  //   setDuration(defaultTracks[0].duration);
  // };

  // TODO: Handle auth callback
  // useEffect(() => {
  //   const hash = window.location.hash.substring(1);
  //   const params = new URLSearchParams(hash);
  //   const token = params.get("access_token");
  //   const expiresIn = params.get("expires_in");

  //   if (token) {
  //     setAccessToken(token);

  //     // Store token with expiration
  //     if (expiresIn) {
  //       const expiresAt = Date.now() + parseInt(expiresIn) * 1000;
  //       localStorage.setItem("spotify_token_expires", expiresAt.toString());
  //     }
  //     localStorage.setItem("spotify_access_token", token);

  //     window.history.replaceState({}, document.title, window.location.pathname);
  //   } else {
  //     // Check for existing token
  //     const existingToken = localStorage.getItem("spotify_access_token");
  //     const expiresAt = localStorage.getItem("spotify_token_expires");

  //     if (existingToken && expiresAt && Date.now() < parseInt(expiresAt)) {
  //       setAccessToken(existingToken);
  //     } else if (existingToken) {
  //       // Token expired, clear it
  //       localStorage.removeItem("spotify_access_token");
  //       localStorage.removeItem("spotify_token_expires");
  //     }
  //   }
  // }, []);

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
          MyCafeVibes Playlist
        </h2>
        {/* TODO: Add Spotify connection functionality */}
      </div>

      <p className="text-[var(--text-secondary)] mb-4">
        Enjoy the STUDY Cafe playlist - carefully curated cafe atmosphere music
        for the perfect working environment.
      </p>

      {/* Spotify embed player */}
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
          title="MyCafeVibes Playlist"
        />
      </div>
    </div>
  );
}

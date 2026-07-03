import React, { useEffect, useRef, useState } from "react";
import { Volume2 } from "lucide-react";

interface AudioPlayerProps {
  shouldPlay: boolean;
  onStateChange?: (playing: boolean) => void;
}

const MUSIC_URL =
  "https://github.com/Redoyguhoroy/music.mp3/blob/main/music.mp3.mp3";

// Convert GitHub browser view URLs to direct raw asset URLs
const getRawAudioUrl = (url: string): string => {
  if (!url) return "";
  if (url.includes("github.com") && url.includes("/blob/")) {
    return url
      .replace("github.com", "raw.githubusercontent.com")
      .replace("/blob/", "/");
  }
  return url;
};

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  shouldPlay,
  onStateChange,
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.8; // Fixed 80% volume
    }
  }, []);

  useEffect(() => {
    if (shouldPlay && audioRef.current) {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          onStateChange?.(true);
        })
        .catch((err) => console.log("Audio playback error:", err));
    }
  }, [shouldPlay]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      onStateChange?.(false);
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          onStateChange?.(true);
        })
        .catch((err) => console.log("Audio playback error:", err));
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={getRawAudioUrl(MUSIC_URL)}
        preload="auto"
        loop
      />

      <button
        onClick={togglePlay}
        className="absolute bottom-5 right-5 z-50 w-12 h-12 rounded-full bg-wedding-maroon/90 border border-wedding-gold/40 backdrop-blur-md shadow-xl flex items-center justify-center hover:scale-110 transition-all duration-300"
        title="Music"
      >
        <Volume2 className="w-6 h-6 text-wedding-gold" />
      </button>
    </>
  );
};
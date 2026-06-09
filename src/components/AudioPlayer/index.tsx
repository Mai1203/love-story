"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { Howl } from 'howler';
import { useState, useEffect, useRef } from 'react';
import Sunflower from '@/components/Shared/Sunflower';

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [audioError, setAudioError] = useState(false);
  const soundRef = useRef<Howl | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const audioUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

  useEffect(() => {
    soundRef.current = new Howl({
      src: [audioUrl],
      volume: volume,
      onload: () => {
        setDuration(soundRef.current?.duration() || 0);
        setAudioError(false);
      },
      onloaderror: () => {
        setAudioError(true);
      },
      onplay: () => {
        setIsPlaying(true);
      },
      onpause: () => {
        setIsPlaying(false);
      },
      onend: () => {
        setIsPlaying(false);
        setCurrentTime(0);
      },
    });

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      if (soundRef.current) {
        soundRef.current.stop();
        soundRef.current.unload();
      }
    };
  }, []);

  useEffect(() => {
    if (isPlaying && soundRef.current) {
      progressIntervalRef.current = setInterval(() => {
        setCurrentTime(soundRef.current?.seek() || 0);
      }, 100);
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    };
  }, [isPlaying]);

  const togglePlay = () => {
    if (!soundRef.current) return;

    if (isPlaying) {
      soundRef.current.pause();
    } else {
      if (audioError) {
        soundRef.current.load();
      }
      soundRef.current.play();
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (soundRef.current) {
      soundRef.current.volume(newVolume);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {showControls && (
        <motion.div
          className="absolute bottom-20 right-0 bg-bg-primary/90 backdrop-blur border border-white/10 rounded-2xl p-4 w-72"
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
        >
          <Sunflower
            size={24}
            className="absolute -top-2 -left-2"
            style={{ transform: 'rotate(-30deg)' }}
          />
          <Sunflower
            size={24}
            className="absolute -bottom-2 -right-2"
            style={{ transform: 'rotate(30deg)' }}
          />

          <div className="mb-3">
            <h3 className="text-white font-semibold text-sm">Our Song - Romantic Instrumental</h3>
            {audioError && (
              <p className="text-red-400 text-xs mt-1">Audio unavailable</p>
            )}
          </div>

          <div className="mb-3">
            <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-romantic rounded-full transition-all duration-100"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-white/60 text-xs mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-white/60 text-xs">🔊</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="flex-1 h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer slider"
            />
          </div>
        </motion.div>
      )}
      </AnimatePresence>

      <motion.button
        className="w-14 h-14 rounded-full bg-romantic/90 backdrop-blur shadow-lg shadow-romantic/50 flex items-center justify-center relative"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
        transition={isPlaying ? { duration: 10, repeat: Infinity, ease: "linear" } : { duration: 0 }}
        onClick={() => {
          setShowControls(!showControls);
          togglePlay();
        }}
      >
        {isPlaying ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-white">
            <rect x="6" y="4" width="4" height="16" />
            <rect x="14" y="4" width="4" height="16" />
          </svg>
        ) : (
          <span className="text-2xl">🎵</span>
        )}
      </motion.button>
    </div>
  );
}
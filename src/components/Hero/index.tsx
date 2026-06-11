"use client";

import { motion } from 'framer-motion';
import { fadeIn, slideUp } from '@/animations';
import Sunflower from '@/components/Shared/Sunflower';
import { useState, useEffect, useRef } from 'react';

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "demo";
// Cloudinary URL con transformaciones automáticas: formato y calidad optimizados
const VIDEO_URL = `https://res.cloudinary.com/${cloudName}/video/upload/f_auto,q_auto/video_hero_x8o2ze`;
// Thumbnail generado por Cloudinary como poster (primer frame, formato webp)
const POSTER_URL = `https://res.cloudinary.com/${cloudName}/video/upload/f_webp,q_auto,w_1280,so_0/video_hero_x8o2ze.jpg`;

export default function Hero() {
  const [displayedText, setDisplayedText] = useState('');
  const [showSecondLine, setShowSecondLine] = useState(false);
  const firstLine = "Hay personas que cambian tu vida...";
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  // Detectar si estamos en desktop para renderizar múltiples videos
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setIsDesktop(window.matchMedia('(min-width: 768px)').matches);
    const mq = window.matchMedia('(min-width: 768px)');
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (video) {
        const setOffset = () => {
          video.currentTime = i * 5;
        };
        video.addEventListener('loadedmetadata', setOffset, { once: true });
      }
    });
  }, [isDesktop]);

  const videoCount = isDesktop ? 3 : 1;

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setDisplayedText((prev) => {
        if (prev.length < firstLine.length) {
          return firstLine.slice(0, prev.length + 1);
        }
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        return prev;
      });
    }, 100);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (displayedText.length === firstLine.length) {
      const timer = setTimeout(() => setShowSecondLine(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [displayedText, firstLine.length]);

  useEffect(() => {
    if (showSecondLine) {
      const timer = setTimeout(() => {
        window.dispatchEvent(new Event('heroAnimationComplete'));
      }, 900);
      return () => clearTimeout(timer);
    }
  }, [showSecondLine]);

  const sunflowers = Array.from({ length: 6 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 80 + 10}%`,
    size: Math.floor(Math.random() * 31) + 30,
    bottom: `${Math.random() * 20 - 10}px`,
  }));

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 md:flex">
        {Array.from({ length: videoCount }).map((_, i) => (
          <video
            key={i}
            ref={(el: HTMLVideoElement | null) => { videoRefs.current[i] = el; }}
            src={VIDEO_URL}
            poster={POSTER_URL}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className={`h-full w-auto object-cover ${i % 2 === 1 ? 'scale-x-[-1]' : ''}`}
          />
        ))}
      </div>
      <div className="absolute inset-0 bg-black/30 md:hidden" />
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-rose-600/5"
        initial={{ scale: 1 }}
        animate={{ scale: 1.05 }}
        transition={{ duration: 20, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
      />
      <div className="absolute inset-0 bg-black/20" />
      
      <motion.div 
        className="relative z-10 text-center px-4"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 min-h-[4rem] md:min-h-[5rem] flex items-center justify-center">
          {displayedText}
          {displayedText.length < firstLine.length && <span className="animate-pulse">|</span>}
        </h1>
        
        {showSecondLine && (
          <motion.h2 
            className="text-3xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-pink-500 to-rose-600 bg-clip-text text-transparent mb-8"
            variants={slideUp}
            initial="hidden"
            animate="visible"
          >
            Y tú cambiaste la mía ❤️
          </motion.h2>
        )}
        
        <motion.button
          className="px-8 py-3 rounded-full text-white font-semibold text-lg bg-[#FF4D6D] hover:opacity-90 transition-opacity"
          whileHover={{ scale: 1.05 }}
          onClick={() => document.getElementById('timeline')?.scrollIntoView({ behavior: 'smooth' })}
        >
          Comenzar nuestro viaje
        </motion.button>
      </motion.div>

      <div id="timeline" className="h-0 absolute" />

      {sunflowers.map((sunflower) => (
        <Sunflower
          key={sunflower.id}
          size={sunflower.size}
          style={{
            left: sunflower.left,
            bottom: sunflower.bottom,
          }}
          className="animate-float"
        />
      ))}

      {Array.from({ length: 15 }).map((_, i) => (
        <div
          key={`particle-${i}`}
          className="absolute w-2 h-2 bg-gradient-to-br from-yellow-300 to-amber-400 rounded-full animate-float shadow-lg shadow-yellow-400/50"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${Math.random() * 10 + 10}s`,
          }}
        />
      ))}
    </section>
  );
}
"use client";

import { motion } from 'framer-motion';
import { slideUp, scaleIn } from '@/animations';
import { useState, useEffect, useRef, useCallback } from 'react';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
}

interface Message {
  id: number;
  text: string;
  x: number;
  y: number;
}

const romanticPhrases = [
  "Lo que más admiro de ti",
  "Mi recuerdo favorito",
  "Lo que sueño para nosotros",
  "Por qué te amo",
  "Eres mi persona favorita",
  "Cada día a tu lado es un regalo",
  "Tu sonrisa es mi sol",
  "Eres mi todo"
];

export default function Stars() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stars, setStars] = useState<Star[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const animationRef = useRef<number>();
  const lastTwinkleRef = useRef<number>(0);

  useEffect(() => {
    const generateStars = () => {
      const newStars: Star[] = [];
      for (let i = 0; i < 3000; i++) {
        newStars.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 2 + 1,
          opacity: Math.random() * 0.7 + 0.3
        });
      }
      setStars(newStars);
    };
    generateStars();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const animate = (timestamp: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (timestamp - lastTwinkleRef.current > 100) {
        setStars(prevStars => 
          prevStars.map(star => ({
            ...star,
            opacity: Math.random() > 0.7 
              ? Math.random() * 0.7 + 0.3 
              : star.opacity
          }))
        );
        lastTwinkleRef.current = timestamp;
      }

      stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(
          (star.x / 100) * canvas.width,
          (star.y / 100) * canvas.height,
          star.size,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [stars]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const randomPhrase = romanticPhrases[Math.floor(Math.random() * romanticPhrases.length)];
    const newMessage: Message = {
      id: Date.now(),
      text: randomPhrase,
      x,
      y
    };

    setMessages(prev => [...prev, newMessage]);

    setTimeout(() => {
      setMessages(prev => prev.filter(msg => msg.id !== newMessage.id));
    }, 3000);
  }, []);

  return (
    <div className="min-h-screen relative bg-[#0a0a0f] overflow-hidden">
      <motion.h1
        className="absolute top-8 left-1/2 transform -translate-x-1/2 text-white text-3xl md:text-4xl font-bold z-20"
        initial="hidden"
        animate="visible"
        variants={slideUp}
      >
        Nuestro Cielo Estrellado
      </motion.h1>

      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        onClick={handleClick}
      />

      <div className="absolute inset-0 bg-gradient-radial from-transparent to-bg-primary/30" />

      {messages.map(message => (
        <motion.div
          key={message.id}
          className="absolute z-30 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 text-sm md:text-base text-gray-800 shadow-lg pointer-events-none"
          style={{
            left: `${message.x}%`,
            top: `${message.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
          variants={scaleIn}
          initial="hidden"
          animate="visible"
        >
          {message.text}
        </motion.div>
      ))}
    </div>
  );
}
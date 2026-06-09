"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { slideUp } from "@/animations";

interface CountdownData {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isBirthday: boolean;
}

function useCountdown(targetDate: Date): CountdownData {
  const targetRef = useRef(targetDate);
  targetRef.current = targetDate;

  const calculateTimeLeft = (): CountdownData => {
    const now = new Date().getTime();
    const target = targetRef.current.getTime();
    const difference = target - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isBirthday: true };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      isBirthday: false,
    };
  };

  const [countdown, setCountdown] = useState<CountdownData>(calculateTimeLeft);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return countdown;
}

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  speed: number;
  rotation: number;
}

function Confetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const confettiRef = useRef<ConfettiPiece[]>([]);

  useEffect(() => {
    const colors = ["#FF4D6D", "#FF6B9D", "#FFB6C1", "#FF8FA3", "#FDA7DC"];
    confettiRef.current = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -10,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 4,
      speed: Math.random() * 3 + 2,
      rotation: Math.random() * 360,
    }));

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      confettiRef.current.forEach((piece) => {
        ctx.save();
        ctx.fillStyle = piece.color;
        ctx.translate(piece.x * canvas.width / 100, piece.y * canvas.height / 100);
        ctx.rotate((piece.rotation * Math.PI) / 180);
        ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size * 2);
        ctx.restore();

        piece.y += piece.speed * 0.1;
        piece.rotation += 2;

        if (piece.y > 110) {
          piece.y = -10;
          piece.x = Math.random() * 100;
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      width={800}
      height={600}
    />
  );
}

interface FloatingHeart {
  id: number;
  left: number;
  delay: number;
  size: number;
}

function FloatingHearts() {
  const [hearts, setHearts] = useState<FloatingHeart[]>([]);

  useEffect(() => {
    setHearts(
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 5,
        size: Math.random() * 20 + 16,
      }))
    );
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {hearts.map((heart) => (
        <span
          key={heart.id}
          className="absolute bottom-0 animate-float"
          style={{
            left: `${heart.left}%`,
            fontSize: `${heart.size}px`,
            animationDelay: `${heart.delay}s`,
            animationDuration: "6s",
          }}
        >
          ❤️
        </span>
      ))}
    </div>
  );
}

export default function Countdown() {
  const getNextBirthday = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const birthday = new Date(currentYear, 5, 12); // Junio 12 (mes 5 = junio, 0-indexed)
    if (birthday < now) {
      return new Date(currentYear + 1, 5, 12);
    }
    return birthday;
  };
  
  const targetDate = getNextBirthday();
  const { days, hours, minutes, seconds, isBirthday } = useCountdown(targetDate);

  const timeCards = [
    { value: days, label: "Días" },
    { value: hours, label: "Horas" },
    { value: minutes, label: "Minutos" },
    { value: seconds, label: "Segundos" },
  ];

  return (
    <section className="min-h-screen flex flex-col items-center justify-center py-20 px-4 relative overflow-hidden bg-gradient-to-b from-bg-primary via-romantic/5 to-bg-primary">
      {isBirthday && (
        <>
          <Confetti />
          <FloatingHearts />
        </>
      )}

      <motion.h2
        className="text-3xl md:text-4xl font-bold text-text-primary mb-12"
        variants={slideUp}
        initial="hidden"
        animate="visible"
      >
        Cuenta Regresiva para tu Cumpleaños
      </motion.h2>

      {isBirthday ? (
        <motion.div
          className="text-center relative"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
        >
          <div className="absolute -inset-8 bg-white/10 rounded-full blur-xl" />
          <p className="text-4xl md:text-6xl font-bold text-romantic mb-8 relative z-10">
            ¡Feliz Cumpleaños!
          </p>
          <motion.span
            className="text-8xl md:text-9xl inline-block drop-shadow-2xl"
            animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            ❤️
          </motion.span>
        </motion.div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl">
          {timeCards.map((card, idx) => (
            <motion.div
              key={card.label}
              className="bg-white/5 backdrop-blur-md rounded-2xl p-6 flex flex-col items-center border border-pink-400/20 shadow-xl shadow-pink-500/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <span className="text-4xl md:text-6xl font-bold bg-gradient-to-b from-pink-300 to-rose-400 bg-clip-text text-transparent drop-shadow-lg">
                {card.value.toString().padStart(2, "0")}
              </span>
              <span className="text-pink-200/80 text-sm uppercase tracking-wider mt-2 font-medium">
                {card.label}
              </span>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
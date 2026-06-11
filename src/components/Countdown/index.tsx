"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

// ─── Partículas flotantes de fondo ──────────────────────────────────────────

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
  symbol: string;
}

function StarField() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const symbols = ["✦", "✧", "⋆", "·", "★", "✶", "✸", "✹"];
    setParticles(
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 14 + 6,
        opacity: Math.random() * 0.5 + 0.1,
        duration: Math.random() * 6 + 4,
        delay: Math.random() * 5,
        symbol: symbols[Math.floor(Math.random() * symbols.length)],
      }))
    );
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute select-none text-pink-300"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            fontSize: `${p.size}px`,
            opacity: p.opacity,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [p.opacity, p.opacity * 2.5, p.opacity],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {p.symbol}
        </motion.span>
      ))}
    </div>
  );
}

// ─── Confetti de cumpleaños ──────────────────────────────────────────────────

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
    confettiRef.current = Array.from({ length: 70 }, (_, i) => ({
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
        ctx.translate(
          (piece.x * canvas.width) / 100,
          (piece.y * canvas.height) / 100
        );
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

// ─── Corazones flotantes de cumpleaños ──────────────────────────────────────

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

// ─── Anillo de progreso circular ─────────────────────────────────────────────

interface CircularRingProps {
  progress: number; // 0 a 1
  color?: string;
  size?: number;
  strokeWidth?: number;
}

function CircularRing({
  progress,
  color = "#f472b6",
  size = 120,
  strokeWidth = 4,
}: CircularRingProps) {
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);

  return (
    <svg
      width={size}
      height={size}
      className="absolute inset-0 pointer-events-none"
      style={{ transform: "rotate(-90deg)" }}
    >
      {/* Pista de fondo */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth={strokeWidth}
      />
      {/* Arco de progreso */}
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        style={{ filter: `drop-shadow(0 0 6px ${color}88)` }}
      />
    </svg>
  );
}

// ─── Mensajes especiales ─────────────────────────────────────────────────────

const ROMANTIC_MESSAGES = [
  "Cada segundo que pasa, pienso en ti 💕",
  "Un minuto más cerca de verte 🌸",
  "Las horas vuelan cuando pienso en ti ✨",
  "¡Ya falta menos para tu día especial! 🎂",
  "Eres la razón de mis sonrisas 😊",
  "Contando cada momento hasta estar contigo 🌙",
  "El tiempo pasa pero mi amor por ti crece 💖",
  "Cada latido te dedico a ti ❤️",
  "¡Tu día especial se acerca! 🌟",
  "Eres lo más bonito que me ha pasado 🌺",
];

function SpecialMessage({ tick }: { tick: number }) {
  const messageIndex = tick % ROMANTIC_MESSAGES.length;
  const message = ROMANTIC_MESSAGES[messageIndex];

  return (
    <div className="h-10 flex items-center justify-center mt-8">
      <AnimatePresence mode="wait">
        <motion.p
          key={tick}
          className="text-pink-300/80 text-sm md:text-base text-center font-light italic"
          initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {message}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function Countdown() {
  const [messageTick, setMessageTick] = useState(0);
  const prevSecondsRef = useRef<number | null>(null);

  const getNextBirthday = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const birthday = new Date(currentYear, 5, 12); // 12 de junio

    // Si HOY es el cumpleaños, mostrar la celebración todo el día
    const isToday =
      now.getFullYear() === birthday.getFullYear() &&
      now.getMonth() === birthday.getMonth() &&
      now.getDate() === birthday.getDate();
    if (isToday) {
      return new Date(now.getTime() - 1000); // ya pasó → isBirthday: true
    }

    // Si ya pasó el cumpleaños este año, contar para el siguiente
    if (birthday < now) {
      return new Date(currentYear + 1, 5, 12);
    }

    return birthday;
  };

  const targetDate = getNextBirthday();
  const { days, hours, minutes, seconds, isBirthday } = useCountdown(targetDate);

  // Cambiar mensaje cada 10 segundos
  useEffect(() => {
    if (isBirthday) return;
    if (prevSecondsRef.current === null) {
      prevSecondsRef.current = seconds;
      return;
    }
    if (seconds % 10 === 0 && seconds !== prevSecondsRef.current) {
      setMessageTick((t) => t + 1);
    }
    prevSecondsRef.current = seconds;
  }, [seconds, isBirthday]);

  // Progreso de cada unidad (cuánto falta como fracción del máximo)
  const totalDays = 365;
  const ringConfigs = [
    {
      value: days,
      label: "Días",
      progress: 1 - days / totalDays,
      color: "#f472b6",
      max: totalDays,
    },
    {
      value: hours,
      label: "Horas",
      progress: 1 - hours / 24,
      color: "#c084fc",
      max: 24,
    },
    {
      value: minutes,
      label: "Minutos",
      progress: 1 - minutes / 60,
      color: "#fb7185",
      max: 60,
    },
    {
      value: seconds,
      label: "Segundos",
      progress: 1 - seconds / 60,
      color: "#f9a8d4",
      max: 60,
    },
  ];

  return (
    <section className="min-h-screen flex flex-col items-center justify-center py-20 px-4 relative overflow-hidden bg-gradient-to-b from-bg-primary via-romantic/5 to-bg-primary">
      {/* Fondo de partículas — siempre visible */}
      <StarField />

      {/* Extras de cumpleaños */}
      {isBirthday && (
        <>
          <Confetti />
          <FloatingHearts />
        </>
      )}

      <motion.h2
        className="text-3xl md:text-4xl font-bold text-text-primary mb-2 text-center relative z-10"
        variants={slideUp}
        initial="hidden"
        animate="visible"
      >
        Cuenta Regresiva para tu Cumpleaños
      </motion.h2>
      <motion.p
        className="text-pink-300/60 text-sm mb-12 relative z-10"
        variants={slideUp}
        initial="hidden"
        animate="visible"
      >
        12 de junio 🎂
      </motion.p>

      {isBirthday ? (
        <motion.div
          className="text-center relative z-10"
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
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl relative z-10">
            {ringConfigs.map((card, idx) => (
              <motion.div
                key={card.label}
                className="relative flex flex-col items-center justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                {/* Contenedor cuadrado con anillo */}
                <div className="relative w-28 h-28 md:w-36 md:h-36 flex items-center justify-center">
                  {/* Anillo de progreso SVG */}
                  <div className="absolute inset-0">
                    <CircularRing
                      progress={card.progress}
                      color={card.color}
                      size={144}
                      strokeWidth={5}
                    />
                  </div>

                  {/* Fondo de cristal dentro del anillo */}
                  <div
                    className="w-24 h-24 md:w-28 md:h-28 rounded-full flex flex-col items-center justify-center"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      backdropFilter: "blur(12px)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <motion.span
                      key={card.value}
                      className="text-3xl md:text-5xl font-bold bg-gradient-to-b from-pink-200 to-rose-400 bg-clip-text text-transparent leading-none"
                      initial={{ opacity: 0.4, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                      {card.value.toString().padStart(2, "0")}
                    </motion.span>
                  </div>
                </div>

                {/* Etiqueta debajo */}
                <span
                  className="text-pink-200/70 text-xs uppercase tracking-widest mt-3 font-medium"
                  style={{ color: card.color + "cc" }}
                >
                  {card.label}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Mensaje romántico rotativo */}
          <div className="relative z-10 w-full max-w-lg">
            <SpecialMessage tick={messageTick} />
          </div>
        </>
      )}
    </section>
  );
}
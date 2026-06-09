"use client";

import { motion, AnimatePresence } from "framer-motion";
import { fadeIn, slideUp, scaleIn } from "@/animations";
import Layout from "@/components/Shared/Layout";
import Sunflower from "@/components/Shared/Sunflower";
import { useState } from "react";

interface Location {
  id: number;
  name: string;
  x: number;
  y: number;
  emoji: string;
  story: string;
}

const mapLocations: Location[] = [
  {
    id: 1,
    name: "Donde nos conocimos",
    x: 25,
    y: 40,
    emoji: "👀",
    story:
      "El destino nos unió en el lugar menos esperado. Una mirada bastó para cambiar todo.",
  },
  {
    id: 2,
    name: "Primera cita",
    x: 60,
    y: 30,
    emoji: "☕",
    story:
      "Nervios, café y las mejores conversaciones de mi vida.",
  },
  {
    id: 3,
    name: "Primer viaje",
    x: 45,
    y: 65,
    emoji: "✈️",
    story:
      "Juntos descubrimos que el destino importa menos que la compañía.",
  },
  {
    id: 4,
    name: "El Glamping",
    x: 75,
    y: 55,
    emoji: "🏕️",
    story:
      "Bajo el cielo estrellado, encontré el lugar más mágico del mundo: a tu lado.",
  },
];

export default function Map() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  return (
    <Layout id="map" withSunflowers={true}>
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.h2
          className="text-3xl md:text-5xl font-bold text-center text-text-primary mb-16"
          variants={slideUp}
          initial="hidden"
          animate="visible"
        >
          Lugares que Marquen Nuestra Historia
        </motion.h2>

        <motion.div
          className="relative min-h-[500px] md:min-h-[600px] bg-bg-primary/50 backdrop-blur border border-white/10 rounded-3xl overflow-hidden"
          variants={fadeIn}
          initial="hidden"
          animate="visible"
        >
          {/* Grid pattern */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          {/* Decorative roads */}
          <div className="absolute top-1/4 left-0 right-0 h-[2px] bg-white/5 rotate-12 origin-left" />
          <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-white/5 -rotate-6 origin-left" />
          <div className="absolute top-3/4 left-0 right-0 h-[2px] bg-white/5 rotate-3 origin-left" />
          <div className="absolute top-0 bottom-0 left-1/3 w-[2px] bg-white/5 rotate-12 origin-top" />
          <div className="absolute top-0 bottom-0 left-2/3 w-[2px] bg-white/5 -rotate-6 origin-top" />

          {/* Curved road SVG */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <path
              d="M 10 80 Q 30 60, 50 50 T 90 20"
              fill="none"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="0.5"
            />
            <path
              d="M 5 30 Q 25 40, 40 60 T 85 85"
              fill="none"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="0.5"
            />
          </svg>

          {/* Compass decoration */}
          <div className="absolute top-6 right-6 w-16 h-16 md:w-20 md:h-20 opacity-20">
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="40" stroke="#FF4D6D" strokeWidth="1" strokeDasharray="4 4" />
              <path d="M50 10 L55 45 L50 40 L45 45 Z" fill="#FF4D6D" />
              <path d="M50 90 L55 55 L50 60 L45 55 Z" fill="#FF4D6D" opacity="0.4" />
              <path d="M10 50 L45 45 L40 50 L45 55 Z" fill="#FF4D6D" opacity="0.4" />
              <path d="M90 50 L55 45 L60 50 L55 55 Z" fill="#FF4D6D" opacity="0.4" />
              <circle cx="50" cy="50" r="3" fill="#FF4D6D" />
              <text x="50" y="8" textAnchor="middle" fill="#FF4D6D" fontSize="6" fontWeight="bold">
                N
              </text>
            </svg>
          </div>

          {/* Location markers */}
          {mapLocations.map((location, index) => (
            <motion.div
              key={location.id}
              className="absolute"
              style={{ left: `${location.x}%`, top: `${location.y}%` }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.15 }}
            >
              <button
                onClick={() => setSelectedLocation(location)}
                className="group relative -translate-x-1/2 -translate-y-1/2"
                aria-label={location.name}
              >
                <div className="relative">
                  {/* Pulse rings */}
                  <motion.div
                    className="absolute inset-0 rounded-full bg-romantic/40"
                    animate={{
                      scale: [1, 1.6, 1],
                      opacity: [0.6, 0, 0.6],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  <motion.div
                    className="absolute inset-0 rounded-full bg-romantic/30"
                    animate={{
                      scale: [1, 1.4, 1],
                      opacity: [0.4, 0, 0.4],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.8,
                    }}
                  />

                  {/* Marker */}
                  <div className="relative w-12 h-12 rounded-full bg-romantic/80 flex items-center justify-center text-2xl shadow-lg shadow-romantic/50 group-hover:scale-110 transition-transform cursor-pointer">
                    {location.emoji}
                  </div>
                </div>

                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-1.5 bg-bg-primary border border-white/10 rounded-lg text-text-primary text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
                  {location.name}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-bg-primary" />
                </div>
              </button>
            </motion.div>
          ))}

          {/* Sunflower corners */}
          <Sunflower
            size={32}
            className="top-4 left-4 animate-sunflowerSwing"
          />
          <Sunflower
            size={28}
            className="bottom-4 right-4 animate-sunflowerSwing"
          />
        </motion.div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedLocation && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedLocation(null)}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              className="relative bg-bg-primary border border-romantic/30 rounded-2xl p-6 max-w-md w-full mx-auto shadow-2xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedLocation(null)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors text-text-primary text-lg"
                aria-label="Cerrar"
              >
                ✕
              </button>

              <div className="text-center">
                <div className="text-6xl mb-4">{selectedLocation.emoji}</div>
                <h3 className="text-2xl font-bold text-text-primary mb-3">
                  {selectedLocation.name}
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  {selectedLocation.story}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fadeIn, scaleIn, slideUp } from "@/animations";
import Layout from "@/components/Shared/Layout";
import Sunflower from "@/components/Shared/Sunflower";

const LETTER_TEXT = `Mi amor,

Hoy es un día especial, no porque el calendario lo diga, sino porque tú existes.

Cada momento a tu lado es un tesoro que guardo en mi corazón. Desde aquella primera mirada bajo las estrellas, cada segundo contigo ha valido la pena.

Gracias por ser mi compañera de aventuras, mi paz en los días difíciles y mi alegría en los momentos simples.

En este cumpleaños, no solo celebro tu vida, celebro el hecho de que el universo nos permitió encontrarnos.

Te amo más que ayer, pero menos que mañana.

Con todo mi amor,
Maicol`;

export default function Letter() {
  const [state, setState] = useState<"closed" | "open">("closed");
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    if (state === "open") {
      let index = 0;
      const interval = setInterval(() => {
        index++;
        setDisplayedText(LETTER_TEXT.slice(0, index));
        if (index >= LETTER_TEXT.length) {
          clearInterval(interval);
        }
      }, 30);
      return () => clearInterval(interval);
    }
  }, [state]);

  const handleOpen = () => {
    setState("open");
  };

  return (
    <Layout id="letter" withSunflowers={true}>
      <motion.h2
        className="text-4xl md:text-5xl font-bold text-center text-romantic mb-12"
        variants={slideUp}
        initial="hidden"
        animate="visible"
      >
        Una Carta para Ti
      </motion.h2>

      <div className="relative min-h-[500px] flex items-center justify-center">
        {state === "closed" && (
          <motion.div
            className="flex flex-col items-center cursor-pointer"
            onClick={handleOpen}
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-64 h-40 md:w-80 md:h-48 border-2 border-romantic/50 bg-bg-primary/80 backdrop-blur rounded-xl flex items-center justify-center relative">
              <motion.span
                className="text-romantic text-4xl"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                ♥
              </motion.span>
            </div>
            <motion.p
              className="mt-6 text-text-secondary text-lg"
              variants={fadeIn}
              initial="hidden"
              animate="visible"
            >
              Toca para abrir tu carta
            </motion.p>
          </motion.div>
        )}

        {state === "open" && (
          <>
            <motion.div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              initial={{ opacity: 1, scale: 1 }}
              animate={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-64 h-40 md:w-80 md:h-48 border-2 border-romantic/50 bg-bg-primary/80 backdrop-blur rounded-xl flex items-center justify-center">
                <motion.span
                  className="text-romantic text-4xl"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  ♥
                </motion.span>
              </div>
            </motion.div>

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="absolute -inset-20 bg-romantic/20 blur-3xl rounded-full" />
            </div>

            <motion.div
              className="relative bg-gradient-to-b from-white to-gray-50 text-gray-800 p-8 md:p-12 rounded-lg shadow-2xl max-w-2xl mx-auto transform rotate-1"
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="absolute top-4 left-6 w-8 h-8">
                <Sunflower size={32} className="opacity-30" />
              </div>
              <div className="absolute top-4 right-6 w-8 h-8">
                <Sunflower size={32} className="opacity-30" />
              </div>
              <div className="absolute bottom-4 left-6 w-8 h-8">
                <Sunflower size={32} className="opacity-30" />
              </div>
              <div className="absolute bottom-4 right-6 w-8 h-8">
                <Sunflower size={32} className="opacity-30" />
              </div>

              <div className="relative z-10">
                <p className="text-lg md:text-xl leading-relaxed whitespace-pre-line font-light">
                  {displayedText}
                  {displayedText.length < LETTER_TEXT.length && (
                    <motion.span
                      className="inline-block w-0.5 h-5 bg-romantic ml-1"
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                    />
                  )}
                </p>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </Layout>
  );
}
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeIn, scaleIn } from "@/animations";
import Layout from "@/components/Shared/Layout";

const SECRET_MESSAGE =
  "Nuestro amor es el mejor regalo que la vida me pudo dar. Gracias por ser mi persona favorita en este mundo y en todos los que vengan.";
const REVEAL_CLICKS = 5;

export default function Secrets() {
  const [clickCount, setClickCount] = useState(0);
  const [foundSecret, setFoundSecret] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [displayedMessage, setDisplayedMessage] = useState("");

  useEffect(() => {
    if (foundSecret) {
      let index = 0;
      const interval = setInterval(() => {
        index++;
        setDisplayedMessage(SECRET_MESSAGE.slice(0, index));
        if (index >= SECRET_MESSAGE.length) {
          clearInterval(interval);
        }
      }, 35);
      return () => clearInterval(interval);
    }
  }, [foundSecret]);

  const handleHeartClick = () => {
    if (foundSecret) return;
    const next = clickCount + 1;
    setClickCount(next);
    if (next === REVEAL_CLICKS) {
      setFoundSecret(true);
      setShowReward(true);
    }
  };

  const handleDistractorClick = () => {
    if (!foundSecret) {
      setClickCount((prev) => prev + 1);
    }
  };

  const confettiEmojis = ["✨", "🌸", "🌻", "💖", "🌟"];

  return (
    <Layout id="secrets" withSunflowers={true}>
      <motion.div
        className="relative min-h-screen flex items-center justify-center"
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 bg-clip-text text-transparent"
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            Un lugar especial
          </motion.h2>
          <p className="text-text-secondary text-lg mb-8">
            Explora cada rincón... algo te está esperando.
          </p>

          <div className="py-20">
            <p className="text-sm text-text-secondary/70 tracking-widest uppercase">
              {foundSecret
                ? "¡Lo encontraste! 🎉"
                : "¿Serás capaz de encontrarlo? 🔍"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleHeartClick}
          className="absolute bottom-[10%] right-[10%] text-xl opacity-40 hover:opacity-100 transition cursor-pointer select-none z-20"
          aria-label="Corazón secreto"
        >
          ❤️
        </button>

        <button
          type="button"
          onClick={handleDistractorClick}
          className="absolute top-[15%] left-[8%] text-lg opacity-30 hover:opacity-100 transition cursor-pointer select-none z-20"
          aria-label="Girasol sorpresa"
        >
          🌻
        </button>

        <button
          type="button"
          onClick={handleDistractorClick}
          className="absolute top-[25%] right-[12%] text-base opacity-25 hover:opacity-100 transition cursor-pointer select-none z-20"
          aria-label="Brillo misterioso"
        >
          ✨
        </button>

        <button
          type="button"
          onClick={handleDistractorClick}
          className="absolute bottom-[28%] left-[18%] text-lg opacity-30 hover:opacity-100 transition cursor-pointer select-none z-20"
          aria-label="Flor escondida"
        >
          🌸
        </button>
      </motion.div>

      <AnimatePresence>
        {showReward && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-bg-primary border border-white/10 rounded-2xl p-8 md:p-12 max-w-xl mx-4 text-center shadow-2xl relative overflow-hidden"
              variants={scaleIn}
              initial="hidden"
              animate="visible"
            >
              {confettiEmojis.map((emoji, index) => (
                <motion.span
                  key={emoji}
                  className="absolute text-3xl pointer-events-none"
                  style={{ left: `${10 + index * 20}%`, bottom: "-10%" }}
                  animate={{
                    y: [0, -220, -360],
                    x: [0, index % 2 === 0 ? 30 : -30, 0],
                    opacity: [0, 1, 0],
                    rotate: [0, index % 2 === 0 ? 25 : -25, 0],
                  }}
                  transition={{
                    duration: 2.2 + index * 0.4,
                    repeat: Infinity,
                    delay: index * 0.3,
                    ease: "easeOut",
                  }}
                >
                  {emoji}
                </motion.span>
              ))}

              <div className="relative z-10">
                <motion.h3
                  className="text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Encontraste mi mensaje secreto ❤️
                </motion.h3>

                <motion.div
                  className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl w-48 h-48 mx-auto flex items-center justify-center text-6xl mb-8 shadow-lg"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                >
                  📸
                </motion.div>

                <p className="text-text-secondary text-lg leading-relaxed font-light">
                  {displayedMessage}
                  {displayedMessage.length < SECRET_MESSAGE.length && (
                    <motion.span
                      className="inline-block w-0.5 h-5 bg-romantic ml-1"
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                    />
                  )}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}

"use client";

import { motion } from "framer-motion";
import { fadeIn, scaleIn } from "@/animations";
import Sunflower from "@/components/Shared/Sunflower";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const firstParagraphText = "De todos los lugares donde pude estar...";

const typewriterVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delay: 1.5,
    },
  },
};

const charVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

const floatingHeartVariants = {
  hidden: { opacity: 0, y: -100 },
  animate: {
    opacity: [0, 0.6, 0],
    y: [-100, -300],
    transition: {
      duration: 4,
      repeat: Infinity,
      delay: 1.5,
    },
  },
};

export default function FinalSection() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center py-20 px-4 relative overflow-hidden bg-gradient-to-b from-bg-primary via-romantic/5 to-bg-primary">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-96 h-96 bg-romantic/10 blur-3xl rounded-full" />
      </div>

      <motion.div
        className="absolute top-1/2 left-1/2 pointer-events-none"
        variants={floatingHeartVariants}
        animate="animate"
        style={{ x: "-50%", y: "-50%" }}
      >
        <span className="text-8xl opacity-0">❤️</span>
      </motion.div>

      <motion.div
        className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="text-6xl md:text-8xl mb-4"
          variants={fadeIn}
        >
          🌻❤️
        </motion.div>

        <motion.p
          className="text-xl md:text-3xl lg:text-4xl font-light text-text-primary leading-relaxed"
          variants={fadeIn}
        >
          {firstParagraphText.split("").map((char, index) => (
            <motion.span
              key={index}
              variants={typewriterVariants}
              className="inline-block"
            >
              <motion.span variants={charVariants} className="inline-block">
                {char === " " ? "\u00A0" : char}
              </motion.span>
            </motion.span>
          ))}
        </motion.p>

        <motion.div
          className="h-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 5, duration: 0.1 }}
        />

        <motion.p
          className="text-2xl md:text-4xl lg:text-5xl font-semibold leading-tight bg-gradient-to-r from-pink-500 to-rose-600 bg-clip-text text-transparent"
          variants={scaleIn}
        >
          Mi favorito siempre será a tu lado ❤️
        </motion.p>

        <motion.p
          className="text-3xl md:text-5xl lg:text-6xl font-bold text-text-primary mt-4"
          variants={fadeIn}
        >
          Feliz cumpleaños amor
        </motion.p>

        <motion.p
          className="text-xl md:text-2xl italic text-text-secondary mt-8"
          variants={fadeIn}
        >
          Con amor, Maicol
        </motion.p>
      </motion.div>

      <Sunflower size={50} className="bottom-10 left-10" />
      <Sunflower size={40} className="bottom-20 right-16" />
      <Sunflower size={45} className="bottom-16 left-1/2" />
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import { fadeIn, slideUp } from "@/animations";
import Layout from "@/components/Shared/Layout";
import Sunflower from "@/components/Shared/Sunflower";
import { useRef } from "react";

interface TimelineEvent {
  id: number;
  date: string;
  title: string;
  description: string;
  emoji: string;
}

const timelineEvents: TimelineEvent[] = [
  {
    id: 1,
    date: "El principio",
    title: "Primera mirada",
    description: "Cuando nos conocimos, eramos completamente ignorantes de lo que nos esperaba. solo eramos dos jovenes que se conocian por casualidad y que nunca imaginamos que nos uniríamos en algo tan especial.",
    emoji: "👀",
  },
  {
    id: 2,
    date: "Primeras señales",
    title: "Primera conversación",
    description: "Aunque nuestras conversaciones eran cortas, y sin intención, solo basto una oportunidad para conocer a alguien que no imaginabamos que nos uniríamos en algo tan especial.",
    emoji: "💬",
  },
  {
    id: 3,
    date: "El gran día",
    title: "Primera cita",
    description: "El día más importante de nuestra vida, el día que nos unimos para siempre. El día que nos dimos cuenta que no podiamos estar separados. de que teniamos más en común que nos imaginabamos. Recuerdo muy bien ese día, bajo la lluvia, conociendonos cada vez más y más.",
    emoji: "☕",
  },
  {
    id: 4,
    date: "Nuestro refugio",
    title: "El Kiosko",
    description: "Ese lugar donde compartimos risas, donde el tiempo se pasa volando, donde pintamos la guitarra, donde vemos novelas, donde hacemos de todo",
    emoji: "🏕️",
  },
  {
    id: 5,
    date: "Hoy y siempre",
    title: "Este momento",
    description: "Cada día contigo es el mejor regalo. No importa dónde estemos, si estás tú, estoy en casa.",
    emoji: "❤️",
  },
];

export default function Timeline() {
  const containerRef = useRef<HTMLElement>(null);

  return (
    <Layout id="timeline" withSunflowers={true} sunflowerCount={6}>
      <div className="relative z-10">
        <motion.div
          className="text-center mb-20"
          variants={slideUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 bg-clip-text text-transparent mb-6"
            variants={slideUp}
          >
            Nuestra Historia
          </motion.h2>
          <motion.p
            className="text-text-secondary text-lg md:text-xl max-w-2xl mx-auto"
            variants={fadeIn}
          >
            Cada paso, cada risa, cada momento que nos trajo hasta aquí
          </motion.p>
        </motion.div>

        <div className="relative max-w-5xl mx-auto">
          {/* Vertical connecting line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-romantic/0 via-romantic/50 to-romantic/0 -translate-x-1/2 hidden md:block" />
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-romantic/0 via-romantic/50 to-romantic/0 md:hidden" />

          <div className="space-y-12 md:space-y-24">
            {timelineEvents.map((event, index) => {
              const isLeft = index % 2 === 0;

              return (
                <motion.div
                  key={event.id}
                  className={`relative flex flex-col md:flex-row items-center gap-6 md:gap-12 ${
                    isLeft ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                  variants={isLeft ? slideUp : { ...slideUp, hidden: { ...slideUp.hidden, x: 30 } }}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ delay: index * 0.1 }}
                >
                  {/* Card */}
                  <div className="flex-1 w-full">
                    <div className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 hover:border-romantic/50 transition-all duration-500 group">
                      <div className="absolute -top-4 left-6 text-4xl md:text-5xl">
                        {event.emoji}
                      </div>

                      <div className="mt-4">
                        <span className="text-golden text-xs md:text-sm uppercase tracking-widest font-medium">
                          {event.date}
                        </span>
                        <h3 className="text-xl md:text-2xl font-bold text-text-primary mt-2 mb-3 group-hover:text-romantic transition-colors">
                          {event.title}
                        </h3>
                        <p className="text-text-secondary leading-relaxed text-sm md:text-base">
                          {event.description}
                        </p>
                      </div>

                      {/* Decorative corner */}
                      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Sunflower size={24} className="opacity-40" />
                      </div>
                    </div>
                  </div>

                  {/* Center dot */}
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-romantic shadow-lg shadow-romantic/50 z-10" />

                  {/* Mobile dot */}
                  <div className="md:hidden absolute left-6 -translate-x-1/2 w-3 h-3 rounded-full bg-romantic shadow-lg shadow-romantic/50 z-10" />

                  {/* Empty spacer for alternating layout */}
                  <div className="hidden md:block flex-1" />
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Decorative sunflowers */}
        <div className="hidden lg:block">
          <Sunflower size={50} className="absolute top-20 left-10 opacity-30" />
          <Sunflower size={40} className="absolute top-40 right-16 opacity-25" />
          <Sunflower size={55} className="absolute bottom-32 left-20 opacity-20" />
          <Sunflower size={35} className="absolute bottom-20 right-10 opacity-30" />
        </div>
      </div>
    </Layout>
  );
}
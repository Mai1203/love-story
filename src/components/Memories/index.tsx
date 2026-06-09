"use client";

import { motion } from "framer-motion";
import { fadeIn, slideUp } from "@/animations";
import Layout from "@/components/Shared/Layout";
import Sunflower from "@/components/Shared/Sunflower";

interface MemoryCategory {
  emoji: string;
  title: string;
  description: string;
  color: string;
}

const memoryCategories: MemoryCategory[] = [
  {
    emoji: "🌅",
    title: "Amanecer",
    description: "El sol apareciendo mientras estábamos juntos",
    color: "from-orange-400 to-pink-500",
  },
  {
    emoji: "☕",
    title: "Desayuno",
    description: "Café caliente y sonrisas compartidas",
    color: "from-amber-400 to-orange-500",
  },
  {
    emoji: "🚗",
    title: "Camino",
    description: "El viaje hacia el glamping, lleno de canciones y risas",
    color: "from-blue-400 to-cyan-500",
  },
  {
    emoji: "🏕️",
    title: "Glamping",
    description: "Llegamos a nuestro refugio mágico",
    color: "from-green-400 to-emerald-500",
  },
  {
    emoji: "🔥",
    title: "Fogata",
    description: "Bajo las estrellas, contando historias",
    color: "from-red-400 to-orange-500",
  },
  {
    emoji: "🍷",
    title: "Cena",
    description: "Una cena especial bajo la luz de las velas",
    color: "from-purple-400 to-pink-500",
  },
  {
    emoji: "🌌",
    title: "Estrellas",
    description: "El cielo más bonito que he visto",
    color: "from-indigo-400 to-purple-500",
  },
  {
    emoji: "❤️",
    title: "Nosotros",
    description: "Simplemente nosotros, siendo felices",
    color: "from-rose-400 to-red-500",
  },
];

export default function Memories() {
  const featuredMemory = memoryCategories[0];

  return (
    <Layout id="memories" withSunflowers={true}>
      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          variants={slideUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
            Momentos de Nuestro Día
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Cada momento, una historia; cada historia, un tesoro
          </p>
        </motion.div>

        <motion.div
          className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${featuredMemory.color} p-8 md:p-12 mb-12`}
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
            <span className="text-7xl md:text-8xl">{featuredMemory.emoji}</span>
            <div className="text-center md:text-left">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-3">
                {featuredMemory.title}
              </h3>
              <p className="text-white/90 text-lg md:text-xl leading-relaxed max-w-xl">
                {featuredMemory.description}
              </p>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24 blur-3xl" />
        </motion.div>

        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 px-4 -mx-4 md:grid md:grid-cols-2 md:overflow-visible md:snap-none md:px-0 md:mx-0 lg:grid-cols-4 md:pb-0">
          {memoryCategories.slice(1).map((memory, index) => (
            <motion.div
              key={memory.title}
              className={`min-w-[280px] md:min-w-0 snap-center bg-gradient-to-br ${memory.color} to-bg-primary/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-romantic/50 transition-all duration-300`}
              variants={slideUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <div className="text-5xl mb-4">{memory.emoji}</div>
              <h3 className="text-xl font-bold text-text-primary mb-2">
                {memory.title}
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                {memory.description}
              </p>
            </motion.div>
          ))}
        </div>

        <Sunflower
          size={45}
          className="absolute -top-4 left-[10%] opacity-30 hidden md:block"
        />
        <Sunflower
          size={35}
          className="absolute top-[20%] -right-4 opacity-25 hidden md:block"
        />
        <Sunflower
          size={40}
          className="absolute bottom-[15%] left-[5%] opacity-30 hidden md:block"
        />
        <Sunflower
          size={30}
          className="absolute bottom-[25%] -left-2 opacity-25 hidden md:block"
        />
      </div>
    </Layout>
  );
}

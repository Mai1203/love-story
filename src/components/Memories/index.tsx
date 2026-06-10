"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { fadeIn, slideUp } from "@/animations";
import CloudinaryImage from "@/components/Shared/CloudinaryImage";
import Lightbox from "@/components/Shared/Lightbox";
import Sunflower from "@/components/Shared/Sunflower";
import Layout from "@/components/Shared/Layout";

interface MemoryCategory {
  emoji: string;
  title: string;
  description: string;
  color: string;
  images: string[];
}

const defaultMemories: MemoryCategory[] = [
  {
    emoji: "🌅",
    title: "Amanecer",
    description: "El sol apareciendo mientras estábamos juntos",
    color: "from-orange-400/80 to-pink-500/80",
    images: [],
  },
  {
    emoji: "☕",
    title: "Desayuno",
    description: "Café caliente y sonrisas compartidas",
    color: "from-amber-400/80 to-orange-500/80",
    images: [],
  },
  {
    emoji: "🚗",
    title: "Camino",
    description: "El viaje hacia el glamping, lleno de canciones y risas",
    color: "from-blue-400/80 to-cyan-500/80",
    images: [],
  },
  {
    emoji: "🏕️",
    title: "Glamping",
    description: "Llegamos a nuestro refugio mágico",
    color: "from-green-400/80 to-emerald-500/80",
    images: [],
  },
  {
    emoji: "🍷",
    title: "Cena",
    description: "Una cena especial bajo la luz de las velas",
    color: "from-purple-400/80 to-pink-500/80",
    images: [],
  },
  {
    emoji: "🌌",
    title: "Estrellas",
    description: "El cielo más bonito que he visto",
    color: "from-indigo-400/80 to-purple-500/80",
    images: [],
  },
  {
    emoji: "❤️",
    title: "Nosotros",
    description: "Simplemente nosotros, siendo felices",
    color: "from-rose-400/80 to-red-500/80",
    images: [],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
};

export default function Memories() {
  const [memories, setMemories] = useState<MemoryCategory[]>(defaultMemories);
  const [lightbox, setLightbox] = useState<{
    images: string[];
    index: number;
    title: string;
    description: string;
  } | null>(null);
  const [uploadModal, setUploadModal] = useState<{
    index: number;
  } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [localImages, setLocalImages] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem("memories-images");
      if (saved) {
        const parsed = JSON.parse(saved);
        const uniqueImages = new Set<string>(parsed);
        setLocalImages(uniqueImages);
        setMemories((prev) =>
          prev.map((m, i) => ({
            ...m,
            images: (parsed[i] as string[]) || [],
          }))
        );
      }
    } catch {}
  }, []);

  const persistImages = useCallback((updated: MemoryCategory[]) => {
    const imagesByCard = updated.map((m) => m.images);
    const flattened = imagesByCard.flat();
    localStorage.setItem("memories-images", JSON.stringify(imagesByCard));
    setLocalImages(new Set(flattened));
  }, []);

  const openUploadModal = (index: number) => setUploadModal({ index });
  const closeUploadModal = () => setUploadModal(null);

  const openLightbox = (index: number, imgIndex: number) => {
    setLightbox({
      images: memories[index].images,
      index: imgIndex,
      title: memories[index].title,
      description: memories[index].description,
    });
  };

  const closeLightbox = () => setLightbox(null);

  const nextImage = () =>
    setLightbox((prev) =>
      prev && prev.index < prev.images.length - 1
        ? { ...prev, index: prev.index + 1 }
        : prev
    );

  const prevImage = () =>
    setLightbox((prev) =>
      prev && prev.index > 0 ? { ...prev, index: prev.index - 1 } : prev
    );

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || uploadModal === null) return;

    setIsUploading(true);
    setUploadProgress(30);

    try {
      const formData = new FormData();
      formData.set("file", file);
      formData.set("folder", "memories");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Upload failed");
      }

      setUploadProgress(70);

      const data = await res.json();
      setUploadProgress(100);

      setMemories((prev) => {
        const updated = [...prev];
        updated[uploadModal.index] = {
          ...updated[uploadModal.index],
          images: [...updated[uploadModal.index].images, data.url],
        };
        persistImages(updated);
        return updated;
      });

      setTimeout(() => closeUploadModal(), 600);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error subiendo imagen");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      e.target.value = "";
    }
  };

  const featuredMemory = memories[0];

  return (
    <Layout id="memories" withSunflowers={true}>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-20"
          variants={slideUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            viewport={{ once: true }}
            className="inline-block mb-4 px-4 py-1.5 rounded-full bg-romantic/10 border border-romantic/20 text-romantic font-medium tracking-wide text-sm"
          >
            NUESTROS RECUERDOS
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-bold text-text-primary mb-6 tracking-tight">
            Momentos de <span className="text-transparent bg-clip-text bg-gradient-to-r from-romantic to-pink-500">Nuestro Día</span>
          </h2>
          <p className="text-text-secondary text-lg md:text-xl max-w-2xl mx-auto font-light">
            Cree este minialbum de fotos digital, para que podamos recordar los momentos que compartimos juntos.
          </p>
        </motion.div>

        {/* Featured Memory */}
        <motion.div
          className={`relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br ${featuredMemory.color} p-1 shadow-2xl shadow-orange-500/10 mb-20 group`}
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="absolute inset-0 bg-white/20 backdrop-blur-3xl" />
          <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-white/10 rounded-full -mr-[20rem] -mt-[20rem] blur-3xl transition-transform duration-1000 group-hover:scale-110" />
          <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-white/10 rounded-full -ml-[15rem] -mb-[15rem] blur-3xl transition-transform duration-1000 group-hover:scale-110" />
          
          <div className="relative z-10 bg-bg-primary/40 backdrop-blur-xl rounded-[2.3rem] p-8 md:p-14 border border-white/20 h-full flex flex-col md:flex-row items-center gap-10 md:gap-16">
            <motion.div 
              animate={{ y: [0, -15, 0], rotate: [0, 5, -5, 0] }} 
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="text-8xl md:text-9xl drop-shadow-2xl"
            >
              {featuredMemory.emoji}
            </motion.div>
            
            <div className="text-center md:text-left flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
                <h3 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight drop-shadow-md">
                  {featuredMemory.title}
                </h3>
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.25)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => openUploadModal(0)}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white/15 backdrop-blur-md border border-white/30 px-5 py-2.5 text-sm font-medium text-white transition-all shadow-lg self-center md:self-auto"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Añadir recuerdo
                </motion.button>
              </div>
              <p className="text-white/90 text-lg md:text-2xl leading-relaxed max-w-2xl font-light mb-8">
                {featuredMemory.description}
              </p>
              
              {featuredMemory.images.length > 0 ? (
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  <AnimatePresence>
                    {featuredMemory.images.map((img, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
                        animate={{ scale: 1, opacity: 1, rotate: idx % 2 === 0 ? 3 : -3 }}
                        transition={{ type: "spring", delay: idx * 0.1 }}
                        whileHover={{ scale: 1.1, rotate: 0, zIndex: 10 }}
                        className="relative w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden shadow-2xl border-4 border-white cursor-pointer origin-center"
                        onClick={() => openLightbox(0, idx)}
                      >
                        <CloudinaryImage
                          src={img}
                          alt={`${featuredMemory.title} ${idx + 1}`}
                          width={400}
                          height={400}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/10 opacity-0 hover:opacity-100 transition-opacity duration-300" />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="inline-block rounded-2xl border border-dashed border-white/30 bg-white/5 px-8 py-6 text-center backdrop-blur-sm">
                  <p className="text-white/70 text-sm md:text-base">
                    Aún no hay fotos aquí.<br/>
                    <span className="text-white font-medium">¡Sube la primera!</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Grid of Memories */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {memories.slice(1).map((memory, index) => (
            <MemoryCard
              key={memory.title}
              memory={memory}
              onClickAdd={() => openUploadModal(index + 1)}
              onImageClick={(imgIndex: number) => openLightbox(index + 1, imgIndex)}
            />
          ))}
        </motion.div>

        {/* Modals */}
        {mounted && createPortal(
          <AnimatePresence>
            {uploadModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[199] flex items-center justify-center p-4"
              >
              <div className="absolute inset-0 bg-bg-primary/90 backdrop-blur-xl" onClick={closeUploadModal} />
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative z-10 w-full max-w-md rounded-3xl bg-gradient-to-b from-white/10 to-transparent border border-white/20 shadow-2xl overflow-hidden"
              >
                <div className="p-8 bg-bg-primary/80 backdrop-blur-2xl">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-text-primary mb-1">
                        Añadir recuerdo
                      </h3>
                      <p className="text-text-secondary text-sm flex items-center gap-2">
                        <span className="text-xl">{memories[uploadModal.index].emoji}</span>
                        {memories[uploadModal.index].title}
                      </p>
                    </div>
                    <button onClick={closeUploadModal} className="p-2 rounded-full hover:bg-white/10 text-text-secondary transition-colors">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <label className="flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-romantic/30 hover:border-romantic hover:bg-romantic/5 transition-all p-10 cursor-pointer group">
                    <motion.div 
                      whileHover={{ scale: 1.1, rotate: 10 }}
                      className="p-4 rounded-full bg-romantic/10 text-romantic group-hover:bg-romantic group-hover:text-white transition-colors"
                    >
                      <svg
                        className="w-8 h-8"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                    </motion.div>
                    <div className="text-center">
                      <span className="block text-base font-medium text-text-primary mb-1">
                        Sube una foto especial
                      </span>
                      <span className="text-sm text-text-secondary">
                        Haz clic o arrastra aquí
                      </span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleUpload}
                      disabled={isUploading}
                    />
                  </label>

                  <AnimatePresence>
                    {isUploading && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: "auto", marginTop: 24 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="flex justify-between text-xs text-text-secondary mb-2">
                          <span>Subiendo tu recuerdo...</span>
                          <span className="font-medium text-romantic">{uploadProgress}%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                          <motion.div
                            className="h-full rounded-full bg-gradient-to-r from-romantic to-pink-500"
                            initial={{ width: "0%" }}
                            animate={{ width: `${uploadProgress}%` }}
                            transition={{ ease: "easeOut" }}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
        )}

        {lightbox && (
          <Lightbox
            isOpen={!!lightbox}
            image={lightbox.images[lightbox.index]}
            title={lightbox.title}
            description={lightbox.description}
            onClose={closeLightbox}
            onNext={nextImage}
            onPrev={prevImage}
            hasNext={lightbox.index < lightbox.images.length - 1}
            hasPrev={lightbox.index > 0}
          />
        )}

        <Sunflower size={45} className="absolute -top-4 left-[10%] opacity-20 hidden md:block" />
        <Sunflower size={35} className="absolute top-[20%] -right-4 opacity-15 hidden md:block" />
        <Sunflower size={40} className="absolute bottom-[15%] left-[5%] opacity-20 hidden md:block" />
        <Sunflower size={30} className="absolute bottom-[25%] -left-2 opacity-15 hidden md:block" />
      </div>
    </Layout>
  );
}

function MemoryCard({
  memory,
  onClickAdd,
  onImageClick,
}: {
  memory: MemoryCategory;
  onClickAdd: () => void;
  onImageClick: (imgIndex: number) => void;
}) {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -8 }}
      className={`group relative overflow-hidden rounded-[2rem] bg-gradient-to-br ${memory.color} p-0.5 shadow-lg hover:shadow-2xl hover:shadow-romantic/20 transition-all duration-500`}
    >
      <div className="absolute inset-0 bg-white/10 backdrop-blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative h-full flex flex-col bg-bg-primary/60 backdrop-blur-md rounded-[1.8rem] p-6 border border-white/10 group-hover:bg-bg-primary/40 transition-colors duration-500">
        <div className="flex items-start justify-between mb-6">
          <motion.div 
            className="text-5xl drop-shadow-md"
            whileHover={{ scale: 1.2, rotate: 10 }}
          >
            {memory.emoji}
          </motion.div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClickAdd}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-colors shadow-sm"
            title="Agregar foto"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
          </motion.button>
        </div>

        <h3 className="text-2xl font-bold text-text-primary mb-2 group-hover:text-romantic transition-colors">
          {memory.title}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-6 flex-grow">
          {memory.description}
        </p>

        {memory.images.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 mt-auto">
            <AnimatePresence>
              {memory.images.slice(0, 4).map((img, idx) => (
                <motion.button
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05, zIndex: 10 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onImageClick(idx)}
                  className={`relative aspect-square rounded-xl overflow-hidden shadow-md border-2 border-white/10 hover:border-white/50 transition-colors ${
                    memory.images.length === 1 ? 'col-span-2 aspect-video' : ''
                  } ${memory.images.length === 3 && idx === 0 ? 'col-span-2 aspect-video' : ''}`}
                >
                  <CloudinaryImage
                    src={img}
                    alt={`${memory.title} ${idx + 1}`}
                    width={400}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                  {idx === 3 && memory.images.length > 4 && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center text-white font-bold text-xl">
                      +{memory.images.length - 4}
                    </div>
                  )}
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="mt-auto rounded-2xl border border-dashed border-white/20 bg-white/5 p-6 flex flex-col items-center justify-center gap-3 text-center transition-colors group-hover:border-romantic/40 group-hover:bg-romantic/5">
            <div className="p-3 rounded-full bg-white/5 text-text-secondary group-hover:text-romantic transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-text-secondary text-xs">
              Sin recuerdos aún.<br/>
              <span className="font-medium text-text-primary mt-1 block">Añade tu primera foto</span>
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

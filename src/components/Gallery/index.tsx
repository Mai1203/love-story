"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { fadeIn, slideUp } from "@/animations";
import Layout from "@/components/Shared/Layout";
import Sunflower from "@/components/Shared/Sunflower";
import CloudinaryImage from "@/components/Shared/CloudinaryImage";
import Lightbox from "@/components/Shared/Lightbox";

interface GalleryItem {
  id: string;
  type: "image" | "video";
  url: string;
  title: string;
  date: string;
}

export default function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Upload state
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadData, setUploadData] = useState({ title: "", date: new Date().toISOString().split('T')[0] });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const fetchGallery = async (silent = false) => {
    try {
      if (!silent) setIsLoading(true);
      const res = await fetch("/api/gallery");
      if (!res.ok) throw new Error("Error cargando galería");
      const data = await res.json();
      const sorted = (data.items as GalleryItem[]).sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setItems(sorted);
    } catch {
      if (!silent) setItems([]);
    } finally {
      if (!silent) setIsLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchGallery();
  }, []);


  const openLightbox = (index: number) => {
    if (items[index].type === "image") {
      setSelectedIndex(index);
    }
  };

  const closeLightbox = () => setSelectedIndex(null);

  const navigateTo = (direction: "prev" | "next") => {
    if (selectedIndex === null) return;
    let newIndex = selectedIndex;
    const maxLoops = items.length;
    let loops = 0;
    do {
      newIndex =
        direction === "next"
          ? (newIndex + 1) % items.length
          : (newIndex === 0 ? items.length - 1 : newIndex - 1);
      loops++;
    } while (items[newIndex].type !== "image" && loops < maxLoops);
    
    if (items[newIndex].type === "image") {
      setSelectedIndex(newIndex);
    } else {
      closeLightbox();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(20);

    try {
      const formData = new FormData();
      formData.set("file", selectedFile);
      formData.set("folder", "galery");
      formData.set("title", uploadData.title || "Sin título");
      formData.set("date", uploadData.date);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Error en la subida");

      setUploadProgress(70);
      const data = await res.json();
      setUploadProgress(100);

      // Add image optimistically to local state right away
      const optimisticItem: GalleryItem = {
        id: data.publicId || Date.now().toString(),
        type: "image",
        url: data.url,
        title: uploadData.title || "Sin título",
        date: uploadData.date,
      };
      setItems(prev => {
        const updated = [optimisticItem, ...prev];
        updated.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        return updated;
      });

      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);

      setTimeout(() => {
        setUploadModalOpen(false);
        setSelectedFile(null);
        setUploadData({ title: "", date: new Date().toISOString().split('T')[0] });
      }, 500);

      // Refetch from Cloudinary after a short delay to sync (silent = no loading flash)
      setTimeout(() => fetchGallery(true), 2500);

    } catch (err) {
      alert("Error subiendo foto. Intenta de nuevo.");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };


  const selectedItem = selectedIndex !== null ? items[selectedIndex] : null;

  return (
    <Layout id="gallery" withSunflowers={true}>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16 flex flex-col items-center"
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
            NUESTRA HISTORIA
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
            Nuestra Galería Viva
          </h2>
          <p className="text-text-secondary text-lg mb-8 max-w-2xl text-center">
            Cada foto es un recuerdo eterno. Añade nuestros mejores momentos cronológicamente para crear nuestra historia.
          </p>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setUploadModalOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-romantic to-pink-500 text-white rounded-full font-medium shadow-lg shadow-romantic/20 hover:shadow-xl hover:shadow-romantic/40 transition-all"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Añadir recuerdo
          </motion.button>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            visible: { transition: { staggerChildren: 0.1 } },
            hidden: {},
          }}
        >
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="relative rounded-2xl overflow-hidden border border-white/10 aspect-[4/3] bg-white/5 animate-pulse"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
              </div>
            ))
          ) : items.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
              <svg className="w-16 h-16 text-white/20 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-text-secondary text-lg">Aún no hay recuerdos en la galería</p>
              <p className="text-text-secondary/60 text-sm mt-1">Sé el primero en añadir uno ♥</p>
            </div>
          ) : (
            items.map((item, index) => (
              <motion.div
                key={item.id}
                onClick={() => openLightbox(index)}
                className="relative rounded-2xl overflow-hidden shadow-lg border border-white/10 hover:border-romantic/50 transition-all cursor-pointer group aspect-[4/3] bg-bg-primary/50"
variants={{
                   hidden: { opacity: 0, y: 20 },
                   visible: { opacity: 1, y: 0, transition: { type: "spring" as const } }
                 }}
                whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)" }}
              >
                <CloudinaryImage
                  src={item.url}
                  alt={item.title}
                  width={800}
                  height={600}
                  priority={true}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform">
                  <p className="text-romantic font-semibold text-xs tracking-wider mb-1 uppercase">
                    {new Date(item.date).toLocaleDateString('es-ES', { month: 'long', year: 'numeric', day: 'numeric' })}
                  </p>
                  <p className="text-white text-xl font-bold drop-shadow-md">{item.title}</p>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>

      {/* Lightbox Modal */}
      {selectedItem && mounted && (
        <Lightbox
          isOpen={selectedIndex !== null}
          onClose={closeLightbox}
          image={selectedItem.url}
          title={selectedItem.title}
          description={new Date(selectedItem.date).toLocaleDateString('es-ES', { month: 'long', year: 'numeric', day: 'numeric' })}
          onNext={() => navigateTo("next")}
          onPrev={() => navigateTo("prev")}
          hasNext={items.filter(i => i.type === 'image').length > 1}
          hasPrev={items.filter(i => i.type === 'image').length > 1}
        />
      )}

      {/* Upload Modal via Portal */}
      {mounted && createPortal(
        <AnimatePresence>
          {uploadModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[199] flex items-center justify-center p-4"
            >
              <div className="absolute inset-0 bg-bg-primary/90 backdrop-blur-xl" onClick={() => !isUploading && setUploadModalOpen(false)} />
              
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative z-10 w-full max-w-md rounded-3xl bg-bg-primary border border-white/10 shadow-2xl overflow-hidden p-8"
              >
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-2xl font-bold text-text-primary">Añadir a la Galería</h3>
                  <button 
                    onClick={() => setUploadModalOpen(false)} 
                    disabled={isUploading}
                    className="p-2 rounded-full hover:bg-white/10 text-text-secondary transition-colors disabled:opacity-50"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleUploadSubmit} className="flex flex-col gap-5">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Foto</label>
                    <label className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed ${selectedFile ? 'border-romantic bg-romantic/5' : 'border-white/20 hover:border-romantic/50'} transition-all p-6 cursor-pointer`}>
                      {selectedFile ? (
                        <div className="text-center">
                          <svg className="w-8 h-8 text-romantic mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-sm font-medium text-romantic">{selectedFile.name}</span>
                        </div>
                      ) : (
                        <div className="text-center">
                          <svg className="w-8 h-8 text-text-secondary mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                          </svg>
                          <span className="text-sm text-text-secondary">Haz clic para seleccionar foto</span>
                        </div>
                      )}
                      <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} disabled={isUploading} required />
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Título del recuerdo</label>
                    <input 
                      type="text" 
                      value={uploadData.title}
                      onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                      placeholder="Ej: Paseo por la playa"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-romantic transition-colors"
                      required
                      disabled={isUploading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Fecha del recuerdo</label>
                    <input 
                      type="date" 
                      value={uploadData.date}
                      onChange={(e) => setUploadData({ ...uploadData, date: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-romantic transition-colors"
                      required
                      disabled={isUploading}
                    />
                  </div>

                  {isUploading && (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-text-secondary mb-2">
                        <span>Subiendo...</span>
                        <span className="font-medium text-romantic">{uploadProgress}%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-romantic to-pink-500"
                          initial={{ width: "0%" }}
                          animate={{ width: `${uploadProgress}%` }}
                          transition={{ ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  )}

                  <button 
                    type="submit" 
                    disabled={isUploading || !selectedFile}
                    className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-romantic to-pink-500 text-white font-medium hover:shadow-lg hover:shadow-romantic/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUploading ? 'Subiendo...' : 'Guardar en galería'}
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Notification Toast */}
      {mounted && createPortal(
        <AnimatePresence>
          {showNotification && (
            <motion.div
              className="fixed bottom-6 right-6 z-[200] bg-romantic text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3"
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-medium">Recuerdo agregado a la galería</span>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      <Sunflower size={55} className="bottom-4 left-4 hidden lg:block" />
      <Sunflower size={45} className="bottom-8 right-8 hidden lg:block" />
    </Layout>
  );
}

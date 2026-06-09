"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeIn, scaleIn, slideUp } from "@/animations";
import Layout from "@/components/Shared/Layout";
import Sunflower from "@/components/Shared/Sunflower";

interface GalleryItem {
  id: number;
  type: "image" | "video";
  url: string;
  title: string;
  date: string;
}

const initialGalleryItems: GalleryItem[] = [
  {
    id: 1,
    type: "image",
    url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
    title: "Nuestro primer baile",
    date: "2023-06-15",
  },
  {
    id: 2,
    type: "image",
    url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
    title: "Anillos de compromiso",
    date: "2023-03-10",
  },
  {
    id: 3,
    type: "image",
    url: "https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&w=800&q=80",
    title: "Atardecer juntos",
    date: "2023-08-20",
  },
  {
    id: 4,
    type: "video",
    url: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=800&q=80",
    title: "Video: La propuesta",
    date: "2023-02-14",
  },
  {
    id: 5,
    type: "image",
    url: "https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=800&q=80",
    title: "Cena romántica",
    date: "2023-05-01",
  },
  {
    id: 6,
    type: "image",
    url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80",
    title: "Fiesta de compromiso",
    date: "2023-04-22",
  },
  {
    id: 7,
    type: "image",
    url: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=80",
    title: "Paseo por la playa",
    date: "2023-07-30",
  },
  {
    id: 8,
    type: "video",
    url: "https://images.unsplash.com/photo-1522673607200-1645062cd958?auto=format&fit=crop&w=800&q=80",
    title: "Video: Llegada a la iglesia",
    date: "2023-09-10",
  },
  {
    id: 9,
    type: "image",
    url: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=800&q=80",
    title: "Brindis de amor",
    date: "2023-09-11",
  },
  {
    id: 10,
    type: "image",
    url: "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?auto=format&fit=crop&w=800&q=80",
    title: "Mirada eterna",
    date: "2023-09-12",
  },
];

export default function Gallery() {
  const [items] = useState<GalleryItem[]>(initialGalleryItems);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    }, 15000 + Math.random() * 5000);

    return () => clearInterval(interval);
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

  const selectedItem = selectedIndex !== null ? items[selectedIndex] : null;

  return (
    <Layout id="gallery" withSunflowers={true}>
      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-12"
          variants={slideUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
            Nuestra Galería Viva
          </h2>
          <p className="text-text-secondary text-lg">
            Cada foto, un recuerdo eterno
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              onClick={() => openLightbox(index)}
              className="relative rounded-xl overflow-hidden border border-white/10 hover:border-romantic/50 transition cursor-pointer group"
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <img
                src={item.url}
                alt={item.title}
                className="w-full h-64 object-cover"
                loading="lazy"
              />
              {item.type === "video" && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <div className="bg-black/50 rounded-full w-12 h-12 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white ml-1"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                <p className="text-white text-sm font-medium">{item.title}</p>
                <p className="text-white/70 text-xs">{item.date}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedItem && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white text-3xl font-bold hover:text-romantic transition z-50"
            >
              &times;
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                navigateTo("prev");
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-4xl hover:text-romantic transition hidden md:block z-50"
            >
              &lsaquo;
            </button>

            <motion.img
              src={selectedItem.url}
              alt={selectedItem.title}
              className="max-w-5xl max-h-[90vh] object-contain rounded-lg shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            />

            <button
              onClick={(e) => {
                e.stopPropagation();
                navigateTo("next");
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl hover:text-romantic transition hidden md:block z-50"
            >
              &rsaquo;
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showNotification && (
          <motion.div
            className="fixed top-4 right-4 z-50 bg-romantic text-white px-6 py-3 rounded-xl shadow-lg"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            Nuevo recuerdo agregado ❤️
          </motion.div>
        )}
      </AnimatePresence>

      <Sunflower size={55} className="bottom-4 left-4 hidden lg:block" />
      <Sunflower size={45} className="bottom-8 right-8 hidden lg:block" />
    </Layout>
  );
}

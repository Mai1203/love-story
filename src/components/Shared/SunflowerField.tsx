"use client";

import { motion } from "framer-motion";
import Sunflower from "./Sunflower";

interface SunflowerFieldProps {
  count?: number;
  className?: string;
  position?: "bottom" | "scatter" | "top";
}

export default function SunflowerField({
  count = 8,
  className = "",
  position = "bottom",
}: SunflowerFieldProps) {
  const swayVariants = {
    animate: {
      rotate: [-3, 3, -3],
      transition: {
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut" as const,
      },
    },
  };

  const getPlacement = (index: number, total: number) => {
    const size = 30 + (index * 37) % 41;

    if (position === "scatter") {
      return {
        left: `${(index * 97) / total}%`,
        top: `${(index * 83) / total}%`,
        bottom: undefined,
        size,
      };
    }

    if (position === "top") {
      return {
        left: `${10 + (index * 80) / total}%`,
        top: `${5 + (index * 30) / total}%`,
        bottom: undefined,
        size,
      };
    }

    return {
      left: `${10 + (index * 80) / total}%`,
      bottom: `${10 + (index * 35) / total}%`,
      top: undefined,
      size,
    };
  };

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {Array.from({ length: count }).map((_, i) => {
        const placement = getPlacement(i, count);
        return (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: placement.left,
              ...(placement.top !== undefined && { top: placement.top }),
              ...(placement.bottom !== undefined && { bottom: placement.bottom }),
            }}
            variants={swayVariants}
            animate="animate"
            transition={{ delay: i * 0.4 }}
          >
            <Sunflower size={placement.size} className="opacity-40" />
          </motion.div>
        );
      })}
    </div>
  );
}

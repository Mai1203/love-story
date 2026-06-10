"use client";

import { useState } from "react";

interface CloudinaryImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

export default function CloudinaryImage({
  src,
  alt,
  width = 800,
  height = 600,
  className = "",
  priority = false,
}: CloudinaryImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const isAbsoluteUrl = src.startsWith('http://') || src.startsWith('https://');
  const imageUrl = isAbsoluteUrl
    ? src
    : `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto,w_${width}/${src}`;

  return (
    <span className="relative block w-full h-full">
      {/* Placeholder shown while loading */}
      {!loaded && !error && (
        <span className="absolute inset-0 bg-white/5 animate-pulse" />
      )}

      {/* Error state */}
      {error && (
        <span className="absolute inset-0 flex items-center justify-center bg-white/5">
          <svg className="w-8 h-8 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </span>
      )}

      <img
        src={imageUrl}
        alt={alt}
        className={`${className} transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        onLoad={() => setLoaded(true)}
        onError={() => { setError(true); setLoaded(true); }}
      />
    </span>
  );
}
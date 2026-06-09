"use client";

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
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  if (!cloudName) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        width={width}
        height={height}
      />
    );
  }

  const imageUrl = `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto,w_${width}/${src}`;

  return (
    <img
      src={imageUrl}
      alt={alt}
      className={className}
      width={width}
      height={height}
      loading={priority ? "eager" : "lazy"}
    />
  );
}
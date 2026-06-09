"use client";

interface SunflowerProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function Sunflower({ size = 40, className = "", style }: SunflowerProps) {
  const petalCount = 16;
  const petals = Array.from({ length: petalCount }).map((_, i) => {
    const angle = (i * 360) / petalCount;
    const rad = (angle * Math.PI) / 180;
    const innerR = 12;
    const outerR = 22;
    const petalWidth = 6;
    
    const x1 = 50 + Math.cos(rad) * innerR;
    const y1 = 50 + Math.sin(rad) * innerR;
    const x2 = 50 + Math.cos(rad) * outerR;
    const y2 = 50 + Math.sin(rad) * outerR;
    
    const perp1 = rad + Math.PI / 2;
    const perp2 = rad - Math.PI / 2;
    
    const x3 = x2 + Math.cos(perp1) * petalWidth;
    const y3 = y2 + Math.sin(perp1) * petalWidth;
    const x4 = x2 + Math.cos(perp2) * petalWidth;
    const y4 = y2 + Math.sin(perp2) * petalWidth;
    
    return { x1, y1, x2, y2, x3, y3, x4, y4 };
  });

  return (
    <div className={`absolute ${className}`} style={style}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Tallo */}
        <line x1="50" y1="65" x2="50" y2="95" stroke="#22C55E" strokeWidth="3" />
        {/* Hoja */}
        <path d="M50 92 Q42 86 50 80 Q58 86 50 92" fill="#16A34A" stroke="#15803D" strokeWidth="0.5" />
        {/* Pétalos */}
        {petals.map((p, i) => (
          <path
            key={i}
            d={`M${p.x1} ${p.y1} L${p.x4} ${p.y4} L${p.x3} ${p.y3} Z`}
            fill="#FEF3C7"
            stroke="#F59E0B"
            strokeWidth="0.5"
          />
        ))}
        {/* Centro oscuro */}
        <circle cx="50" cy="50" r="10" fill="#F59E0B" />
        <circle cx="50" cy="50" r="6" fill="#D97706" />
      </svg>
    </div>
  );
}
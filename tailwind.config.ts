import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "bg-primary": "#09090B",
        "text-primary": "#FFFFFF",
        "text-secondary": "#A1A1AA",
        romantic: "#FF4D6D",
        golden: "#FBBF24",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        float: "float 3s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite alternate",
        sunflowerSwing: "sunflowerSwing 4s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        glow: {
          "0%": { opacity: "0.5", filter: "brightness(1)" },
          "100%": { opacity: "1", filter: "brightness(1.2)" },
        },
        sunflowerSwing: {
          "0%, 100%": { transform: "rotate(-5deg) translateY(0)" },
          "50%": { transform: "rotate(5deg) translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
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
        navy: {
          DEFAULT: "#102B46",
          dark: "#0A1C2E",
          light: "#1A3F63",
        },
        teal: {
          DEFAULT: "#159B9B",
          dark: "#107A7A",
          light: "#E8F6F6",
        },
        surface: "#F3F7FA",
        gold: {
          DEFAULT: "#C6A66B",
          light: "#F7F2E8",
        },
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "system-ui", "-apple-system", "sans-serif"],
        serif: ["var(--font-playfair)", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;


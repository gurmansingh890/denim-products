/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#041533",
        "on-primary": "#ffffff",
        "primary-container": "#1b2a49",
        "on-primary-container": "#8392b6",
        "primary-fixed": "#d9e2ff",
        "primary-fixed-dim": "#b7c6ed",
        "on-primary-fixed": "#0a1b39",
        "on-primary-fixed-variant": "#384667",
        
        "secondary": "#974724",
        "on-secondary": "#ffffff",
        "secondary-container": "#ff996f",
        "on-secondary-container": "#772f0d",
        "secondary-fixed": "#ffdbce",
        "secondary-fixed-dim": "#ffb598",
        "on-secondary-fixed": "#370e00",
        "on-secondary-fixed-variant": "#78310f",
        
        "tertiary": "#251009",
        "on-tertiary": "#ffffff",
        "tertiary-container": "#3d241c",
        "on-tertiary-container": "#ae897e",
        "tertiary-fixed": "#ffdbd0",
        "tertiary-fixed-dim": "#e7bdb1",
        "on-tertiary-fixed": "#2c160e",
        "on-tertiary-fixed-variant": "#5d4037",

        "surface": "#fbf9f4",
        "on-surface": "#1b1c19",
        "on-surface-variant": "#45464e",
        "surface-dim": "#dbdad5",
        "surface-bright": "#fbf9f4",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f5f3ee",
        "surface-container": "#f0eee9",
        "surface-container-high": "#eae8e3",
        "surface-container-highest": "#e4e2dd",
        "surface-variant": "#e4e2dd",
        "surface-tint": "#505e80",

        "background": "#fbf9f4",
        "on-background": "#1b1c19",
        
        "outline": "#75777e",
        "outline-variant": "#c5c6cf",

        "inverse-surface": "#30312e",
        "inverse-on-surface": "#f2f1ec",
        "inverse-primary": "#b7c6ed",

        "error": "#ba1a1a",
        "on-error": "#ffffff",
        "error-container": "#ffdad6",
        "on-error-container": "#93000a"
      },
      borderRadius: {
        "DEFAULT": "0.125rem",
        "sm": "0.125rem",
        "md": "0.25rem",
        "lg": "0.375rem",
        "xl": "0.5rem",
        "full": "9999px"
      },
      spacing: {
        "base": "8px",
        "gutter": "24px",
        "margin-mobile": "16px",
        "margin-desktop": "64px",
        "stitch-gap": "4px"
      },
      fontFamily: {
        "headline-lg": ["Domine", "serif"],
        "headline-lg-mobile": ["Domine", "serif"],
        "headline-md": ["Domine", "serif"],
        "display-lg": ["Domine", "serif"],
        "body-lg": ["Work Sans", "sans-serif"],
        "body-md": ["Work Sans", "sans-serif"],
        "label-md": ["JetBrains Mono", "monospace"],
        "stitch-label": ["JetBrains Mono", "monospace"]
      }
    },
  },
  plugins: [],
};

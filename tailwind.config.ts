import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        mist: "#EFF0EB",
        sprout: "#CFE26C",
        lime: "#B6F022",
        moss: "#64B60A",
        "teal-deep": "#0B636B",
      },
      fontFamily: {
        display: ["var(--font-outfit)", "var(--font-jakarta)", "sans-serif"],
        body: ["var(--font-jakarta)", "sans-serif"],
      },
      borderRadius: {
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "32px",
        full: "9999px",
      },
      boxShadow: {
        warm: "0 10px 30px -10px rgba(11, 99, 107, 0.08)",
        "card-dark": "0 24px 48px -12px rgba(11, 99, 107, 0.4)",
        "glow-lime": "0 8px 24px -6px rgba(182, 240, 34, 0.5)",
      },
    },
  },
  plugins: [],
};

export default config;

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      colors: {
        darkBg: '#161E2F',
        skyBlue: '#0D81FE',
        lightBlue: "#ECF2F4",
        black: '#000000',
        white: '#FFFFFF',
        darkBlue: "#0C182A",
        lightGray: '#515B69',
        darkGray: '#525C6E'

      },
    },
  },
  darkMode: 'class',
  plugins: [],
};
export default config;

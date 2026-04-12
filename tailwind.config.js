/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primaryDark: "var(--color-primary-dark)",
        primaryDark80: "var(--color-primary-dark-80)",

        primary: "var(--color-primary)",
        primaryLight: "var(--color-primary-light)",
        primaryCyan: "var(--color-primary-cyan)",
      },
    },
  },
  plugins: [],
};

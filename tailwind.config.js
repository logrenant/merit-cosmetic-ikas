/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  safelist: [
    "w-1/2",
    {
      pattern: /./,
    },
  ],
  theme: {
    extend: {
      boxShadow: {
        navbar: "0px 4px 30px rgba(0, 0, 0, 0.16)",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
  ],
};

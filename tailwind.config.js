module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#0EA5E9",
          secondary: "#10B981",
          accent: "#6366F1",
          surface: "#F8FAFC",
          dark: "#0F172A",
        },
      },
    },
  },
  plugins: [],
};

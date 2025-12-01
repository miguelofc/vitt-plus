module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        primary: "#2563eb",
        cyan: "#06b6d4",
        accent: "#6366f1",
        surface: "#0f172a",
        soft: "#f1f5f9"
      },
      borderRadius: {
        "2xl": "1rem"
      },
      boxShadow: {
        soft: "0 18px 45px rgba(15, 23, 42, 0.25)"
      }
    }
  },
  plugins: []
};

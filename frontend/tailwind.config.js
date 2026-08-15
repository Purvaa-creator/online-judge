export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        base: {
          DEFAULT: "#0D1117",
          surface: "#161B22",
          "surface-hover": "#1F262E",
          border: "#30363D",
          primary: "#E6EDF3",
          secondary: "#8B949E",
          disabled: "#484F58",
        },
        accent: {
          primary: "#2F81F7",
          "primary-hover": "#1F6FEB",
          secondary: "#A371F7",
        },
        verdict: {
          accepted: "#3FB950",
          wrong: "#F85149",
          tle: "#D29922",
          mle: "#DB6D28",
          error: "#BC8CFF",
          pending: "#58A6FF",
        },
        ink: "#0D1117",
        paper: "#E6EDF3",
        signal: "#2F81F7",
        "signal-dark": "#1F6FEB",
        reject: "#F85149",
        pending: "#D29922",
      },
      fontFamily: {
        display: ["'JetBrains Mono'", "ui-monospace", "monospace"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 10px 30px rgba(0, 0, 0, 0.25)",
      },
    },
  },
};
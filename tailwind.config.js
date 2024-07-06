import daisyui from "daisyui";

const config = {
  content: ["./src/**/*.{ts,tsx}"],
  daisyui: {
    darkTheme: "dracula",
    themes: [
      {
        lemonade: {
          ...require("daisyui/src/theming/themes")["lemonade"],
          neutral: "#212221",
          primary: "#D48389",
          secondary: "#6ECBC3",
          error: "#FF0000",
          success: "#49E949",
          warning: "#F9FF50",
          "body": {
            "border-radius": "11px",
          },
          "#root": {
            "border-radius": "11px",
          },
          "#main": {
            "--gradient-light":
              "linear-gradient(187deg, rgba(248,253,239,1) 2%, rgba(203,110,118,0.05) 24%, rgba(203,110,118,0.05) 83%, rgba(248,253,239,1) 95%)",
            "--bg-light": "url(/src/assets/texture-light.svg)",
            background: "var(--bg-light)",
            "background-repeat": "no-repeat",
            "background-size": "cover ",
            "background-blend-mode": "multiply",
            "min-height": "100vh",
            padding: "4rem 0.5rem 0.5rem 0.5rem",
            "border-bottom-width": "1px",
            "--tw-border-opacity": "1",
            "border-bottom-color":
              "var(--fallback-p,oklch(var(--p)/var(--tw-border-opacity)))",
          },
        },
        dracula: {
          ...require("daisyui/src/theming/themes")["dracula"],
          primary: "#3caba2",
          "body": {
            "border-radius": "11px",
          },
          "#root": {
            "border-radius": "11px",
          },
          "#main": {
            "--gradient-dark":
              "linear-gradient(185deg, rgba(40,42,54,0.90) 2%, rgba(59,168,159,0) 24%, rgba(60,171,162,0.0) 80%, rgba(40,42,54,0.95) 95%)",
            "--bg-dark": "url(/src/assets/texture-dark.svg)",
            background: "var(--bg-dark)",
            "background-repeat": "no-repeat",
            "background-size": "cover ",
            "background-blend-mode": "multiply",
            "min-height": "100vh",
            padding: "4rem 0.5rem 0.5rem 0.5rem",
            "border-bottom-width": "1px",
            "--tw-border-opacity": "1",
            "border-bottom-color":
              "var(--fallback-p,oklch(var(--p)/var(--tw-border-opacity)))",
          },
        },
      },
    ],
  },
  plugins: [require("@tailwindcss/typography"), daisyui],
};
export default config;

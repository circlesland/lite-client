const colors = require("tailwindcss/colors");

module.exports = {
  darkMode: false,
  purge: {
    enabled: true,
    content: [
      "./../packages/**/*.svelte",
      "./../packages/**/*.ts",
      "./../packages/**/*.html",
      "./src/**/*.html",
      "./src/**/*.js",
      "./src/**/*.ts",
      "./src/**/*.jsx",
      "./public/**/*.html",
    ],
    defaultExtractor: (content) => {
      const broadMatches = content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || [];
      const broadMatchesWithoutTrailingSlash = broadMatches.map((match) =>
        _.trimEnd(match, "\\")
      );
      const matches = broadMatches.concat(broadMatchesWithoutTrailingSlash);
      return matches;
    },
    options: {
      safelist: [/data-theme$/],
    },
  },
  daisyui: {
    styled: true,
    themes: false,
    logs: false,
  },

  theme: {
    extend: {
      // colors: require("daisyui/colors"),
      colors: {
        base: "#2c2c2c",
        "base-300": "#D1D5DB",
        red: "#DC143C",
        green: "#32CD32",
        gradient1: "#003399",
        gradient2: "#0ad99c",
        circlesblue: "#08568B",
        circlesdarkblue: "#032A45",
        circleshighlightblue: "#099BB0",
        circleslightblue: "#7c96a3",
        linkgrey: "#97acbc",
        transactionpositive: "#32CD32",
        transactionnegative: "#DC143C",
        primary: "#0ad99c",
        secondary: "#003399",
        light: "#b4b4b4",
        dark: "#0D285F",
        warning: "#FF9900",
        info: "#2094F3",
        infobg: "#E8F4FE",
        error: "#F56565",
        success: "#48BB78",
        white: "#ffffff",
      },
      fontFamily: {
        circles: ["Poppins", "sans"],
        primary: ["Open Sans", "sans-serif"],
        sans: ["Open Sans", "sans-serif"],
        serif: ["Merriweather", "serif"],
      },
    },
  },
  variants: {
    backgroundClip: ["responsive"],
  },
  plugins: [require("daisyui"), require("@tailwindcss/typography")],
};

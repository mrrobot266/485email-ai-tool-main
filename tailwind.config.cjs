const config = {
  content: ["./src/**/*.{html,js,svelte,ts}"],

  theme: {
    extend: {},
    colors: {
      primary: "#18181a",
      secondary: "#6B95FB",
      white: "#ffffff",
      line: "#424141",
      dull: "#929191",
      highlight: '#3d3d3df2'
    },
    maxWidth: {
      md: "700px"
    },
    minHeight: {
      sm: "300px"
    }
  },

  plugins: []
};

module.exports = config;
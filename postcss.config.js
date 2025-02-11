const purgecss = require('@fullhuman/postcss-purgecss').default;

module.exports = {
  plugins: [
    purgecss({
      content: ['./index.html'],  // Path to your HTML files
      defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [], // Extracts class names
    }),
  ],
};

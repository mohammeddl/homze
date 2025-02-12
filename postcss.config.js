const purgecss = require('@fullhuman/postcss-purgecss').default;

module.exports = {
  plugins: [
    purgecss({
      content: ['./index.html'],  
      defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [], 
    }),
  ],
};

export default (lang = "vi") => {
  // eslint-disable-next-line
  const language = require(`./${lang}.js`).default;
  return language;
};

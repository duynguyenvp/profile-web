export default (lang) => {
    const language = require(`./${lang}.js`).default
    return language;
}
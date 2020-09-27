export default (lang = 'vi') => {
    const language = require(`./${lang}.js`).default
    return language;
}
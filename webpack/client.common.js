const FileManagerPlugin = require("filemanager-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
let htmlPageNames = ["home", "blog", "resume", "admin"];
let multipleHtmlPlugins = htmlPageNames.map(name => {
  return new HtmlWebpackPlugin({
    inject: false,
    templateContent: ({ htmlWebpackPlugin }) => {
      return `
        <html>
          <head>
            <title>${htmlWebpackPlugin.options.title}</title>
            <link
              rel="stylesheet"
              href="https://fonts.googleapis.com/css?family=Montserrat&amp;display=swap"
              defer
            />
            <link
              rel="stylesheet"
              href="/material-design-icons/material-icons.css"
              defer
            />
            <link
              rel="preload"
              href="/material-design-icons/MaterialIcons-Regular.woff2"
              type="font/woff2"
              as="font"
              crossorigin="anonymous"
              async
            />
            <link
              rel="preload"
              href="/material-design-icons/MaterialIcons-Regular.woff"
              type="font/woff2"
              as="font"
              crossorigin="anonymous"
              async
            />
            <script src="dist/lazysizes.min.js" async></script>
            <script src="dist/ls.unveilhooks.min.js" async></script>
            ${htmlWebpackPlugin.tags.headTags}
          </head>
          <body>
            <section id='app'></section>
            ${htmlWebpackPlugin.tags.bodyTags}
          </body>
        </html>
      `;
    },
    filename: `${name}.html`, // output HTML files
    chunks: [`${name}`] // respective JS files
  });
});
const entries = {
  login: [
    "@babel/polyfill",
    path.resolve(__dirname, "../Client/pages/login/index.js")
  ],
  register: [
    "@babel/polyfill",
    path.resolve(__dirname, "../Client/pages/register/index.js")
  ],
  resume: [
    "@babel/polyfill",
    path.resolve(__dirname, "../Client/pages/resume-v2/index.js")
  ],
  home: [
    "@babel/polyfill",
    path.resolve(__dirname, "../Client/pages/home/index.js")
  ],
  blog: [
    "@babel/polyfill",
    path.resolve(__dirname, "../Client/pages/blog/index.js")
  ],
  admin: [path.resolve(__dirname, "../Client/pages/admin/index.js")]
};
const fileManagerPlugin = new FileManagerPlugin({
  onStart: {
    delete: [path.resolve(__dirname, "../build/workbox*")]
  },
  onEnd: {
    copy: [
      {
        source: path.resolve(
          __dirname,
          "../Client/assets/fonts/"
        ),
        destination: path.resolve(__dirname, "../build/fonts/")
      },
      {
        source: path.resolve(__dirname, "../Client/assets/images"),
        destination: path.resolve(__dirname, "../build/dist/images")
      },
      {
        source: path.resolve(__dirname, "../Client/assets/lazysizes.min.js"),
        destination: path.resolve(__dirname, "../build/dist/lazysizes.min.js")
      },
      {
        source: path.resolve(
          __dirname,
          "../Client/assets/ls.unveilhooks.min.js"
        ),
        destination: path.resolve(
          __dirname,
          "../build/dist/ls.unveilhooks.min.js"
        )
      },
      {
        source: path.resolve(__dirname, "../Client/assets/modernizr-webp.js"),
        destination: path.resolve(__dirname, "../build/dist/modernizr-webp.js")
      }
    ]
  }
});

module.exports = {
  entries: entries,
  fileManagerPlugin: fileManagerPlugin,
  htmlWebpackPlugins: multipleHtmlPlugins
};

const FileManagerPlugin = require("filemanager-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
let htmlPageNames = ["home", "blog", "resume", "admin"];
let multipleHtmlPlugins = htmlPageNames.map(name => {
  return new HtmlWebpackPlugin({
    inject: false,
    templateContent: ({ htmlWebpackPlugin }) => `
      <html>
        <head>
          <title>${htmlWebpackPlugin.options.title}</title>
          ${htmlWebpackPlugin.tags.headTags}
        </head>
        <body>
          <section id='app'></section>
          ${htmlWebpackPlugin.tags.bodyTags}
        </body>
      </html>
    `,
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
          "../Client/assets/material-design-icons/"
        ),
        destination: path.resolve(__dirname, "../build/material-design-icons/")
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
      }
    ]
  }
});

module.exports = {
  entries: entries,
  fileManagerPlugin: fileManagerPlugin,
  htmlWebpackPlugins: multipleHtmlPlugins
};

// import webpack from 'webpack'
// import configFun from '../webpack.config.js'

// const webpackConfig = configFun();
// const compiler = webpack(webpackConfig);
import path from 'path';
import compression from 'compression'
import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import passport from 'passport'
// const https = require('https');
import session from 'cookie-session'

import { createProxyMiddleware } from 'http-proxy-middleware'
const jsonPlaceholderProxy = createProxyMiddleware({
    target: 'http://localhost:4000',
    changeOrigin: false, // for vhosted sites, changes host header to match to target's host
    logLevel: 'debug',
    pathRewrite: {
        '/admin.js' : '/admin.js',
        '^/assets' : '/assets',
    }
});

const port = 80

import resumeRoute from './routes/resume.route'
import accountRoute from './routes/account.route'
import homeRoute from './routes/home.route'
import apiRoute from './routes/api.route'
import blogRoute from './routes/blog.route'
import adminRoute from './routes/admin.route'
import errorRoute from './routes/error.route'

// import { checkAuthRoles } from './middlewares/admin.auth.middleware'

require('./passport');

const app = express()
app.locals.port = port;
// webpack hmr
// app.use(require("webpack-dev-middleware")(compiler, {
//     noInfo: true, publicPath: webpackConfig.output.publicPath
// }));

// app.use(require("webpack-hot-middleware")(compiler, {
//     log: false,
//     path: "/__what",
//     heartbeat: 2000
// }));

app.set('views', __dirname + '/views')
app.set('view engine', 'pug')
app.set('trust proxy', 1)

app.use(cookieParser());
app.use(session({
    name: 'x-auth',
    saveUninitialized: true,
    resave: true,
    keys: ['aabbccddee', 'aabbccddee123'],
    maxAge: 30 * 60 * 1000 //30 minutes
}))

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(compression())
app.use(express.static(__dirname + '/'))

app.use('/account', accountRoute)
app.use('/error', errorRoute)
app.use('/quan-tri', adminRoute)
app.use('/resume', resumeRoute)
app.use('/bai-viet/:userName?', (req, res, next) => {
    console.log(req.params.userName)
    if (req.params.userName) {
        res.locals.userName = req.params.userName
    }
    next()
}, blogRoute)
app.use('/api', apiRoute)

app.use('/', homeRoute)
app.use('/', jsonPlaceholderProxy)

// https.createServer({
//     key: fs.readFileSync(__dirname + '/server.key'),
//     cert: fs.readFileSync(__dirname + '/server.cert')
// }, app).listen(port, function () {
//     console.log(`Server is listening on port ${port}!`)
// })

app.disable('x-powered-by');

app.listen(port, () => console.log(`Server is listening on port ${port}!`))

import path from 'path';
import compression from 'compression'
import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import passport from 'passport'
// const https = require('https');
import session from 'cookie-session'
import logger from './logger'

const port = 8080

import resumeRoute from './routes/resume.route'
import accountRoute from './routes/account.route'
import homeRoute from './routes/home.route'
import apiRoute from './routes/api.route'
import blogRoute from './routes/blog.route'
import adminRoute from './routes/admin.route'
import videoRoute from './routes/video.route'
import errorRoute from './routes/error.route'

require('./passport');

const app = express()
app.locals.port = port;

app.set('views', __dirname + '/views')
app.set('view engine', 'pug')
app.set('trust proxy', 1)

app.use(cookieParser());
app.use(session({
    name: 'x-auth',
    saveUninitialized: true,
    resave: true,
    secureProxy: true,
    secure: true,
    sameSite: true,
    httpOnly: true,
    keys: ['aabbccddee', 'aabbccddee123'],
    maxAge: 90 * 60 * 1000 //90 minutes
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
app.use('/video', videoRoute)
app.use('/bai-viet/:userName?', (req, res, next) => {
    console.log(req.params.userName)
    if (req.params.userName) {
        res.locals.userName = req.params.userName
    }
    next()
}, blogRoute)
app.use('/api', apiRoute)

app.use('/', homeRoute)

// https.createServer({
//     key: fs.readFileSync(__dirname + '/server.key'),
//     cert: fs.readFileSync(__dirname + '/server.cert')
// }, app).listen(port, function () {
//     console.log(`Server is listening on port ${port}!`)
// })

app.disable('x-powered-by');

app.listen(port, () => logger.info(`Server is listening on port ${port}!`))

import express from 'express'
const router = express.Router()
import request from 'request'
import System from '../constants/System'

import { createProxyMiddleware } from 'http-proxy-middleware'
const jsonPlaceholderProxy = createProxyMiddleware({
    target: 'http://localhost:4000',
    changeOrigin: true, // for vhosted sites, changes host header to match to target's host
    logLevel: 'debug',
    pathRewrite: {
        '^/bundle.js': '/bundle.js'
    }
});


// import httpProxy from 'http-proxy'
// import HttpProxyRules from 'http-proxy-rules'
// const proxy = httpProxy.createProxyServer({})
const template = require('../views/admin.pug')

import { apiRequireAuth } from '../middlewares/auth.middleware'
import { adminRequireAuth } from '../middlewares/admin.auth.middleware'

// const proxyRules = new HttpProxyRules({
//     rules: {
//         '/bundle.js': 'http://localhost:4000/bundle.js', // Rule (1)
//         '.*/assets/': 'http://localhost:4000/assets/' // Rule (2)
//     },
//     default: 'http://localhost:4000' // default target
// });

// router.get('/*', adminRequireAuth, (req, res) => {
//     console.log('admin', new Date())
//     // res.send(template({ title: `Admin Page` }))
//     var target = proxyRules.match(req);
//     if (target) {
//         return proxy.web(req, res, {
//             target: target
//         });
//     }
// });
router.get('/*', adminRequireAuth, (req, res) => {
    console.log('admin', new Date())
    res.send(template({ title: `Admin Page` }))
});
// router.get('/*', adminRequireAuth, jsonPlaceholderProxy);

router.get('/userInfo', apiRequireAuth, (req, res) => {
    let headers = res.locals.token
    const options = {
        url: `${System.API}/User/UserInfo`,
        method: 'GET',
        headers
    };

    request(options, function (err, _res, body) {
        res.send(body)
    });
});

export default router
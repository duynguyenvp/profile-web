import express from 'express'
const router = express.Router()
import request from 'request'
import System from '../constants/System'
const template = require('../views/admin.pug')

import { apiRequireAuth } from '../middlewares/auth.middleware'
import { adminRequireAuth } from '../middlewares/admin.auth.middleware'

router.get('/*', adminRequireAuth, (req, res) => {
    res.send(template({ title: `Admin Page`, resource_version: System.RESOURCE_VERSION }))
});

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
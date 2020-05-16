import express from 'express'
const router = express.Router()
import request from 'request'
import mime from 'mime'
import fs from 'fs'
import System from '../constants/System'

import { apiRequireAuth } from '../middlewares/auth.middleware'
import { randomId } from '../../Client/utils/string-utils'

router.post('/postWithBodyAuth', apiRequireAuth, (req, res) => {
    let tokenHeaders = res.locals.token

    const formData = req.body.data
    const headers = req.body.headers
    const url = req.body.url
    const options = {
        url: `${System.API}${url}`,
        method: 'POST',
        headers: { ...headers, ...tokenHeaders },
        body: formData,
        json: true
    };

    request(options, function (err, _res, body) {
        console.log(err)
        if (err) res.send(err)
        res.send(body)
    });
});

router.post('/postWithBody', (req, res) => {
    const formData = req.body.data
    const headers = req.body.headers
    const url = req.body.url
    const options = {
        url: `${System.API}${url}`,
        method: 'POST',
        headers: { ...headers },
        body: formData,
        json: true
    };

    request(options, function (err, _res, body) {
        if (err) res.send(err)
        res.send(body)
    });
});

router.post('/postWithFormAuth', apiRequireAuth, (req, res) => {
    let tokenHeaders = res.locals.token

    const formData = req.body.data
    const headers = req.body.headers
    const url = req.body.url
    const options = {
        url: `${System.API}${url}`,
        method: 'POST',
        headers: { ...headers, ...tokenHeaders },
        form: formData
    };


    request(options, function (err, _res, body) {
        if (err) res.send(err)
        res.send(body)
    });
});


router.post('/postWithForm', (req, res) => {
    const formData = req.body.data
    const headers = req.body.headers
    const url = req.body.url
    const options = {
        url: `${System.API}${url}`,
        method: 'POST',
        headers: { ...headers },
        form: formData
    };


    request(options, function (err, _res, body) {
        if (err) res.send(err)
        res.send(body)
    });
});

router.post('/deleteWithFormAuth', apiRequireAuth, (req, res) => {
    let tokenHeaders = res.locals.token

    const formData = req.body.data
    const headers = req.body.headers
    const url = req.body.url
    const options = {
        url: `${System.API}${url}`,
        method: 'DELETE',
        headers: { ...headers, ...tokenHeaders },
        form: formData
    };
    request(options, function (err, _res, body) {
        console.log(err)
        if (err) res.send(err)
        res.send(body)
    });
});

router.post('/getWithQueryString', (req, res) => {
    const formData = req.body.data
    const headers = req.body.headers
    const url = req.body.url
    const options = {
        url: `${System.API}${url}`,
        method: 'GET',
        headers: { ...headers },
        qs: formData
    };

    request(options, function (err, _res, body) {
        if (err) res.send(err)
        res.send(body)
    });
});

router.post('/getWithQueryStringAuth', apiRequireAuth, (req, res) => {
    let tokenHeaders = res.locals.token

    const formData = req.body.data
    const headers = req.body.headers
    const url = req.body.url
    const options = {
        url: `${System.API}${url}`,
        method: 'GET',
        headers: { ...headers, ...tokenHeaders },
        qs: formData
    };

    request(options, function (err, _res, body) {
        if (err) res.send(err)
        res.send(body)
    });
});

router.post('/uploadBase64Image', apiRequireAuth, (req, res) => {
    let tokenHeaders = res.locals.token
    const headers = req.body.headers

    const matches = req.body.base64image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    const dir = './assets/images/';
    fs.access(dir, fs.constants.F_OK, (err) => {
        if (err) fs.mkdirSync(dir, { recursive: true }, (err) => {
            console.log('fs', err)
            if (err) throw err;
        });
    });

    if (matches.length !== 3) {
        return new Error('Invalid input string');
    }

    let type = matches[1];
    let extension = mime.getExtension(type);
    let fileName = `${randomId()}.${extension}`;
    try {
        fs.writeFileSync(dir + fileName, matches[2], { encoding: 'base64' });

        const path = dir.replace('.', '') + fileName

        const options = {
            url: `${System.API}/Image`,
            method: 'POST',
            headers: { ...headers, ...tokenHeaders },
            form: {
                path
            }
        };

        request(options, function (err, _res, body) {
            if (err) res.send(err)
            body = JSON.parse(body || "{}")
            const { successful = false, errorMessage = '' } = body || {}
            if (successful) {
                return res.send({ successful: true, src: path });
            } else {
                fs.unlink(dir + fileName, function (err) {
                    return res.send({ successful: false, error: errorMessage });
                });
            }
        });

    } catch (e) {
        return res.send({ successful: false, error: e.toString() });
    }
});

router.post('/uploadImageFromUrl', apiRequireAuth, (req, res) => {
    let tokenHeaders = res.locals.token
    const headers = req.body.headers
    const url = req.body.url

    const options = {
        url: `${System.API}/Image`,
        method: 'POST',
        headers: { ...headers, ...tokenHeaders },
        form: {
            path: url
        }
    };

    request(options, function (err, _res, body) {
        if (err) res.send(err)
        body = JSON.parse(body || "{}")
        const { successful = false, errorMessage = '' } = body || {}
        if (successful) {
            return res.send({ successful: true, src: url });
        } else {
            fs.unlink(dir + fileName, function (err) {
                return res.send({ successful: false, error: errorMessage });
            });
        }
    });
});

router.post('/deleteImage', apiRequireAuth, (req, res) => {
    let tokenHeaders = res.locals.token
    const imageItem = req.body
    const headers = req.body.headers
    const options = {
        url: `${System.API}/Image`,
        method: 'DELETE',
        headers: { ...headers, ...tokenHeaders },
        form: {
            id: imageItem.id
        }
    };

    request(options, function (err, _res, body) {
        if (err) res.send(err)
        body = JSON.parse(body || "{}")
        const { successful = false, errorMessage = '' } = body || {}
        if (successful) {
            if (imageItem.path.indexOf('http') == -1) {
                try {
                    fs.unlink('.' + imageItem.path, function (err) {
                        console.log(err)
                    });
                } catch (e) {
                    console.log(e)
                }
            }
            return res.send({ successful: true });
        } else {
            return res.send({ successful: false, error: errorMessage });
        }
    });
});

export default router
import express from 'express'
const router = express.Router()
import request from 'request'
import passport from 'passport'

import System from '../constants/System'
import { checkAuth } from '../middlewares/auth.middleware'
import { isSafeUrl } from '../../Client/utils/string-utils'

const templateLogin = require('../views/login.pug')
const templateRegister = require('../views/register.pug')


import React from 'react'
import ReactDOMServer from 'react-dom/server'
import Test from '../../Client/pages/login/form-login/index'
import StyleContext from 'isomorphic-style-loader/StyleContext'

router.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

router.get('/auth/google/callback',
    passport.authenticate('google'),
    (req, res) => {
        request.post({ url: `${System.API}/User/SiginOAuth`, formData: req.user }, function optionalCallback(err, httpResponse, body) {
            console.log(err)
            if (err) {
                res.send(err);
                return console.error('login failed:', err);
            }
            body = JSON.parse(body);
            if (body.successful) {
                let token = body.result.split(/\./);
                let signature = token.splice(2, 1)
    
                req.session.xAuth = token.join('.')
                req.session.yAuth = signature.join('.')
                res.redirect(302, '/')
            } else {
                if (body.errorCode >= 900) {
                    req.app.locals.signinMessage = body.errorMessage
                    res.redirect('/account/login')
                } else {
                    res.send(body)
                }
            }
        });
        // res.redirect('/');
    }
);

router.get('/login:returnUrl?', checkAuth, (req, res) => {
    const message = req.app.locals.signinMessage;
    req.app.locals.signinMessage = null;

    const css = new Set() // CSS for all rendered React components
    const insertCss = (...styles) => styles.forEach(style => css.add(style._getCss()))
    const markup = ReactDOMServer.renderToString(
        <StyleContext.Provider value={{ insertCss }}>
            <Test />
        </StyleContext.Provider>
    )

    res.send(templateLogin({
        title: `Đăng nhập`,
        styles: [...css].join(''),
        body: markup,
        context: JSON.stringify({ message: message })
    }))
});

router.get('/register:returnUrl?', checkAuth, (req, res) => {
    const message = req.app.locals.messages;
    req.app.locals.messages = null;
    res.send(templateRegister({
        title: `Register`,
        context: JSON.stringify({ message: message })
    }))
});

router.post('/signup', (req, res) => {
    const ReturnUrl = isSafeUrl(req.body.ReturnUrl) ? req.body.ReturnUrl : '/';
    let formData = {
        UserName: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Age: req.body.Age,
        Address: req.body.Address,
    };

    for (const key in formData) {
        if (formData.hasOwnProperty(key)) {
            if (!formData[key]) {
                delete formData[key]
            }
        }
    }


    if (!formData.UserName || !formData.Password) {
        res.send({ "successful": false, "message": null, "result": null, "errorCode": 800, "errorMessage": "Vui lòng nhập đầy đủ thông tin." })
        return;
    }

    request.post({ url: `${System.API}/User/Sigup`, formData: formData }, function optionalCallback(err, httpResponse, body) {
        if (err) {
            res.send(err);
            return console.error('login failed:', err);
        }
        body = JSON.parse(body);
        if (body.successful) {
            Login('User/Sigin', formData).then(response => {
                console.log(response)
                req.session.xAuth = response.xAuth
                req.session.yAuth = response.yAuth
                res.redirect(302, ReturnUrl || '/')
            }).catch(error => {
                res.send(error)
            })
        } else {
            if (body.errorCode >= 900) {
                req.app.locals.messages = body.errorMessage
                res.redirect('/account/register')
            } else {
                res.send(body)
            }
        }
    });
});

router.post('/signin', (req, res) => {
    let ReturnUrl = isSafeUrl(req.body.ReturnUrl) ? req.body.ReturnUrl : '';
    const formData = {
        UserName: req.body.Username,
        Password: req.body.Password
    };
    ReturnUrl = !ReturnUrl ? `/` : ReturnUrl
    if (!formData.UserName || !formData.Password) {
        res.send({ "successful": false, "message": null, "result": null, "errorCode": 800, "errorMessage": "Vui lòng nhập đầy đủ thông tin." })
        return;
    }

    request.post({ url: `${System.API}/User/Sigin`, formData: formData }, function optionalCallback(err, httpResponse, body) {
        if (err) {
            res.send(err);
            return console.error('login failed:', err);
        }
        body = JSON.parse(body);
        if (body.successful) {
            let token = body.result.split(/\./);
            let signature = token.splice(2, 1)

            req.session.xAuth = token.join('.')
            req.session.yAuth = signature.join('.')
            res.redirect(302, ReturnUrl)
        } else {
            if (body.errorCode >= 900) {
                req.app.locals.signinMessage = body.errorMessage
                res.redirect('/account/login')
            } else {
                res.send(body)
            }
        }
    });
});

router.post('/signout', (req, res) => {
    req.logOut()
    req.logout()
    req.session = null
    res.send({ "successful": true, "message": null, "result": null, "errorCode": null, "errorMessage": "" })
})


const Login = (url, data) => {
    return new Promise((resolve, reject) => {
        request.post({ url: `${System.API}/${url}`, formData: data }, function optionalCallback(err, httpResponse, body) {
            if (err) {
                reject(err);
                return;
            }
            body = JSON.parse(body);
            if (body.successful) {
                let token = body.result.split(/\./);
                let signature = token.splice(2, 1)
                resolve({
                    xAuth: token.join('.'),
                    yAuth: signature.join('.')
                })
            } else {
                reject(body)
            }
        });
    })
}

export default router
import express from 'express'
const router = express.Router()
import request from 'request';
const template = require('../views/blog.pug')

import React from 'react'
import ReactDOMServer from 'react-dom/server'
import StyleContext from 'isomorphic-style-loader/StyleContext'

import Blog from '../components/Blog'
import { dateToStringFormatCultureVi } from '../../Client/utils/date-utils'

import System from '../constants/System'

router.get('/:postUrl?', (req, res) => {
    console.log('blog', new Date())
    let data = null
    let options = {
        url: `${System.API}/Post/GetLastPost`,
        method: 'POST'
    };
    const userName = res.locals.userName
    res.locals.userName = null
    const { postUrl } = req.params;
    if (!postUrl && !userName) {
        data = {
            ...data,
            Username: 'duynguyen'
        }
    } else {
        if (postUrl) {
            options = {
                url: `${System.API}/Post/GetPostByPostUrl`,
                method: 'POST'
            };
            data = {
                ...data,
                PostUrl: postUrl
            }
        }
        if (userName) {
            data = {
                ...data,
                Username: userName
            }
        }
    }
    options = { ...options, form: data }
    request(options, function (err, _res, body) {
        const css = new Set() // CSS for all rendered React components
        const insertCss = (...styles) => styles.forEach(style => css.add(style._getCss()))
        let markup = ReactDOMServer.renderToString(
            <StyleContext.Provider value={{ insertCss }}>
                <Blog />
            </StyleContext.Provider>
        )
        let initdata = {}
        let pageTitle = `Blog`
        let pageUrl = `http://somethingaboutme.info`
        try {
            body = JSON.parse(body || "{}")
            const { result = {}, successful = false } = body || {}
            if (successful) {
                let postData = {}
                if (result) {
                    postData = result.postData
                    initdata = result
                }
                let data = {
                    content: '',
                    title: '',
                    postTime: ''
                }
                data = { ...data, ...postData }
                pageTitle = data.title || ''
                pageUrl += data.postUrl || ''
                markup = markup.replace('{content}', data.content || '')
                    .replace('{title}', data.title || '')
                    .replace('{postTime}', dateToStringFormatCultureVi(data.postTime))
            }
        } catch (error) {
            console.log(error)
        }
        res.send(template({
            initdata: JSON.stringify(initdata),
            main: markup,
            styles: [...css].join(''),
            title: pageTitle,
            ogTitle: pageTitle,
            ogDescription: pageTitle,
            ogUrl: pageUrl,
            ogImageAlt: pageTitle
        }))
    });

});

export default router
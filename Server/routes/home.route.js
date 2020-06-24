import express from 'express'
const router = express.Router()
const template = require('../views/index.pug')

import React from 'react'
import ReactDOMServer from 'react-dom/server'
import HomePage from '../components/Home'
import StyleContext from 'isomorphic-style-loader/StyleContext'
import System from '../constants/System'
import assets from '../views/assets.json'

router.get('/', (req, res) => {
    const css = new Set() // CSS for all rendered React components
    const insertCss = (...styles) => styles.forEach(style => css.add(style._getCss()))
    const markup = ReactDOMServer.renderToString(
        <StyleContext.Provider value={{ insertCss }}>
            <HomePage />
        </StyleContext.Provider>
    )
    res.send(template({
        message: markup,
        styles: [...css].join(''),
        title: `Trang chủ`,
        scripts: assets.entryPoints.home.js.map(item => {
            return `/dist/${item}?v=${System.RESOURCE_VERSION}`
        }),
        resource_version: System.RESOURCE_VERSION
    }))
});

router.get('/home', (req, res) => {
    const css = new Set() // CSS for all rendered React components
    const insertCss = (...styles) => styles.forEach(style => css.add(style._getCss()))
    const markup = ReactDOMServer.renderToString(
        <StyleContext.Provider value={{ insertCss }}>
            <HomePage />
        </StyleContext.Provider>
    )
    res.send(template({
        message: markup,
        styles: [...css].join(''),
        title: `Trang chủ`,
        resource_version: System.RESOURCE_VERSION
    }))
});

export default router
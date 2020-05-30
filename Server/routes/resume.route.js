import express from 'express'
const router = express.Router()

const template = require('../views/portfolio.pug')

import React from 'react'
import ReactDOMServer from 'react-dom/server'
import StyleContext from 'isomorphic-style-loader/StyleContext'

import Resume from '../../Client/pages/portfolio/Resume'
import ResumePrint from '../../Client/pages/portfolio/ResumePrint'
import puppeteer from 'puppeteer'
import System from '../constants/System'

router.get('/view/:userId?', (req, res) => {
    const css = new Set() // CSS for all rendered React components
    const insertCss = (...styles) => styles.forEach(style => css.add(style._getCss()))
    const markup = ReactDOMServer.renderToString(
        <StyleContext.Provider value={{ insertCss }}>
            <Resume />
        </StyleContext.Provider>
    )

    res.send(template({
        message: markup,
        styles: [...css].join(''),
        title: `Resume`,
        initPrint: false,
        resource_version: System.RESOURCE_VERSION
    }))
});

router.get('/print/:userId?', (req, res) => {
    const css = new Set() // CSS for all rendered React components
    const insertCss = (...styles) => styles.forEach(style => css.add(style._getCss()))
    const markup = ReactDOMServer.renderToString(
        <StyleContext.Provider value={{ insertCss }}>
            <ResumePrint />
        </StyleContext.Provider>
    )

    res.send(template({
        body: markup,
        styles: [...css].join('') + 'html, body { height: unset !important;}',
        title: `Resume`,
        initPrint: true,
        resource_version: System.RESOURCE_VERSION
    }))
});

async function printPDF(url) {
    const browser = await puppeteer.launch({
        headless: true
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });
    const pdf = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: { left: '1.5cm', top: '1.5cm', right: '1.5cm', bottom: '1.5cm' }
    });
    await browser.close();
    return pdf
}

router.post('/getprint', (req, res) => {
    const url = req.body.url
    const uri = `${req.protocol}://${req.hostname}:${req.app.locals.port}${url}`
    printPDF(uri).then(pdf => {
        res.set({ 'Content-Type': 'application/pdf', 'Content-Length': pdf.length })
        res.send(pdf)
    })
});

export default router
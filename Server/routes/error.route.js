import express from 'express'
const router = express.Router()
const template = require('../views/error.pug')

router.get('/', (req, res) => {
    const message = req.app.locals.messages;
    req.app.locals.messages = null;
    res.send(template({ message: message, title: `Portfolio` }))
});

export default router
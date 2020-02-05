import request from 'request';
import System from '../constants/System'
export const apiRequireAuth = (req, res, next) => {
    if (req.session.xAuth && req.session.yAuth) {
        res.locals.token = { Authorization: `${req.session.xAuth}.${req.session.yAuth}` }
    }
    next()
}

export const checkAuth = (req, res, next) => {
    if (req.session.xAuth && req.session.yAuth) {
        const user = req.session.user;
        if (user && user.username) {
            res.redirect(302, `/${user.username}/`)
        } else {
            const Authorization = `${req.session.xAuth}.${req.session.yAuth}`
            const options = {
                url: `${System.API}/User/UserInfo`,
                method: 'GET',
                headers: {
                    Authorization
                }
            };

            request(options, function (err, _res, body) {
                body = JSON.parse(body)
                if (body.successful) {
                    if (body && body.result && body.result.username) {
                        req.session.user = body.result
                        res.redirect(302, `/${body.result.username}/`)
                    } else {
                        req.app.locals.messages = "Bạn không có quyền truy cập"
                        res.redirect('/error')
                    }
                } else {
                    req.app.locals.messages = body.errorMessage
                    res.redirect('/error')
                }
            });
        }
    } else {
        next()
    }
}

export const checkAuthBlog = (req, res, next) => {
    if (req.session.xAuth && req.session.yAuth) {
        const user = req.session.user;
        if (user && user.username) {
            res.redirect(302, `/${user.username}/bai-viet/`)
        } else {
            const Authorization = `${req.session.xAuth}.${req.session.yAuth}`
            const options = {
                url: `${System.API}/User/UserInfo`,
                method: 'GET',
                headers: {
                    Authorization
                }
            };

            request(options, function (err, _res, body) {
                body = JSON.parse(body)
                if (body.successful) {
                    if (body && body.result && body.result.username) {
                        req.session.user = body.result
                        res.redirect(302, `/${body.result.username}/bai-viet/`)
                    } else {
                        req.app.locals.messages = "Bạn không có quyền truy cập"
                        res.redirect('/error')
                    }
                } else {
                    req.app.locals.messages = body.errorMessage
                    res.redirect('/error')
                }
            });
        }
    } else {
        next()
    }
}
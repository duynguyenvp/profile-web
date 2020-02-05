import request from 'request';
import System from '../constants/System'

export const checkAuthRoles = (req, res, next) => {
    if (req.session.xAuth && req.session.yAuth) {
        const Authorization = `${req.session.xAuth}.${req.session.yAuth}`
        const options = {
            url: `${System.API}/User/UserGetRoles`,
            method: 'GET',
            headers: {
                Authorization
            }
        };
        
        const userRoleService = req.session.userRoleService;
        if (userRoleService) {
            const isAdmin = userRoleService.userRoles.find(f => f.roleName == 'admin')
            if (isAdmin) {
                next()
                return
            }
            req.app.locals.messages = "Bạn không có quyền truy cập"
            res.redirect('/error')
        }

        request(options, function (err, _res, body) {
            body = JSON.parse(body)
            if (body.successful) {
                const roles = body.result
                const isAdmin = roles.userRoles.find(f => f.roleName == 'admin')
                if (isAdmin) {
                    req.session.userRoleService = roles
                    next()
                    return
                }
                req.app.locals.messages = "Bạn không có quyền truy cập"
                res.redirect('/error')
            } else {
                req.app.locals.messages = body.errorMessage
                res.redirect('/error')
            }
        });
    } else {
        const returnUrl = `${req.protocol}://${req.get('Host')}/quan-tri`
        // req.app.locals.messages = "Vui lòng đăng nhập trước"
        res.redirect(`/account/login?returnUrl=${returnUrl}`)
    }
}

export const adminRequireAuth = (req, res, next) => {
    if (req.session.xAuth && req.session.yAuth) {
        next()
    } else {
        const returnUrl = `${req.protocol}://${req.get('Host')}/quan-tri`
        // req.app.locals.messages = "Vui lòng đăng nhập trước"
        res.redirect(`/account/login?returnUrl=${returnUrl}`)
    }
}
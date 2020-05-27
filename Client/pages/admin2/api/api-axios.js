import axios from 'axios'
import qs from 'qs'
// import tokenService from '../user/services/token.js'
import {isAbsoluteUrl} from '../utils/string-utils.js'
import {DOMAIN_API} from '../configs/env.js'

export const create = (options) => {
    let opts = {};

    if (options.baseURL && !isAbsoluteUrl(options.baseURL)) {
        opts.baseURL = `${DOMAIN_API}${options.baseURL}`
    }

    let instance = axios.create(Object.assign({}, options, opts));

    instance.interceptors.request.use(function (config) {
        const {method, data, header} = config;
        if (method == 'post' && typeof data == 'object') {
            let nextHeader = Object.assign({}, header, {
                'content-type': 'application/x-www-form-urlencoded'
            })
            let nextData = qs.stringify(data);

            return Object.assign({}, config, {
                header: nextHeader,
                data: nextData
            })
        }
        return config;
    });

    instance.interceptors.response.use(function (response) {
        return response.data;
    }, function (error) {
        console.log(error)
        if (error.response.status == 401) {
            // tokenService.expireToken();
        }
    });

    // instance.defaults.headers.common['Authorization'] = tokenService.getToken();

    // tokenService.onChange(() => {
    //     instance.defaults.headers.common['Authorization'] = tokenService.getToken();
    // })

    return instance;
}


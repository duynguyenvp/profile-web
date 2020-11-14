import axios from "axios";
import qs from "qs";
// import tokenService from '../user/services/token.js'
import { isAbsoluteUrl } from "../utils/string-utils.js";
import { DOMAIN_API } from "../configs/env.js";

export const create = (options) => {
  const opts = {};

  if (options.baseURL && !isAbsoluteUrl(options.baseURL)) {
    opts.baseURL = `${DOMAIN_API}${options.baseURL}`;
  }

  const instance = axios.create(Object.assign({}, options, opts));

  instance.interceptors.request.use((config) => {
    const { method, data, header } = config;
    if (method === "post" && typeof data === "object") {
      const nextHeader = Object.assign({}, header, {
        "content-type": "application/x-www-form-urlencoded"
      });
      const nextData = qs.stringify(data);

      return Object.assign({}, config, {
        header: nextHeader,
        data: nextData
      });
    }
    return config;
  });

  instance.interceptors.response.use(response => response.data, (error) => {
    console.error(error);
    if (error.response.status === 401) {
      // tokenService.expireToken();
    }
  });

  // instance.defaults.headers.common['Authorization'] = tokenService.getToken();

  // tokenService.onChange(() => {
  //     instance.defaults.headers.common['Authorization'] = tokenService.getToken();
  // })

  return instance;
};

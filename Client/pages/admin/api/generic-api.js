import { create } from './api-axios.js'

const getApiInstance = (baseURL = '/api') => {
    const ajax = create({ baseURL });

    const postWithBodyAuth = (args) => {
        return ajax.post(`/postWithBodyAuth`, args)
    }
    
    const postWithBody = (args) => {
        return ajax.post(`/postWithBody`, args)
    }
    
    const postWithFormAuth = (args) => {
        return ajax.post(`/postWithFormAuth`, args)
    }
    
    const postWithForm = (args) => {
        return ajax.post(`/postWithForm`, args)
    }
    
    const deleteWithFormAuth = (args) => {
        return ajax.post(`/deleteWithFormAuth`, args)
    }
    
    const getWithQueryString = (args) => {
        return ajax.post(`/getWithQueryString`, args)
    }
    
    const getWithQueryStringAuth = (args) => {
        return ajax.post(`/getWithQueryStringAuth`, args)
    }
    
    const signout = (args) => {
        return ajax.post(`/signout`, args)
    }
    
    const getPrint = (args, config) => {
        return ajax.post(``, args, config)
    }
    
    const uploadBase64Image = (args) => {
        return ajax.post(`/uploadBase64Image`, args)
    }
    const uploadImageFromUrl = (args) => {
        return ajax.post(`/uploadImageFromUrl`, args)
    }
    const deleteImage = (args) => {
        return ajax.post(`/deleteImage`, args)
    }

    return {
        signout,
        postWithBodyAuth,
        postWithBody,
        postWithFormAuth,
        postWithForm,
        deleteWithFormAuth,
        getWithQueryString,
        getWithQueryStringAuth,
        getPrint,
        uploadBase64Image,
        uploadImageFromUrl,
        deleteImage
    }
}

export default getApiInstance;
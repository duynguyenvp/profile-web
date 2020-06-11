import React, { useEffect } from 'react';
import AppLayout from './layouts/AppLayout';
import { setAuthentication, getAuthentication } from './store/authStore';
import getApiInstance from './api/generic-api';

export default function App() {
    useEffect(() => {
        loadUser()
    }, [])
    const loadUser = () => {
        getApiInstance().getWithQueryStringAuth({
            url: '/User/UserInfo'
        }).then(res => {
            if (res.successful) {
                setAuthentication(res.result)
                loadRoles()
            }
        }).catch(err => {
            console.error(err)
        })
    }
    const loadRoles = () => {
        getApiInstance().getWithQueryStringAuth({
            url: '/User/UserGetRoles'
        }).then(res => {
            if (res && res.successful) {
                const roles = res.result
                setAuthentication({ ...getAuthentication(), ...roles })
            }
        }).catch(err => {
            console.error(err)
        })
    }
    return (
        <AppLayout />
    );
}
import SecondZone from './second-zone'
import App from '../home/App'
import getApiInstance from '../../ajax/generic-api'

import React, { useEffect, useState } from 'react';

const Home = () => {
    const [state, setState] = useState({})
    const loadData = (Username) => {
        let options = {
            url: '/Portfolio/ForHomePage'
        }
        if (Username) {
            options = {
                ...options,
                data: {
                    Username
                }
            }
        }
        getApiInstance().getWithQueryString(options).then(res => {
            const { successful, result } = res
            if (successful) {
                if (result && result.length) {
                    setState({ ...result[0] })
                }
            }
        }).catch(error => {
            console.error(error)
        })
    }
    useEffect(() => {
        let pathname = window.location.pathname
        pathname = pathname.split(/\//)

        let Username = pathname[pathname.length - 1]
        if (Username && Username != 'resume' && Username != 'print') {
            loadData(Username)
        } else {
            loadData()
        }
    }, [])
    return <App>
        <SecondZone {...state} />
    </App>
}
export default Home
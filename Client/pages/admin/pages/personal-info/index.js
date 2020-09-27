import React, { Fragment, useState, useEffect } from 'react'
import { Card, Button, notification, Result } from 'antd';

import PersonalInfoBlock from './info-block/personalInfo';
import getApiInstance from '../../api/generic-api';
import { getAuthentication } from '../../store/authStore';
import { LoadingOutlined } from '@ant-design/icons';

const cardAttribute = {
    bordered: false,
    headStyle: { textTransform: "uppercase", fontWeight: "bold" },
}
const Home = props => {
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
    const [personalInfo, setPersonalInfo] = useState(null)
    const auth = getAuthentication()

    useEffect(() => {
        loadData()
    }, [auth])

    const loadData = () => {
        getApiInstance().getWithQueryStringAuth({
            url: '/User/UserInfo'
        }).then(res => {
            const { successful, result } = res
            let _isLoading = false
            let _error = ''
            if (successful) {
                setPersonalInfo(result)
            } else {
                _error = 'Đã xảy ra lỗi khi tải dữ liệu.'
            }
            setIsLoading(_isLoading)
            setError(_error)
        }).catch(error => {
            setIsLoading(false)
            setError(error)
            console.error(error)
        })
    }

    if (isLoading) return <Result
        icon={<LoadingOutlined />}
        title="Đang xử lý thông tin, vui lòng chờ ...!"
    />

    if (error) return <Result
        status="500"
        title="500"
        subTitle={error}
    />

    return (
        <Fragment>
            <Card title="Thông tin cơ bản" {...cardAttribute} >
                <PersonalInfoBlock personalInfo={personalInfo} />
            </Card>

        </Fragment>
    )
}

export default Home;
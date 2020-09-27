import React, { Fragment, useState, useEffect } from 'react'
import { Card, Button, notification, Result } from 'antd';
import { PlusCircleFilled, LoadingOutlined } from '@ant-design/icons';

import PersonalInfoBlock from './info-block/personalInfo';
import EducationInfoBlock from './info-block/education'
import ExperienceInfoBlock from './info-block/experience';
import SkillInfoBlock from './info-block/skill';

import getApiInstance from '../../api/generic-api';
import { getAuthentication } from '../../store/authStore';

const openNotificationWithIcon = (type, content) => {
    notification[type]({
        message: 'Thông báo',
        description: content,
    })
}

const cardAttribute = {
    bordered: false,
    headStyle: { textTransform: "uppercase", fontWeight: "bold" },
}
const Home = props => {
    const [isLoading, setIsLoading] = useState(true)
    const [isEmpty, setIsEmpty] = useState(false)
    const [error, setError] = useState('')
    const [portfolioId, setPortfolioId] = useState(null)
    const [educations, setEducations] = useState(null)
    const [experiences, setExperiences] = useState(null)
    const [skills, setSkills] = useState(null)
    const [personalInfo, setPersonalInfo] = useState(null)
    const auth = getAuthentication()

    useEffect(() => {
        loadData()
    }, [auth])

    const loadData = () => {
        getApiInstance().getWithQueryStringAuth({
            url: '/Portfolio/GetAll'
        }).then(res => {
            const { successful, result } = res
            let _isLoading = false
            let _isEmpty = false
            let _error = ''
            if (successful) {
                if (result && result.length) {
                    const { id, portfolioEducations, portfolioExperiences, portfolioSkills, portfolioUser } = result[0]
                    setPortfolioId(id)
                    setPersonalInfo(portfolioUser)
                    setEducations(portfolioEducations)
                    setExperiences(portfolioExperiences)
                    setSkills(portfolioSkills)
                } else {
                    _isEmpty = true
                }
            } else {
                _error = 'Đã xảy ra lỗi khi tải dữ liệu.'
            }
            setIsLoading(_isLoading)
            setIsEmpty(_isEmpty)
            setError(_error)
        }).catch(error => {
            setIsLoading(false)
            setError(error)
            console.error(error)
        })
    }

    const handleInsertNewSkill = () => {
        const auth = getAuthentication()
        const data = {
            id: portfolioId,
            userId: auth.id,
            portfolioSkills: [{
                skillName: "",
                level: 1,
                detail: ""
            }]
        }

        getApiInstance().postWithBodyAuth({
            url: '/Portfolio/InsertOrUpdateSkills',
            data
        }).then(res => {
            const { successful, errorMessage, result } = res
            if (successful) {
                setSkills([...skills, ...result])
            } else {
                openNotificationWithIcon('error', 'Lỗi: ' + (errorMessage || 'Không xác định') + '.')
            }
        }).catch(error => {
            openNotificationWithIcon('error', 'Đã xảy ra lỗi. ' + error)
            console.error(error)
        })
    }
    const handleSaveSkill = (skill) => {
        let isExisted = false
        const nextSkills = skills.map(item => {
            if (item.id === skill.id) {
                isExisted = true
                return skill
            }
            return item
        })
        if (!isExisted) {
            nextSkills = [...nextSkills, skill]
        }
        const auth = getAuthentication()
        const data = {
            id: portfolioId,
            userId: auth.id,
            portfolioSkills: nextSkills || []
        }

        getApiInstance().postWithBodyAuth({
            url: '/Portfolio/InsertOrUpdateSkills',
            data
        }).then(res => {
            const { successful, errorMessage, result } = res
            if (successful) {
                openNotificationWithIcon('success', 'Lưu thành công!!!')
                setSkills(nextSkills)
            } else {
                openNotificationWithIcon('error', 'Lỗi: ' + (errorMessage || 'Không xác định') + '.')
            }
        }).catch(error => {
            openNotificationWithIcon('error', 'Đã xảy ra lỗi. ' + error)
            console.error(error)
        })
    }
    const handleRemoveSkill = item => {
        getApiInstance().deleteWithFormAuth({
            url: '/Portfolio/DeleteSkill',
            data: {
                Id: portfolioId,
                ObjectId: item.id,
            }
        }).then(res => {
            const { successful, errorMessage, result } = res
            if (successful) {
                let newSkills = skills.filter(f => f.id != item.id)
                setSkills(newSkills)
                openNotificationWithIcon('success', 'Thành công!!!')
            } else {
                openNotificationWithIcon('error', 'Lỗi: ' + (errorMessage || 'Không xác định') + '.')
            }
        }).catch(error => {
            openNotificationWithIcon('error', 'Lỗi khi xóa: ' + error)
            console.error(error)
        })
    }

    const handleInsertEducation = () => {
        const auth = getAuthentication()
        const data = {
            id: portfolioId,
            userId: auth.id,
            portfolioEducations: [{
                schoolName: "",
                specialized: "",
                startDate: new Date(),
                isStillHere: false,
                endDate: new Date(),
                detail: "",
            }]
        }

        getApiInstance().postWithBodyAuth({
            url: '/Portfolio/InsertOrUpdateEducations',
            data
        }).then(res => {
            const { successful, errorMessage, result } = res
            if (successful) {
                setEducations([...educations, ...result])
            } else {
                openNotificationWithIcon('error', 'Lỗi: ' + (errorMessage || 'Không xác định') + '.')
            }
        }).catch(error => {
            openNotificationWithIcon('error', 'Đã xảy ra lỗi. ' + error)
            console.error(error)
        })
    }
    const handleRemoveEducation = item => {
        getApiInstance().deleteWithFormAuth({
            url: '/Portfolio/DeleteEducation',
            data: {
                Id: portfolioId,
                ObjectId: item.id,
            }
        }).then(res => {
            const { successful, errorMessage, result } = res
            if (successful) {
                let newEducations = educations.filter(f => f.id != item.id)
                setEducations(newEducations)
                openNotificationWithIcon('success', 'Thành công!!!')
            } else {
                openNotificationWithIcon('error', 'Lỗi: ' + (errorMessage || 'Không xác định') + '.')
            }
        }).catch(error => {
            openNotificationWithIcon('error', 'Đã xảy ra lỗi. ' + error)
            console.error(error)
        })
    }
    const handleSave = education => {
        let isExisted = false
        const nextEducations = educations.map(item => {
            if (item.id === education.id) {
                isExisted = true
                return education
            }
            return item
        })
        if (!isExisted) {
            nextEducations = [...nextEducations, education]
        }
        const auth = getAuthentication()
        const data = {
            id: portfolioId,
            userId: auth.id,
            portfolioEducations: nextEducations || []
        }

        getApiInstance().postWithBodyAuth({
            url: '/Portfolio/InsertOrUpdateEducations',
            data
        }).then(res => {
            const { successful, errorMessage, result } = res
            if (successful) {
                openNotificationWithIcon('success', 'Thành công!!!')
                setEducations(nextEducations)
            } else {
                openNotificationWithIcon('error', 'Lỗi: ' + (errorMessage || 'Không xác định') + '.')
            }
        }).catch(error => {
            openNotificationWithIcon('error', 'Đã xảy ra lỗi. ' + error)
            console.error(error)
        })
    }

    const handleInsertNewExperience = () => {
        const auth = getAuthentication()
        const data = {
            id: portfolioId,
            userId: auth.id,
            portfolioExperiences: [{
                company: "",
                position: "",
                startDate: new Date(),
                isStillHere: false,
                endDate: new Date(),
                detail: "",
                image: "",
                url: ""
            }]
        }

        getApiInstance().postWithBodyAuth({
            url: '/Portfolio/UpdateExperiences',
            data
        }).then(res => {
            const { successful, errorMessage, result } = res
            if (successful) {
                setExperiences([...experiences, ...result])
            } else {
                openNotificationWithIcon('error', 'Lỗi: ' + (errorMessage || 'Không xác định') + '.')
            }
        }).catch(error => {
            openNotificationWithIcon('error', 'Đã xảy ra lỗi. ' + error)
            console.error(error)
        })
    }
    const handleRemoveExperience = item => {
        getApiInstance().deleteWithFormAuth({
            url: '/Portfolio/DeleteExperience',
            data: {
                Id: portfolioId,
                ObjectId: item.id,
            }
        }).then(res => {
            const { successful, errorMessage, result } = res
            if (successful) {
                let newExperiences = experiences.filter(f => f.id != item.id)
                setExperiences(newExperiences)
                openNotificationWithIcon('success', 'Xóa thành công!!!')
            } else {
                openNotificationWithIcon('error', 'Lỗi: ' + (errorMessage || 'Không xác định') + '.')
            }
        }).catch(error => {
            openNotificationWithIcon('error', 'Đã xảy ra lỗi. ' + error)
            console.error(error)
        })
    }
    const handleSaveExperience = experience => {
        let isExisted = false
        const nextExperiences = experiences.map(item => {
            if (item.id === experience.id) {
                isExisted = true
                return experience
            }
            return item
        })
        if (!isExisted) {
            nextExperiences = [...nextExperiences, experience]
        }
        const auth = getAuthentication()
        const data = {
            id: portfolioId,
            userId: auth.id,
            portfolioExperiences: nextExperiences || []
        }

        getApiInstance().postWithBodyAuth({
            url: '/Portfolio/UpdateExperiences',
            data
        }).then(res => {
            const { successful, errorMessage, result } = res
            if (successful) {
                openNotificationWithIcon('success', 'Lưu thành công!!!')
                setExperiences(nextExperiences)
            } else {
                openNotificationWithIcon('error', 'Lỗi: ' + (errorMessage || 'Không xác định') + '.')
            }
        }).catch(error => {
            openNotificationWithIcon('error', 'Đã xảy ra lỗi. ' + error)
            console.error(error)
        })
    }

    const createPortfolio = () => {
        const auth = getAuthentication()
        getApiInstance().postWithBodyAuth({
            url: '/Portfolio/Insert',
            data: {
                UserId: auth.id
            }
        }).then(res => {
            const { successful } = res
            if (successful) {
                openNotificationWithIcon('success', 'Lưu thành công!!!')
                loadData()
            } else {
                openNotificationWithIcon('error', 'Lỗi: ' + (errorMessage || 'Không xác định') + '.')
                setError(error || 'Tạo resume lỗi: Không xác định')
            }
        }).catch(error => {
            openNotificationWithIcon('error', 'Lỗi: ' + (error || 'Không xác định') + '.')
            console.error(error)
            setError(error || 'Tạo resume lỗi: Không xác định')
        })
    }

    if (isLoading) return <Result
        icon={<LoadingOutlined />}
        title="Đang xử lý thông tin, vui lòng chờ ...!"
    />
    if (isEmpty) return <Result
        title="Your operation has been executed"
        extra={
            <Button type="primary" onClick={createPortfolio}>
                <span>Tạo resume ngay</span>
            </Button>
        }
    />
    if (error) return <Result
        status="500"
        title="500"
        subTitle={error}
    />

    return (
        <Fragment>
            <Card title="Thông tin cá nhân" {...cardAttribute} >
                <PersonalInfoBlock personalInfo={personalInfo} />
            </Card>
            <Card title="Quá trình học tập" {...cardAttribute} >
                {
                    educations && educations.map((item, index) => <EducationInfoBlock
                        key={index}
                        education={item}
                        portfolioId={portfolioId}
                        handleRemoveEducation={handleRemoveEducation}
                        handleSave={handleSave} />)
                }
                <Button type="primary"
                    shape="round"
                    style={{ margin: " 16px 0" }}
                    icon={<PlusCircleFilled />}
                    onClick={handleInsertEducation}>
                    {"Thêm mới"}
                </Button>
            </Card>
            <Card title="Kinh nghiệm làm việc" {...cardAttribute} >
                {
                    experiences && experiences.map((item, index) => <ExperienceInfoBlock
                        key={index}
                        experience={item}
                        portfolioId={portfolioId}
                        handleRemoveExperience={handleRemoveExperience}
                        handleSaveExperience={handleSaveExperience} />)
                }
                <Button type="primary"
                    shape="round"
                    style={{ margin: " 16px 0" }}
                    icon={<PlusCircleFilled />}
                    onClick={handleInsertNewExperience}>
                    {"Thêm mới"}
                </Button>
            </Card>
            <Card title="Kỹ năng" {...cardAttribute} >
                {
                    skills && skills.map((item, index) => <SkillInfoBlock
                        key={index}
                        handleSaveSkill={handleSaveSkill}
                        handleRemoveSkill={handleRemoveSkill}
                        skill={item}
                        portfolioId={portfolioId} />)
                }
                <Button type="primary"
                    shape="round"
                    style={{ margin: " 16px 0" }}
                    icon={<PlusCircleFilled />}
                    onClick={handleInsertNewSkill}>
                    {"Thêm mới"}
                </Button>
            </Card>
        </Fragment>
    )
}

export default Home;
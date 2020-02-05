import './style.scss'
import React, { Fragment } from 'react';
import { RComponent } from '../../../common/r-component'
import Skill from './skill';
import Experiences from './experiences';
import Educations from './education';

import getApiInstance from '../../../ajax/generic-api'
import User from './user';
import { getState } from '../../../services/userService';
import { addAlert } from '../../../services/alertService';

class Portfolio extends RComponent {
    constructor(props) {
        super(props);

        this.state = {
            description: "",
            positionTitle: "",
            portfolioEducations: [],
            portfolioExperiences: [],
            portfolioSkills: [],
            portfolioUser: {},
            isLoading: true,
        }

        this.onMount(() => {
            this.loadData()
        })
    }

    loadData = () => {
        getApiInstance().getWithQueryStringAuth({
            url: '/Portfolio/GetAll'
        }).then(res => {
            const { successful, result } = res
            let nextState = {
                isLoading: false
            }
            if (successful) {
                if (result && result.length) {
                    nextState = { ...nextState, ...result[0], isEmpty: false, error: '' }
                } else {
                    nextState = { ...nextState, isEmpty: true, error: '' }
                }
            } else {
                nextState = { ...nextState, isEmpty: false, error: 'Đã xảy ra lỗi khi tải dữ liệu.' }
            }
            this.setState(nextState)
        }).catch(error => {
            let nextState = {
                isLoading: false,
                error
            }
            this.setState(nextState)
            console.error(error)
        })
    }

    createPortfolio = () => {
        const user = getState()
        const self = this
        getApiInstance().postWithBodyAuth({
            url: '/Portfolio/Insert',
            data: {
                UserId: user.id
            }
        }).then(res => {
            console.log(res)
            const { successful } = res
            if (successful) {
                addAlert({ type: 'success', message: 'Lưu thành công!!!' })
                self.loadData()
            } else {
                addAlert({ type: 'error', message: 'Lỗi: ' + (errorMessage || 'Không xác định') + '.' })
                self.setState({ error: (errorMessage || 'Không xác định') })
            }
        }).catch(error => {
            addAlert({ type: 'error', message: 'Lỗi: ' + (error || 'Không xác định') + '.' })
            self.setState({ error: (error || 'Không xác định') })
            console.error(error)
        })
    }

    render() {
        const { portfolioExperiences: experiences, id: portfolioId, portfolioSkills, portfolioEducations, portfolioUser, isEmpty, isLoading, error } = this.state
        if (isLoading) return <h1>Loading ...</h1>
        if (isEmpty) return <button className="btn-add-new" style={{ alignSelf: 'center' }} onClick={this.createPortfolio}>Tạo resume ngay</button>
        if (error)
            return <h1>{error}</h1>
        else
            return (
                <Fragment>
                    <div className="skill">
                        <User portfolioId={portfolioId}
                            callback={portfolioUser => { this.setState({ portfolioUser }) }}
                            portfolioUser={portfolioUser} />
                    </div>
                    <div className="skill">
                        <Skill portfolioId={portfolioId}
                            callback={skills => { this.setState({ portfolioSkills: skills }) }}
                            skills={portfolioSkills} />
                    </div>
                    <div className="skill">
                        <Experiences experiences={experiences}
                            portfolioId={portfolioId}
                            callback={experiences => { this.setState({ portfolioExperiences: experiences }) }} />
                    </div>
                    <div className="skill">
                        <Educations educations={portfolioEducations}
                            portfolioId={portfolioId}
                            callback={educations => { this.setState({ portfolioEducations: educations }) }} />
                    </div>
                </Fragment>
            );
    }
}
export default Portfolio;
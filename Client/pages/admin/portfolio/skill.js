import React, { Component } from 'react';
import { randomId } from '../../../utils/string-utils'
import InputRange from '../../../common/form-controls/input-range';
import PropTypes from 'prop-types'
import getApiInstance from '../../../ajax/generic-api'
import { addAlert } from '../../../services/alertService'
import { getState } from '../../../services/userService'

class Skill extends Component {
    static propTypes = {
        skills: PropTypes.array,
        callback: PropTypes.func
    }
    static defaultProps = {
        skills: [],
        callback: () => { }
    }
    constructor(props) {
        super(props);
        this.state = {
            skills: props.skills
        }
    }

    static getDerivedStateFromProps(props, state) {
        if (JSON.stringify(props.skills) !== JSON.stringify(state.skills)) {
            const { skills } = props
            return { skills }
        }
        return null;
    }

    componentDidUpdate(prevProps) {
        if (JSON.stringify(this.props.skills) !== JSON.stringify(prevProps.skills)) {
            const { skills } = this.props
            this.setState({ skills });
        }
    }

    handleChange = item => {
        const { skills } = this.state
        let newSkills = skills.map(skill => {
            if (item.id == skill.id) {
                return item
            }
            return skill
        })
        this.props.callback(newSkills)
    }
    handleInsertNewItem = () => {
        const { skills } = this.state
        const { portfolioId } = this.props
        const user = getState()
        const data = {
            id: portfolioId,
            userId: user.id,
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
                this.props.callback([...skills, ...result])
            } else {
                addAlert({ type: 'error', message: 'Lỗi: ' + (errorMessage || 'Không xác định') + '.' })
            }
        }).catch(error => {
            addAlert({ type: 'error', message: 'Đã xảy ra lỗi. ' + error })
            console.error(error)
        })
    }

    handleRemove = item => {
        const { portfolioId } = this.props

        getApiInstance().deleteWithFormAuth({
            url: '/Portfolio/DeleteSkill',
            data: {
                Id: portfolioId,
                ObjectId: item.id,
            }
        }).then(res => {
            const { successful, errorMessage, result } = res
            if (successful) {
                const { skills } = this.state
                let newSkills = skills.filter(f => f.id != item.id)
                this.props.callback(newSkills)
                addAlert({ type: 'success', message: 'Thành công!!!' })
            } else {
                addAlert({ type: 'error', message: 'Lỗi: ' + (errorMessage || 'Không xác định') + '.' })
            }
        }).catch(error => {
            addAlert({ type: 'error', message: 'Lỗi khi xóa: ' + error })
            console.error(error)
        })
    }

    handleSave = () => {
        const { skills } = this.state
        const { portfolioId } = this.props
        const user = getState()
        const data = {
            id: portfolioId,
            userId: user.id,
            portfolioSkills: skills || []
        }

        getApiInstance().postWithBodyAuth({
            url: '/Portfolio/InsertOrUpdateSkills',
            data
        }).then(res => {
            const { successful, errorMessage, result } = res
            if (successful) {
                addAlert({ type: 'success', message: 'Lưu thành công!!!' })
            } else {
                addAlert({ type: 'error', message: 'Lỗi: ' + (errorMessage || 'Không xác định') + '.' })
            }
        }).catch(error => {
            addAlert({ type: 'error', message: 'Đã xảy ra lỗi. ' + error })
            console.error(error)
        })
    }

    render() {
        const { skills } = this.state
        const { portfolioId } = this.props
        return (
            <div className="box">
                <h3>KỸ NĂNG</h3>
                <div className="form-filter">
                    {
                        skills && skills.length && skills.map((item, index) => {
                            const { skillName, level } = item
                            return (
                                <div className="filter-item" key={index}>
                                    <div className="input-container">
                                        <input type="text"
                                            className={''}
                                            placeholder="Name ..."
                                            value={skillName}
                                            onChange={e => { this.handleChange({ ...item, skillName: e.target.value }) }} />
                                    </div>
                                    <div className="slider-container">
                                        <InputRange
                                            min={1}
                                            max={100}
                                            defaultValue={level} onChange={level => { this.handleChange({ ...item, level }) }} />
                                    </div>
                                    <div className="skill-item-control">
                                        <button className="btnDanger" onClick={() => { this.handleRemove(item) }}>Xóa</button>
                                    </div>
                                </div>)
                        })
                    }
                    <div className="portfolio-box-controls">
                        <button className="btn-add-new" onClick={this.handleInsertNewItem}>Thêm</button>
                        {portfolioId && <button className="btn-add-new" onClick={this.handleSave}>Lưu</button>}
                    </div>
                </div>
            </div>
        );
    }
}

export default Skill;
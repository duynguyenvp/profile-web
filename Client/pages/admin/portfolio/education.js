import React, { Component } from 'react';
import { randomId } from '../../../utils/string-utils'
import Calendar from '../../../common/form-controls/calendar';
import Editor from '../../../common/form-controls/editor'
import PropTypes from 'prop-types'
import { cloneDate } from '../../../utils/date-utils'
import getApiInstance from '../../../ajax/generic-api'
import { addAlert } from '../../../services/alertService'
import { getState } from '../../../services/userService'

class Education extends Component {
    static propTypes = {
        educations: PropTypes.array,
        portfolioId: PropTypes.string,
        callback: PropTypes.func
    }
    static defaultProps = {
        educations: null,
        portfolioId: null,
        callback: () => { }
    }
    constructor(props) {
        super(props);
        const { educations } = props
        const validate = educations && educations.map(item => ({
            id: item.id,
            schoolName: "",
            specialized: "",
            startDate: "",
            endDate: "",
            detail: "",
        }))
        this.state = {
            educations: educations,
            validate
        }
    }

    static getDerivedStateFromProps(props, state) {
        if (JSON.stringify(props.educations) !== JSON.stringify(state.educations)) {
            const { educations } = props
            return { educations }
        }
        return null;
    }

    componentDidUpdate(prevProps) {
        if (JSON.stringify(this.props.educations) !== JSON.stringify(prevProps.educations)) {
            const { educations } = this.props
            this.setState({ educations });
        }
    }

    handleChange = item => {
        const { educations } = this.state
        let newEducations = educations.map(education => {
            if (item.id == education.id) {
                return item
            }
            return education
        })
        this.props.callback(newEducations)
    }

    handleEditorChange = (id, html) => {
        const { educations } = this.state
        let newEducations = educations.map(education => {
            if (id == education.id) {
                return { ...education, detail: html }
            }
            return education
        })
        this.props.callback(newEducations)
    }
    handleInsertNewItem = () => {
        const { educations } = this.state
        const { portfolioId } = this.props
        const user = getState()
        const data = {
            id: portfolioId,
            userId: user.id,
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
                this.props.callback([...educations, ...result])
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
            url: '/Portfolio/DeleteEducation',
            data: {
                Id: portfolioId,
                ObjectId: item.id,
            }
        }).then(res => {
            const { successful, errorMessage, result } = res
            if (successful) {
                const { educations } = this.state
                let newEducations = educations.filter(f => f.id != item.id)
                this.props.callback(newEducations)
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
        const { educations } = this.state
        const { portfolioId } = this.props
        const user = getState()
        const data = {
            id: portfolioId,
            userId: user.id,
            portfolioEducations: educations || []
        }

        getApiInstance().postWithBodyAuth({
            url: '/Portfolio/InsertOrUpdateEducations',
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
        const { portfolioId } = this.props
        const { educations, validate } = this.state
        return (
            <div className="box">
                <h3>HỌC VẤN</h3>
                <div className="form-filter">
                    {
                        educations && educations.length && educations.map((item, index) => {
                            const { schoolName, specialized, startDate, endDate, detail } = item
                            const validateItem = validate.find(f => f.id == item.id)

                            return (
                                <div className="filter-item experience" key={index}>
                                    <button className="btn-remove" onClick={() => { this.handleRemove(item) }}>X</button>
                                    <div className="form-filter">
                                        <div className="experience-item">
                                            <label className="title">Tên trường:</label>
                                            <div className="input-container">
                                                <input type="text"
                                                    className={validateItem && validateItem.schoolName ? 'error' : ''}
                                                    placeholder="nhập tên ..."
                                                    value={schoolName}
                                                    onChange={e => { this.handleChange({ ...item, schoolName: e.target.value }) }} />
                                                {validateItem && validateItem.schoolName && <label className="validate-error">{validateItem && validateItem.schoolName || ''}</label>}
                                            </div>
                                        </div>
                                        <div className="experience-item">
                                            <label className="title">Ngành/Bậc học:</label>
                                            <div className="input-container">
                                                <input type="text"
                                                    className={validateItem && validateItem.specialized ? 'error' : ''}
                                                    placeholder="nhập tên ..."
                                                    value={specialized}
                                                    onChange={e => { this.handleChange({ ...item, specialized: e.target.value }) }} />
                                                {validateItem && validateItem.specialized && <label className="validate-error">{validateItem && validateItem.specialized || ''}</label>}
                                            </div>
                                        </div>
                                        <div className="experience-item">
                                            <label className="title">Thời gian:</label>
                                            <div className="input-container horizontal">
                                                <Calendar callback={value => { console.log(value); this.handleChange({ ...item, startDate: value }) }} defaultValue={cloneDate(startDate)} />
                                                <span style={{ margin: '0 16px' }}>Đến</span>
                                                <Calendar callback={value => { console.log(value); this.handleChange({ ...item, endDate: value }) }} defaultValue={cloneDate(endDate)} />
                                            </div>
                                        </div>
                                        <div className="experience-item">
                                            <label className="title">Chi tiết:</label>
                                            <div className="input-container" style={{ minHeight: 300, maxHeight: 300 }}>
                                                <Editor html={detail}
                                                    callback={html => { this.handleEditorChange(item.id, html) }} />
                                                {validateItem && validateItem.detail && <label className="validate-error">{validateItem && validateItem.detail || ''}</label>}
                                            </div>
                                        </div>
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

export default Education;
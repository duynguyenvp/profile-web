import React, { Component } from 'react';
import { randomId } from '../../../utils/string-utils'
import Calendar from '../../../common/form-controls/calendar';
import Editor from '../../../common/form-controls/editor'
import PropTypes from 'prop-types'
import { cloneDate } from '../../../utils/date-utils'
import getApiInstance from '../../../ajax/generic-api'
import { addAlert } from '../../../services/alertService'
import { getState } from '../../../services/userService'

class Experiences extends Component {
    static propTypes = {
        experiences: PropTypes.array,
        portfolioId: PropTypes.string,
        callback: PropTypes.func
    }
    static defaultProps = {
        experiences: null,
        portfolioId: null,
        callback: () => { }
    }
    constructor(props) {
        super(props);
        const { experiences } = props
        const validate = experiences && experiences.map(item => ({
            id: item.id,
            company: "",
            position: "",
            startDate: "",
            endDate: "",
            detail: ""
        }))
        this.state = {
            experiences: experiences,
            validate
        }
    }

    static getDerivedStateFromProps(props, state) {
        if (JSON.stringify(props.experiences) !== JSON.stringify(state.experiences)) {
            const { experiences } = props
            return { experiences }
        }
        return null;
    }

    componentDidUpdate(prevProps) {
        if (JSON.stringify(this.props.experiences) !== JSON.stringify(prevProps.experiences)) {
            const { experiences } = this.props
            this.setState({ experiences });
        }
    }

    handleChange = item => {
        const { experiences } = this.state
        let newExperiences = experiences.map(exp => {
            if (item.id == exp.id) {
                return item
            }
            return exp
        })
        this.props.callback(newExperiences)
    }

    handleEditorChange = (id, html) => {
        const { experiences } = this.state
        let newExperiences = experiences.map(exp => {
            if (id == exp.id) {
                return { ...exp, detail: html }
            }
            return exp
        })
        this.props.callback(newExperiences)
    }

    handleInsertNewItem = () => {
        const { experiences } = this.state
        const { portfolioId } = this.props
        const user = getState()
        const data = {
            id: portfolioId,
            userId: user.id,
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
                this.props.callback([...experiences, ...result])
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
            url: '/Portfolio/DeleteExperience',
            data: {
                Id: portfolioId,
                ObjectId: item.id,
            }
        }).then(res => {
            const { successful, errorMessage, result } = res
            if (successful) {
                const { experiences } = this.state
                let newExperiences = experiences.filter(f => f.id != item.id)
                this.props.callback(newExperiences)
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
        const { experiences } = this.state
        const { portfolioId } = this.props
        const user = getState()
        const data = {
            id: portfolioId,
            userId: user.id,
            portfolioExperiences: experiences || []
        }

        getApiInstance().postWithBodyAuth({
            url: '/Portfolio/UpdateExperiences',
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
        const { experiences, validate } = this.state
        return (
            <div className="box">
                <h3>KINH NGHIỆM</h3>
                <div className="form-filter">
                    {
                        experiences && experiences.length && experiences.map((item, index) => {
                            const { position, company, startDate, endDate, detail, key } = item
                            const validateItem = validate.find(f => f.key == item.key)

                            return (
                                <div className="filter-item experience" key={index}>
                                    <button className="btn-remove" onClick={() => { this.handleRemove(item) }}>X</button>
                                    <div className="form-filter">
                                        <div className="experience-item">
                                            <label className="title">Vị trí:</label>
                                            <div className="input-container">
                                                <input type="text"
                                                    className={validateItem && validateItem.Position ? 'error' : ''}
                                                    placeholder="nhập tên ..."
                                                    value={position}
                                                    onChange={e => { this.handleChange({ ...item, position: e.target.value }) }} />
                                                {validateItem && validateItem.position && <label className="validate-error">{validateItem && validateItem.position || ''}</label>}
                                            </div>
                                        </div>
                                        <div className="experience-item">
                                            <label className="title">Công ty:</label>
                                            <div className="input-container">
                                                <input type="text"
                                                    className={validateItem && validateItem.company ? 'error' : ''}
                                                    placeholder="nhập tên ..."
                                                    value={company}
                                                    onChange={e => { this.handleChange({ ...item, company: e.target.value }) }} />
                                                {validateItem && validateItem.company && <label className="validate-error">{validateItem && validateItem.company || ''}</label>}
                                            </div>
                                        </div>
                                        <div className="experience-item">
                                            <label className="title">Thời gian:</label>
                                            <div className="input-container horizontal">
                                                <Calendar callback={value => { this.handleChange({ ...item, startDate: value }) }} defaultValue={cloneDate(startDate) || new Date()} />
                                                <span style={{ margin: '0 16px' }}>Đến</span>
                                                <Calendar callback={value => { this.handleChange({ ...item, endDate: value }) }} defaultValue={cloneDate(endDate) || new Date()} />
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

export default Experiences;
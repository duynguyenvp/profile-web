import React, { Component } from 'react';
import Editor from '../../../common/form-controls/editor'
import PropTypes from 'prop-types'
import getApiInstance from '../../../ajax/generic-api'
import { addAlert } from '../../../services/alertService'
import { getState } from '../../../services/userService'

class User extends Component {
    static propTypes = {
        portfolioUser: PropTypes.object,
        portfolioId: PropTypes.string,
        callback: PropTypes.func
    }
    static defaultProps = {
        portfolioUser: null,
        portfolioId: null,
        callback: () => { }
    }
    constructor(props) {
        super(props);
        const { portfolioUser } = props
        const validate = {
            fullName: '',
            jobTitle: '',
            email: '',
            mobile: '',
            skype: '',
            address: '',
            avatar: ''
        }
        this.state = {
            portfolioUser,
            validate
        }
    }

    static getDerivedStateFromProps(props, state) {
        if (JSON.stringify(props.portfolioUser) !== JSON.stringify(state.portfolioUser)) {
            const { portfolioUser } = props
            return { portfolioUser }
        }
        return null;
    }

    componentDidUpdate(prevProps) {
        if (JSON.stringify(this.props.portfolioUser) !== JSON.stringify(prevProps.portfolioUser)) {
            const { portfolioUser } = this.props
            this.setState({ portfolioUser });
        }
    }

    handleChange = item => {
        this.props.callback(item)
    }

    handleEditorChange = (html) => {
        const { portfolioUser } = this.state
        const newPortfolioUser = { ...portfolioUser, about: html }
        this.props.callback(newPortfolioUser)
    }

    handleSave = () => {
        const { portfolioUser } = this.state
        const user = getState()
        const username = user && user.username
        getApiInstance().postWithFormAuth({
            url: '/User/UpdateUserInfo',
            data: { ...portfolioUser, UserName: username }
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

    resizeImage = (dataSrc) => {
        const self = this

        let img = new Image();

        const maxWidth = 300;
        const maxHeight = 300;

        img.onload = function () {
            let width = img.width;
            let height = img.height;

            if (width > height) {
                if (width > maxWidth) {
                    height *= maxWidth / width;
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width *= maxHeight / height;
                    height = maxHeight;
                }
            }

            let oc = document.createElement('canvas'),
                octx = oc.getContext('2d');

            oc.width = width;
            oc.height = height;
            octx.drawImage(img, 0, 0, oc.width, oc.height);
            const result = oc.toDataURL("image/jpg");
            self.props.callback({ ...self.state.portfolioUser, avatar: result })
        }
        img.src = dataSrc;
    }

    changeAvatar = () => {
        const self = this
        const filesToUpload = this.refIpAvatar.files;
        const file = filesToUpload[0];
        let reader = new FileReader();
        reader.onload = function (e) {
            self.resizeImage(e.target.result);
        }
        reader.onerror = function (error) {
            console.error(error)
            self.refIpAvatar.value = null
        }
        if (file) {
            reader.readAsDataURL(file);
        }
    }

    render() {
        const { portfolioId } = this.props
        const { portfolioUser, validate } = this.state

        const { fullName, jobTitle, email, mobile, skype, address, avatar, about } = portfolioUser || {}

        let avatarStyle = {
            backgroundImage: `url("${avatar || require('../../../common-resources/images/avatar.jpg')}")`
        }

        const user = getState()
        const username = user && user.username

        return (
            <div className="box">
                <h3>THÔNG TIN CÁ NHÂN</h3>
                <a target="_blank" rel="noopener noreferrer" href={`/resume/view/${username}`} style={{ position: "absolute", right: 40, cursor: "pointer" }} title="Xem thử">
                    <i className="material-icons">desktop_mac</i>
                </a>
                <div className="form-filter">
                    <div className="filter-item experience">
                        <div className="form-filter">
                            <div className="avatar" style={avatarStyle}>
                                <label htmlFor="input-avatar" className="input-avatar-button">
                                    <i className="material-icons">edit</i>
                                </label>
                                <input type="file"
                                    id="input-avatar"
                                    ref={instance => this.refIpAvatar = instance}
                                    onChange={this.changeAvatar} />
                            </div>
                            <div className="experience-item">
                                <label className="title">Họ và tên:</label>
                                <div className="input-container">
                                    <input type="text"
                                        ref={instance => this.refFullname = instance}
                                        className={validate && validate.fullName ? 'error' : ''}
                                        placeholder="nhập tên ..."
                                        value={fullName || ''}
                                        onChange={e => { this.handleChange({ ...portfolioUser, fullName: e.target.value }) }} />
                                    {validate && validate.fullName && <label className="validate-error">{validate && validate.fullName || ''}</label>}
                                </div>
                            </div>
                            <div className="experience-item">
                                <label className="title">Bạn làm nghề gì:</label>
                                <div className="input-container">
                                    <input type="text"
                                        className={validate && validate.jobTitle ? 'error' : ''}
                                        placeholder="nhập tên nghề nghiệp ..."
                                        value={jobTitle || ''}
                                        onChange={e => { this.handleChange({ ...portfolioUser, jobTitle: e.target.value }) }} />
                                    {validate && validate.jobTitle && <label className="validate-error">{validate && validate.jobTitle || ''}</label>}
                                </div>
                            </div>

                            <div className="experience-item">
                                <label className="title">Email:</label>
                                <div className="input-container">
                                    <input type="text"
                                        className={validate && validate.email ? 'error' : ''}
                                        placeholder="nhập email ..."
                                        value={email || ''}
                                        onChange={e => { this.handleChange({ ...portfolioUser, email: e.target.value }) }} />
                                    {validate && validate.email && <label className="validate-error">{validate && validate.email || ''}</label>}
                                </div>
                            </div>

                            <div className="experience-item">
                                <label className="title">Số điện thoại:</label>
                                <div className="input-container">
                                    <input type="text"
                                        className={validate && validate.mobile ? 'error' : ''}
                                        placeholder="nhập số điện thoại ..."
                                        value={mobile || ''}
                                        onChange={e => { this.handleChange({ ...portfolioUser, mobile: e.target.value }) }} />
                                    {validate && validate.mobile && <label className="validate-error">{validate && validate.mobile || ''}</label>}
                                </div>
                            </div>

                            <div className="experience-item">
                                <label className="title">Skype:</label>
                                <div className="input-container">
                                    <input type="text"
                                        className={validate && validate.skype ? 'error' : ''}
                                        placeholder="nhập skype ..."
                                        value={skype || ''}
                                        onChange={e => { this.handleChange({ ...portfolioUser, skype: e.target.value }) }} />
                                    {validate && validate.skype && <label className="validate-error">{validate && validate.skype || ''}</label>}
                                </div>
                            </div>

                            <div className="experience-item">
                                <label className="title">Địa chỉ:</label>
                                <div className="input-container">
                                    <input type="text"
                                        className={validate && validate.address ? 'error' : ''}
                                        placeholder="nhập địa chỉ ..."
                                        value={address || ''}
                                        onChange={e => { this.handleChange({ ...portfolioUser, address: e.target.value }) }} />
                                    {validate && validate.address && <label className="validate-error">{validate && validate.address || ''}</label>}
                                </div>
                            </div>

                            <div className="experience-item">
                                <label className="title">Giới thiệu bản thân:</label>
                                <div className="input-container" style={{ minHeight: 300, maxHeight: 300 }}>
                                    <Editor html={about}
                                        callback={html => { this.handleEditorChange(html) }} />
                                    {validate && validate.about && <label className="validate-error">{validate && validate.about || ''}</label>}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="portfolio-box-controls">
                        {portfolioId && <button className="btn-add-new" onClick={this.handleSave}>Lưu</button>}
                    </div>
                </div>
            </div>
        );
    }
}

export default User;
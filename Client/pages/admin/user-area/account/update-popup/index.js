import React, { Component } from 'react';
import { RComponent } from '../../../../../common/r-component'
import Select from '../../../../../common/form-controls/my-select'

import { validateEmail } from '../../../../../utils/validate'
import { PopupContext } from '../../../../../services/popupService';
import { addAlert } from '../../../../../services/alertService'
import getApiInstance from '../../../../../ajax/generic-api'

class UpdatePopup extends RComponent {
    static contextType = PopupContext;
    constructor(props) {
        super(props);
        const { user } = props
        this.state = {
            email: user && user.email || '',
            username: user && user.username || '',
            age: user && user.age || '',
            address: user && user.address || '',
            isValidateEmail: '',
            isValidateUsername: '',
            role: user && user.roleId || ''
        }
        this.onMount(() => {
            this.loadData()
        })
    }

    loadData = () => {
        getApiInstance().getWithQueryStringAuth({
            url: '/User/UserRoleListAll'
        }).then(res => {
            const { successful, result } = res
            if (successful) {
                this.setState({ dataRoles: result })
            }
        }).catch(err => {
            console.error(err)
        })
    }

    handleEmailChange = value => {
        if (validateEmail(value)) {
            this.setState({
                email: value,
                isValidateEmail: ''
            })
        } else {
            this.setState({
                email: value,
                isValidateEmail: 'Email không hợp lệ.'
            })
        }
    }

    handleUserChange = value => {
        this.setState({
            username: value,
            isValidateUsername: value ? '' : 'Username trống'
        })
    }
    handleAgeChange = value => {
        this.setState({
            age: value
        })
    }
    handleAddressChange = value => {
        this.setState({
            address: value
        })
    }

    send = () => {
        const { email, username, address, age, isValidateEmail, isValidateUsername, role } = this.state
        const { onClose } = this.context
        const { callback, user } = this.props
        if (isValidateEmail || isValidateUsername) {
            addAlert({ type: 'warning', message: 'Lỗi Validate.' })
            return;
        }
        if (!email || !username) {
            addAlert({ type: 'warning', message: 'Thông tin chưa đầy đủ' })
            return;
        }
        //Thêm điều kiện để chỉnh sửa hay thêm mới user đối với trường password
        getApiInstance().postWithFormAuth({
            url: '/User/CreateOrUpdateUser',
            data: {
                UserName: username,
                Password: user ? '' : `ok${new Date().getFullYear()}`,
                Email: email,
                Age: Number(age),
                RoleId: Number(role),
                Address: address
            }
        }).then(res => {
            if (res.successful) {
                addAlert({ message: 'Thành công!!!', duration: 5000 })
                this.setState({
                    email: '',
                    username: '',
                    isValidateEmail: '',
                    isValidateMessage: '',
                    address: '',
                    age: '',
                }, () => {
                    onClose()
                    callback()
                })
            } else {
                addAlert({ type: 'warning', message: 'Đã xảy ra lỗi: ' + (res.errorMessage || 'Không xác định') })
            }
        }).catch(err => {
            console.error('Lỗi', err)
        })
    }

    render() {
        const { email, username: username, address, age, isValidateEmail, isValidateUsername: isValidateUsername, role, dataRoles } = this.state
        return (
            <PopupContext.Consumer>
                {
                    ({ popupId, callback, onClose }) =>
                        <div className="form-filter">
                            <div className="filter-item">
                                <label className="title">Username:</label>
                                <div className="input-container">
                                    <input type="text"
                                        className={isValidateUsername ? 'error' : ''}
                                        placeholder="Username ..."
                                        value={username}
                                        onChange={e => { this.handleUserChange(e.target.value) }} />
                                    {isValidateUsername && <label className="validate-error">{isValidateUsername}</label>}
                                </div>
                            </div>
                            <div className="filter-item">
                                <label className="title">Email:</label>
                                <div className="input-container">
                                    <input type="text"
                                        className={isValidateEmail ? 'error' : ''}
                                        placeholder="Email ..."
                                        value={email}
                                        onChange={e => { this.handleEmailChange(e.target.value) }} />
                                    {isValidateEmail && <label className="validate-error">{isValidateEmail}</label>}
                                </div>
                            </div>
                            <div className="filter-item">
                                <label className="title">Age:</label>
                                <div className="input-container">
                                    <input type="text"
                                        className={''}
                                        placeholder="Age ..."
                                        value={age}
                                        onChange={e => { this.handleAgeChange(e.target.value) }} />
                                </div>
                            </div>
                            <div className="filter-item">
                                <label className="title">Address:</label>
                                <div className="input-container">
                                    <input type="text"
                                        className={''}
                                        placeholder="Address ..."
                                        value={address}
                                        onChange={e => { this.handleAddressChange(e.target.value) }} />
                                </div>
                            </div>
                            <div className="filter-item">
                                <label className="title">Role:</label>
                                <div className="input-container">
                                    <Select listOptions={dataRoles && dataRoles.map(item => ({ name: item.roleName, value: `${item.id}` }))}
                                        placeholder="--Chọn quyền--"
                                        isFilter={true}
                                        selectedValues={[`${role}`]}
                                        onChange={value => { this.setState({ role: value[0] || this.state.role }) }} />
                                </div>
                            </div>
                            <div className="filter-item flex-end">
                                <button className="btnPrimary margin-16px" onClick={this.send}>Cập nhật</button>
                                <button className="btnDefault" onClick={onClose}>Đóng</button>
                            </div>
                        </div>
                }
            </PopupContext.Consumer>
        );
    }
}
export default UpdatePopup;
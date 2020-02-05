import React, { Component } from 'react';
import { RComponent } from '../../../../../common/r-component'

import { PopupContext } from '../../../../../services/popupService';
import { addAlert } from '../../../../../services/alertService'
import getApiInstance from '../../../../../ajax/generic-api'

class UpdatePopup extends RComponent {
    static contextType = PopupContext;
    constructor(props) {
        super(props);
        const { item } = props
        this.state = {
            roleName: item && item.roleName || '',
            roleDescription: item && item.roleDescription || '',
            roleLevel: item && item.roleLevel || '',
            isValidateName: ''
        }
    }

    handleDescriptionChange = value => {
        this.setState({
            roleDescription: value
        })
    }

    handleLevelChange = value => {
        this.setState({
            roleLevel: value
        })
    }

    handleNameChange = value => {
        this.setState({
            roleName: value,
            isValidateName: value ? '' : 'roleName trống'
        })
    }

    update = () => {
        const { roleName, roleDescription, roleLevel, isValidateName } = this.state
        const { onClose } = this.context
        const { callback, item } = this.props
        if (isValidateName) {
            addAlert({ type: 'warning', message: 'Lỗi Validate. ' + isValidateName })
            return;
        }
        if (!roleName) {
            addAlert({ type: 'warning', message: 'Thông tin chưa đầy đủ' })
            return;
        }
        let data = {
            Id: item && item.id || null,
            roleName: roleName,
            roleDescription: roleDescription,
            roleLevel: roleLevel,
            IsDelete: false,
        }
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                if (typeof data[key] != 'boolean' && !data[key]) {
                    delete data[key]
                }
            }
        }
        getApiInstance().postWithFormAuth({
            url: '/User/UserRoleAddOrUpdate',
            data
        }).then(res => {
            if (res.successful) {
                addAlert({ message: 'Thành công!!!', duration: 5000 })
                this.setState({
                    roleName: '',
                    roleDescription: '',
                    isValidateName: ''
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
        const { roleName, roleDescription, roleLevel, isValidateName } = this.state
        return (
            <PopupContext.Consumer>
                {
                    ({ onClose }) =>
                        <div className="form-filter">
                            <div className="filter-item">
                                <label className="title">Tên quyền:</label>
                                <div className="input-container">
                                    <input type="text"
                                        className={isValidateName ? 'error' : ''}
                                        placeholder="nhập tên ..."
                                        value={roleName}
                                        onChange={e => { this.handleNameChange(e.target.value) }} />
                                    {isValidateName && <label className="validate-error">{isValidateName}</label>}
                                </div>
                            </div>

                            <div className="filter-item">
                                <label className="title">Mô tả:</label>
                                <div className="input-container">
                                    <input type="text"
                                        className={''}
                                        placeholder="Nhập mô tả ..."
                                        value={roleDescription}
                                        onChange={e => { this.handleDescriptionChange(e.target.value) }} />
                                </div>
                            </div>

                            <div className="filter-item">
                                <label className="title">Cấp bậc:</label>
                                <div className="input-container">
                                    <input type="number"
                                        className={''}
                                        placeholder="Nhập cấp bậc ..."
                                        value={roleLevel}
                                        onChange={e => { this.handleLevelChange(e.target.value) }} />
                                </div>
                            </div>
                            <div className="filter-item flex-end">
                                <button className="btnPrimary margin-16px" onClick={this.update}>Cập nhật</button>
                                <button className="btnDefault" onClick={onClose}>Đóng</button>
                            </div>
                        </div>
                }
            </PopupContext.Consumer>
        );
    }
}
export default UpdatePopup;
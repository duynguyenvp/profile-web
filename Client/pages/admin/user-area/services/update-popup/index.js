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
        const { item } = props
        this.state = {
            serviceName: item && item.serviceName || '',
            serviceDescription: item && item.serviceDescription || '',
            isValidateName: ''
        }
    }

    handleDescriptionChange = value => {
        this.setState({
            serviceDescription: value
        })
    }

    handleNameChange = value => {
        this.setState({
            serviceName: value,
            isValidateName: value ? '' : 'serviceName trống'
        })
    }

    send = () => {
        const { serviceName, serviceDescription, isValidateName } = this.state
        const { onClose } = this.context
        const { callback, item } = this.props
        if (isValidateName) {
            addAlert({ type: 'warning', message: 'Lỗi Validate. ' + isValidateName })
            return;
        }
        if (!serviceName) {
            addAlert({ type: 'warning', message: 'Thông tin chưa đầy đủ' })
            return;
        }
        let data = {
            Id: item && item.id || null,
            ServiceName: serviceName,
            ServiceDescription: serviceDescription,
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
            url: '/User/UserServiceAddOrUpdate',
            data
        }).then(res => {
            if (res.successful) {
                addAlert({ message: 'Thành công!!!', duration: 5000 })
                this.setState({
                    ServiceName: '',
                    ServiceDescription: '',
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
        const { serviceName, serviceDescription, isValidateName } = this.state
        return (
            <PopupContext.Consumer>
                {
                    ({ onClose }) =>
                        <div className="form-filter">
                            <div className="filter-item">
                                <label className="title">Tên dịch vụ:</label>
                                <div className="input-container">
                                    <input type="text"
                                        className={isValidateName ? 'error' : ''}
                                        placeholder="nhập tên ..."
                                        value={serviceName}
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
                                        value={serviceDescription}
                                        onChange={e => { this.handleDescriptionChange(e.target.value) }} />
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
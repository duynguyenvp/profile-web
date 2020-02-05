import React, { Component } from 'react';
import { RComponent } from '../../../../../common/r-component'
import { PopupContext } from '../../../../../services/popupService';
import { addAlert } from '../../../../../services/alertService'
import getApiInstance from '../../../../../ajax/generic-api'
class DeletePopup extends RComponent {
    static contextType = PopupContext;

    delete = () => {
        const { callback, itemId } = this.props
        const { onClose } = this.context
        getApiInstance().postWithFormAuth({
            url: '/User/UserServiceAddOrUpdate',
            data: {
                Id: itemId,
                IsDisable: true
            }
        }).then(res => {
            const { successful } = res
            if (successful) {
                addAlert({ type: 'success', message: 'Thành công.' })
                onClose()
                callback()
            }
        }).catch(err => {
            addAlert({ type: 'error', message: 'Đã xảy ra lỗi. ' + err })
            onClose()
            console.error(err)
        })
    }
    render() {
        return (
            <PopupContext.Consumer>
                {
                    ({ onClose }) =>
                        <div className="form-filter">
                            <div className="filter-item">
                                <p style={{ margin: '0 0 30px 0' }}>Chắc chắn muốn xóa?</p>
                            </div>
                            <div className="filter-item flex-end">
                                <button className="btnDanger margin-16px" onClick={this.delete}>Xóa</button>
                                <button className="btnDefault" onClick={onClose}>Đóng</button>
                            </div>
                        </div>
                }
            </PopupContext.Consumer>
        );
    }
}
export default DeletePopup;
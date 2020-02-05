import React, { Component } from 'react';
import { RComponent } from '../../../../../common/r-component'
import { PopupContext } from '../../../../../services/popupService';

class DetailPopup extends RComponent {
    static contextType = PopupContext;

    update = () => {
        const { callback } = this.props
        const { onClose } = this.context
        onClose()
        callback()
    }
    render() {
        const { user } = this.props
        return (
            <PopupContext.Consumer>
                {
                    ({ onClose }) =>
                        <div className="form-filter">
                            <div className="filter-item">
                                <label className="title">Username:</label>
                                <div className="input-container">
                                    {user && user.username}
                                </div>
                            </div>
                            <div className="filter-item">
                                <label className="title">Email:</label>
                                <div className="input-container">
                                    {user && user.email}
                                </div>
                            </div>
                            <div className="filter-item">
                                <label className="title">Age:</label>
                                <div className="input-container">
                                    {user && user.age}
                                </div>
                            </div>
                            <div className="filter-item">
                                <label className="title">Address:</label>
                                <div className="input-container">
                                    {user && user.address}
                                </div>
                            </div>
                            <div className="filter-item">
                                <label className="title">Role:</label>
                                <div className="input-container">
                                    {user && user.role}
                                </div>
                            </div>
                            <div className="filter-item flex-end">
                                <button className="btnPrimary margin-16px" onClick={this.update}>Chỉnh sửa</button>
                                <button className="btnDefault" onClick={onClose}>Đóng</button>
                            </div>
                        </div>
                }
            </PopupContext.Consumer>
        );
    }
}
export default DetailPopup;
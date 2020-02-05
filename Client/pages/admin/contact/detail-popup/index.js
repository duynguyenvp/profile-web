import React, { Component } from 'react';
import { RComponent } from '../../../../common/r-component'
import { PopupContext } from '../../../../services/popupService';

class DetailPopup extends RComponent {
    static contextType = PopupContext;

    update = () => {
        const { callback } = this.props
        const { onClose } = this.context
        onClose()
        callback()
    }
    render() {
        const { item } = this.props
        return (
            <PopupContext.Consumer>
                {
                    ({ onClose }) =>
                        <div className="form-filter">
                            <div className="filter-item">
                                <label className="title">Email:</label>
                                <div className="input-container">
                                    {item && item.email}
                                </div>
                            </div>
                            <div className="filter-item">
                                {item && item.message}
                            </div>
                            <div className="filter-item flex-end">
                                <button className="btnPrimary margin-16px" onClick={this.update}>Xóa</button>
                                <button className="btnDefault" onClick={onClose}>Đóng</button>
                            </div>
                        </div>
                }
            </PopupContext.Consumer>
        );
    }
}
export default DetailPopup;
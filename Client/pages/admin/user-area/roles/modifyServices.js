import React, { Component } from 'react';
import { RComponent } from '../../../../common/r-component'
import Select from '../../../../common/form-controls/my-select'

import { PopupContext } from '../../../../services/popupService';
import { addAlert } from '../../../../services/alertService'
import getApiInstance from '../../../../ajax/generic-api'

class ModifyServices extends RComponent {
    static contextType = PopupContext;
    constructor(props) {
        super(props);
        const { role } = props
        const { id, services } = role
        const selectedIds = services && services.map(m => `${m.id}`)
        this.state = {
            roleId: id,
            data: [],
            selectedIds
        }

        this.onMount(() => {
            this.loadData()
        })
    }

    loadData = () => {
        getApiInstance().getWithQueryStringAuth({
            url: '/User/UserServiceListAll',
            data: {
                Condition: ''
            }
        }).then(res => {
            const { successful, result } = res
            if (successful) {
                this.setState({ data: result })
            }
        }).catch(err => {
            console.error(err)
        })
    }

    update = () => {
        const { roleId, selectedIds } = this.state
        const { onClose } = this.context
        const { callback } = this.props

        let data = {
            roleId: roleId,
            serviceId: selectedIds
        }
        getApiInstance().postWithBodyAuth({
            url: '/User/UserRoleSetService',
            data
        }).then(res => {
            if (res.successful) {
                addAlert({ message: 'Thành công!!!', duration: 5000 })
                onClose()
                callback()
            } else {
                addAlert({ type: 'warning', message: 'Đã xảy ra lỗi: ' + (res.errorMessage || 'Không xác định') })
            }
        }).catch(err => {
            console.error('Lỗi', err)
        })
    }

    render() {
        const { selectedIds, data } = this.state
        return (
            <PopupContext.Consumer>
                {
                    ({ onClose }) =>
                        <div className="form-filter">
                            <div className="filter-item">
                                <Select listOptions={data && data.map(item => ({ name: item.serviceDescription, value: `${item.id}` }))}
                                    placeholder="--Chọn dịch vụ--"
                                    isFilter={true}
                                    isMultiple={true}
                                    selectedValues={selectedIds}
                                    onChange={value => { this.setState({ selectedIds: value }) }} />
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
export default ModifyServices;
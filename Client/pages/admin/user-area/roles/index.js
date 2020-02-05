import React from 'react';
import { RComponent } from '../../../../common/r-component'
import './style.scss'

import { addPopup } from '../../../../services/popupService'
import getApiInstance from '../../../../ajax/generic-api'

import UpdatePopup from './update-popup'
import DeletePopup from './delete-popup'
import ModifyServicePopup from './modifyServices'

class Roles extends RComponent {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        }

        this.onMount(() => {
            this.loadData()
        })
    }

    loadData = () => {
        getApiInstance().getWithQueryStringAuth({
            url: '/User/UserRoleListAll',
            data: {
                Condition: this.refCondition.value
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

    send = () => {
        this.loadData();
    }

    reset = () => {
        this.refCondition.value = ''
        this.loadData();
    }

    addNewItem = () => {
        addPopup({
            title: 'TẠO MỚI QUYỀN',
            children: <UpdatePopup item={null} callback={this.reset} />
        })
    }

    updateItem = (item) => {
        addPopup({
            title: 'CHỈNH SỬA THÔNG TIN QUYỀN',
            children: <UpdatePopup item={item} callback={this.reset} />
        })
    }

    deleteItem = (item) => {
        addPopup({
            title: 'XÓA QUYỀN',
            children: <DeletePopup itemId={item.id} callback={this.reset} />,
            mini: true
        })
    }

    modifyServices = role => {
        addPopup({
            title: 'DANH SÁCH DỊCH VỤ',
            children: <ModifyServicePopup role={role} callback={this.reset} />
        })
    }

    render() {
        const { data } = this.state
        return (
            <div className="box">
                <h3>Quản lý quyền</h3>
                <div className="form-filter">
                    <div className="filter-item">
                        <label className="title">Điều kiện:</label>
                        <input type="text"
                            className={''}
                            placeholder="Điều kiện ..."
                            ref={instance => this.refCondition = instance} />
                        <button className="btnDefault margin-16px" onClick={this.reset}>Tạo lại</button>
                        <button className="btnPrimary" onClick={this.send}>Tìm kiếm</button>
                    </div>
                </div>
                <button className="btn-add-new"
                    onClick={this.addNewItem}
                ><i className="material-icons">add_circle_outline</i>Thêm mới</button>
                <div className="box-grid">
                    <table cellPadding={0} cellSpacing={0}>
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Tên quyền</th>
                                <th>Mô tả</th>
                                <th>Level</th>
                                <th style={{ width: 250, maxWidth: 250 }}>Dịch vụ</th>
                                <th style={{ width: 230, minWidth: 230 }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data && data.length ? data.map((item, index) => {
                                    return <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item.roleName && item.roleName}</td>
                                        <td>{item.roleDescription && item.roleDescription}</td>
                                        <td>{item.roleLevel && item.roleLevel}</td>
                                        <td>
                                            <span className="role-service-info" onClick={() => { this.modifyServices(item) }}>
                                                {`(${item.services.length || 0}) Dịch vụ`}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="controls">
                                                <button className="btn-edit"
                                                    onClick={() => { this.updateItem(item) }}
                                                ><i className="material-icons">build</i>Sửa</button>
                                                <button className="btn-remove"
                                                    onClick={() => { this.deleteItem(item) }}
                                                ><i className="material-icons">delete</i>Xóa</button>
                                            </div>
                                        </td>
                                    </tr>
                                }) : <tr>
                                        <td colSpan={4}>Không có dữ liệu</td>
                                    </tr>
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default Roles;
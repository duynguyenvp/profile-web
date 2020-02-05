import React from 'react';
import { RComponent } from '../../../../common/r-component'
import './user.scss'

import { addPopup } from '../../../../services/popupService'
import getApiInstance from '../../../../ajax/generic-api'

import Pagination from "react-js-pagination";
import UpdatePopup from './update-popup'
import DetailPopup from './detail-popup'
import DeletePopup from './delete-popup'

class User extends RComponent {
    constructor(props) {
        super(props);
        this.state = {
            activePage: 1,
            totalItem: 0,
            itemsCountPerPage: 10,
            data: []
        }

        this.onMount(() => {
            this.loadData()
        })
    }

    loadData = () => {
        const { activePage, itemsCountPerPage } = this.state
        getApiInstance().getWithQueryStringAuth({
            url: '/User/UserListAll',
            data: {
                Take: itemsCountPerPage,
                Skip: (activePage - 1) * itemsCountPerPage,
                Condition: this.refCondition.value
            }
        }).then(res => {
            const { successful, result } = res
            if (successful) {
                const { total, data } = result
                this.setState({ totalItem: total, data })
            }
        }).catch(err => {
            console.error(err)
        })
    }

    handlePageChange = (pageNumber) => {
        this.setState({ activePage: pageNumber }, this.loadData);
    }

    send = () => {
        this.setState({ activePage: 1 }, this.loadData);
    }

    reset = () => {
        this.refCondition.value = ''
        this.setState({ activePage: 1 }, this.loadData);
    }

    addNewUser = () => {
        addPopup({
            title: 'TẠO MỚI NGƯỜI DÙNG',
            children: <UpdatePopup user={null} callback={this.reset} />
        })
    }

    updateUser = (user) => {
        addPopup({
            title: 'CHỈNH SỬA THÔNG TIN NGƯỜI DÙNG',
            children: <UpdatePopup user={user} callback={this.reset} />
        })
    }

    detailUser = (user) => {
        addPopup({
            title: 'THÔNG TIN NGƯỜI DÙNG',
            children: <DetailPopup user={user} callback={() => { this.updateUser(user) }} />,
            small: true
        })
    }

    deleteUser = (user) => {
        addPopup({
            title: 'XÓA NGƯỜI DÙNG',
            children: <DeletePopup userId={user.id} callback={this.reset} />,
            mini: true
        })
    }

    render() {
        const { activePage, totalItem, itemsCountPerPage, data } = this.state
        return (
            <div className="box">
                <h3>Quản lý user</h3>
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
                    onClick={this.addNewUser}
                ><i className="material-icons">add_circle_outline</i>Thêm mới</button>
                <div className="box-grid">
                    <table cellPadding={0} cellSpacing={0}>
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Mobile</th>
                                <th>Email</th>
                                <th>Skype</th>
                                <th>Age</th>
                                <th>LastModified</th>
                                <th>Role</th>
                                <th style={{ minWidth: 250 }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data && data.length ? data.map((item, index) => {
                                    return <tr key={index}>
                                        <td>{item.username && item.username}</td>
                                        <td>{item.mobile && item.mobile}</td>
                                        <td>{item.email && item.email}</td>
                                        <td>{item.skype && item.skype}</td>
                                        <td>{item.age && item.age}</td>
                                        <td>{item.lastModified && item.lastModified}</td>
                                        <td>{item.role && item.role}</td>
                                        <td>
                                            <div className="controls">
                                                <button className="btn-detail"
                                                    onClick={() => { this.detailUser(item) }}
                                                ><i className="material-icons">remove_red_eye</i>Xem</button>
                                                <button className="btn-edit"
                                                    onClick={() => { this.updateUser(item) }}
                                                ><i className="material-icons">build</i>Sửa</button>
                                                <button className="btn-remove"
                                                    onClick={() => { this.deleteUser(item) }}
                                                ><i className="material-icons">delete</i>Xóa</button>
                                            </div>
                                        </td>
                                    </tr>
                                }) : <tr>
                                        <td colSpan={6}>Không có dữ liệu</td>
                                    </tr>
                            }
                        </tbody>
                    </table>
                </div>
                <Pagination
                    activePage={activePage}
                    itemsCountPerPage={itemsCountPerPage}
                    totalItemsCount={totalItem}
                    pageRangeDisplayed={5}
                    onChange={this.handlePageChange}
                />
            </div >
        );
    }
}

export default User;
import React from 'react';
import { RComponent } from '../../../common/r-component'
import './style.scss'

import { addPopup } from '../../../services/popupService'
import getApiInstance from '../../../ajax/generic-api'

import DetailPopup from './detail-popup'
import DeletePopup from './delete-popup'
import { dateToStringFormatCultureVi } from '../../../utils/date-utils';

class Service extends RComponent {
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
            url: '/Home',
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

    detail = (item) => {
        addPopup({
            title: 'CHI TIẾT LIÊN HỆ & GÓP Ý',
            children: <DetailPopup item={item} callback={() => { this.deleteItem(item) }} />,
            small: true
        })
    }

    deleteItem = (item) => {
        addPopup({
            title: 'XÁC NHẬN XÓA',
            children: <DeletePopup itemId={item.id} callback={this.reset} />,
            mini: true
        })
    }

    render() {
        const { data } = this.state
        return (
            <div className="box">
                <h3>Danh sách liên hệ và góp ý</h3>
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
                                <th>Tiêu đề</th>
                                <th>Thời gian đăng</th>
                                <th style={{ width: 230, minWidth: 230 }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data && data.length ? data.map((item, index) => {
                                    return <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item.email || ""}</td>
                                        <td>{item.createdDate && dateToStringFormatCultureVi(item.createdDate)}</td>
                                        <td>
                                            <div className="controls">
                                                <button className="btn-detail"
                                                    onClick={() => { this.detail(item) }}
                                                ><i className="material-icons">remove_red_eye</i>Xem</button>
                                                <button className="btn-remove"
                                                    onClick={() => { this.deleteItem(item) }}
                                                ><i className="material-icons">delete</i>Xóa</button>
                                            </div>
                                        </td>
                                    </tr>
                                }) : <tr>
                                        <td colSpan={5}>Không có dữ liệu</td>
                                    </tr>
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default Service;
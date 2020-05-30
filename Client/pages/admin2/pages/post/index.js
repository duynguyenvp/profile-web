import React, { useEffect, useState, Fragment } from 'react'
import './style.scss'
import { CloseOutlined } from '@ant-design/icons';
import { Row, Col, Table, Input, Button, notification, Modal } from 'antd'
const { Column } = Table
const { confirm } = Modal;
import getApiInstance from '../../api/generic-api'
import { usePostStore, removePost, setPosts, addOrUpdatePost } from '../../store/postStore'
import PostPopup from './popup'
import { getAuthentication } from '../../store/authStore';

const openNotificationWithIcon = (type, content) => {
    notification[type]({
        message: 'Thông báo',
        description: content,
    })
}

const Post = props => {
    const [popupVisible, setPopupVisible] = useState(false)
    const [selectedPost, setSelectedPost] = useState(null)
    const [filterText, setFilterText] = useState(null)
    const auth = getAuthentication()
    const state = usePostStore();
    const { take, page, total, data } = state
    useEffect(() => {
        loadData(auth)
    }, [auth && auth.id])

    const loadData = (auth) => {
        auth && auth.id && getApiInstance().postWithForm({
            url: '/Post/GetAll',
            data: {
                Take: take,
                Skip: (page - 1) * take,
                Condition: filterText,
                UserId: auth.id
            }
        }).then(res => {
            const { successful, result } = res
            if (successful) {
                if (!result) return
                const { total, data } = result
                setPosts({ ...state, total, data })
            }
        }).catch(err => {
            console.error(err)
        })
    }

    const dataSource = data && data.map((item, index) => {
        return { ...item, key: item.id, index: index + 1 }
    })
    const closePopup = () => {
        setSelectedPost(null)
        setPopupVisible(false)
    }

    const remove = post => {
        confirm({
            title: 'Bạn có chắc chắn muốn xoá?',
            content: post.postName,
            okText: 'Đồng ý',
            okType: 'danger',
            cancelText: 'Huỷ',
            onOk() {
                getApiInstance().deleteWithFormAuth({
                    url: '/Post/DeletePost',
                    data: {
                        postId: post.id
                    }
                }).then(res => {
                    const { successful } = res
                    if (successful) {
                        openNotificationWithIcon('success', 'Thành công.')
                        removePost(post.id);
                    }
                }).catch(error => {
                    console.error(error)
                    openNotificationWithIcon('error', error)
                })
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    return (
        <Fragment>
            <Row>
                <Col span={12}>
                    <h1>QUẢN TRỊ TÀI KHOẢN</h1>
                </Col>
                <Col span={12}>
                    <Row type="flex" style={{ flexDirection: "row" }}>
                        <Input placeholder="Nhập từ khoá tìm kiếm"
                            style={{ flex: 1, marginRight: 16 }}
                            value={filterText || ''}
                            onChange={e => {
                                setFilterText(e.target.value)
                            }}
                            onPressEnter={loadData} />
                        <Button type="primary" onClick={() => {
                            setSelectedPost(null)
                            setPopupVisible(true)
                        }}>THÊM MỚI</Button>
                    </Row>
                </Col>
            </Row>
            <Row style={{ marginTop: 30 }}>
                <Table dataSource={dataSource}
                    pagination={{
                        pageSize: 10
                    }}
                    rowClassName="custom-row"
                    onRow={(record) => ({
                        onClick: () => {
                            setSelectedPost(record)
                            setPopupVisible(true)
                        }
                    })}
                    style={{ width: '100%' }}
                >
                    <Column title="#" dataIndex="index" key="index" />
                    <Column title="Tiêu đề" dataIndex="title" key="title" />
                    <Column title="Tags" dataIndex="tag" key="tag" />
                    <Column title="Ngày đăng" dataIndex="postTime" key="postTime" />
                    <Column
                        title=""
                        key="action"
                        width={56}
                        render={(text, record) => (
                            <Button className="btn-remove"
                                size="small"
                                type="danger"
                                icon={<CloseOutlined />}
                                onClick={e => {
                                    e.stopPropagation()
                                    remove(record)
                                }}></Button>
                        )}
                    />
                </Table>
            </Row>
            <PostPopup onClose={closePopup}
                visible={popupVisible}
                post={selectedPost}
                callback={() => {
                    setPosts({ ...state, page: 1 })
                    loadData()
                }} />
        </Fragment>
    );
}

export default Post;
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Modal, Button, Row, Col, Input, notification } from 'antd'
const { Search } = Input
import { UploadOutlined } from '@ant-design/icons'
import getApiInstance from '../../api/generic-api'
import './style.scss'
import ImageItem from './image-item'
import imageDefault from '../../assets/images/imageDefault.jpg'

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    })
}

const openNotificationWithIcon = (type, content) => {
    notification[type]({
        message: 'Thông báo',
        description: content,
    });
};

const ImageManager = ({ value, visible, callback, close }) => {
    const [selected, setSelected] = useState(null)
    const [images, setImages] = useState([])

    useEffect(() => {
        loadImages()
    }, [])

    const loadImages = () => {
        getApiInstance().getWithQueryStringAuth({
            url: '/Image'
        }).then(res => {
            if (res && res.successful) {
                setImages(res.result)
            }
        }).catch(err => {
            console.error(err)
        })
    }

    const readAsDataURL = (file) => {
        return new Promise((resolve, reject) => {
            let fileReader = new FileReader();
            fileReader.onload = async () => {
                // let thumb = await resizeImage(fileReader.result)
                return resolve({ data: fileReader.result, name: file.name, size: file.size, type: file.type });
            }
            fileReader.readAsDataURL(file);
        })
    }

    const uploadImage = (base64image) => {
        getApiInstance().uploadBase64Image({
            base64image
        }).then(res => {
            const { successful, src, error } = res || {}
            if (successful) {
                setSelected(src)
                loadImages()
            } else {
                openNotificationWithIcon('error', 'Đã xảy ra lỗi. ' + error)
            }
        }).catch(error => {
            openNotificationWithIcon('error', 'Đã xảy ra lỗi. ' + error)
        })
    }

    const handleImageChange = async event => {
        let files = [...event.target.files];

        if (files && files.length) {
            const file = files[0]
            let imageResult = await readAsDataURL(file);
            uploadImage(imageResult.data)
        }
    }

    const handleImageRemove = img => {
        getApiInstance().deleteImage(img).then(res => {
            const { successful, src, error } = res
            if (successful) {
                loadImages()
                if (img.path === selected) {
                    setSelected(null)
                }
            } else {
                openNotificationWithIcon('error', 'Đã xảy ra lỗi. ')
            }
        }).catch(error => {
            openNotificationWithIcon('error', 'Đã xảy ra lỗi. ')
        })
    }

    const handleImageSelected = img => {
        setSelected(img.path)
    }

    const testImage = (url, timeoutT) => {
        return new Promise(function (resolve, reject) {
            var timeout = timeoutT || 5000;
            var timer, img = new Image();
            img.onerror = img.onabort = function () {
                clearTimeout(timer);
                reject("error");
            };
            img.onload = function () {
                clearTimeout(timer);
                resolve("success");
            };
            timer = setTimeout(function () {
                // reset .src to invalid URL so it stops previous
                // loading, but doens't trigger new load
                img.src = "//!!!!/noexist.jpg";
                reject("timeout");
            }, timeout);
            img.src = url;
        });
    }

    const handleUploadFromUrl = (url) => {
        if (!url) {
            return;
        }

        testImage(url).then(res => {
            if (res === 'success') {
                getApiInstance().uploadImageFromUrl({
                    url
                }).then(res => {
                    const { successful, src, error } = res || {}
                    if (successful) {
                        setSelected(src)
                        loadImages()
                    } else {
                        openNotificationWithIcon('error', 'Đã xảy ra lỗi. ' + error)
                    }
                }).catch(error => {
                    openNotificationWithIcon('error', 'Đã xảy ra lỗi. ' + error)
                })
            } else {
                openNotificationWithIcon('error', 'Không thể tải ảnh. Vui lòng kiểm tra lại dường dẫn.')
                setUrl('')
            }
        }).catch(err => {
            openNotificationWithIcon('error', 'Không thể tải ảnh. Vui lòng kiểm tra lại dường dẫn.')
        })
    }

    const handleOk = () => {
        callback(selected);
        close()
    }

    const handleCancel = () => {
        close()
    }
    let avatarStyle = {
        backgroundImage: `url("${selected || imageDefault}")`
    }
    return (<Modal
        style={{ top: 30 }}
        width={900}
        visible={visible}
        title="Quản lý ảnh"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
            selected && <Button key="submit" type="primary"
                onClick={handleOk}>Chọn</Button>,
            <Button key="back" onClick={handleCancel}>Đóng</Button>,
        ]}
    >
        <Row>
            <Col span={14} push={10}>
                <div className="list-images">
                    {
                        images && images.map((item, index) => {
                            return <ImageItem key={index}
                                image={item}
                                isSelected={item.id === selected}
                                remove={() => { handleImageRemove(item) }}
                                callback={() => { handleImageSelected(item) }} />
                        })
                    }
                </div>
            </Col>
            <Col span={10} pull={14}>
                <Row>
                    <div className="image-selected" style={avatarStyle}></div>
                </Row>
                <Row>
                    <label>Từ máy tính</label>
                    <label htmlFor="input-image" className="input-button">
                        <UploadOutlined /> Upload ảnh mới
                    </label>
                    <input type="file"
                        id="input-image"
                        onChange={handleImageChange} />
                </Row>
                <Row>
                    <label>Từ Internet</label>
                    <Search
                        className="input-from-url"
                        placeholder="Nhập đường dẫn ..."
                        enterButton="Upload"
                        size="large"
                        allowClear
                        onSearch={url => { handleUploadFromUrl(url) }}
                    />
                </Row>
            </Col>
        </Row>
    </Modal>)
}

ImageManager.propTypes = {
    value: PropTypes.string,
    callback: PropTypes.func,
    close: PropTypes.func,
}
ImageManager.defaultProps = {
    value: '',
    callback: () => { },
    close: () => { }
}

export default ImageManager
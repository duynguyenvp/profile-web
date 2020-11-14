import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Modal, Button, Row, Col, Input, notification } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import getApiInstance from "../../api/generic-api";
import "./style.scss";
import ImageItem from "./image-item";
import imageDefault from "../../assets/images/imageDefault.jpg";

const { Search } = Input;

const openNotificationWithIcon = (type, content) => {
  notification[type]({
    message: "Thông báo",
    description: content
  });
};

const ImageManager = ({ visible, callback, close }) => {
  const [selected, setSelected] = useState(null);
  const [images, setImages] = useState([]);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = () => {
    getApiInstance()
      .getWithQueryStringAuth({
        url: "/Image"
      })
      .then(res => {
        if (res && res.successful) {
          setImages(res.result);
        }
      })
      .catch(err => {
        console.error(err);
      });
  };

  const readAsDataURL = file =>
    new Promise(resolve => {
      const fileReader = new FileReader();
      fileReader.onload = async () =>
        resolve({
          data: fileReader.result,
          name: file.name,
          size: file.size,
          type: file.type
        });
      fileReader.readAsDataURL(file);
    });

  const uploadImage = base64image => {
    getApiInstance()
      .uploadBase64Image({
        base64image
      })
      .then(res => {
        const { successful, src, error } = res || {};
        if (successful) {
          setSelected(src);
          loadImages();
        } else {
          openNotificationWithIcon("error", `Đã xảy ra lỗi. ${error}`);
        }
      })
      .catch(error => {
        openNotificationWithIcon("error", `Đã xảy ra lỗi. ${error}`);
      });
  };

  const handleImageChange = async event => {
    const files = [...event.target.files];

    if (files && files.length) {
      const file = files[0];
      const imageResult = await readAsDataURL(file);
      uploadImage(imageResult.data);
    }
  };

  const handleImageRemove = img => {
    getApiInstance()
      .deleteImage(img)
      .then(res => {
        const { successful } = res;
        if (successful) {
          loadImages();
          if (img.path === selected) {
            setSelected(null);
          }
        } else {
          openNotificationWithIcon("error", "Đã xảy ra lỗi. ");
        }
      })
      .catch(() => {
        openNotificationWithIcon("error", "Đã xảy ra lỗi. ");
      });
  };

  const handleImageSelected = img => {
    setSelected(img.path);
  };

  const testImage = (url, timeoutT) =>
    new Promise((resolve, reject) => {
      const timeout = timeoutT || 5000;
      let timer;
      const img = new Image();
      function error() {
        clearTimeout(timer);
        reject(new Error("error"));
      }
      img.onerror = error;
      img.onabort = error;
      img.onload = () => {
        clearTimeout(timer);
        resolve("success");
      };
      timer = setTimeout(() => {
        // reset .src to invalid URL so it stops previous
        // loading, but doens't trigger new load
        img.src = "//!!!!/noexist.jpg";
        reject(new Error("timeout"));
      }, timeout);
      img.src = url;
    });

  const handleUploadFromUrl = url => {
    if (!url) {
      return;
    }

    testImage(url)
      .then(res => {
        if (res === "success") {
          getApiInstance()
            .uploadImageFromUrl({
              url
            })
            .then(res => {
              const { successful, src, error } = res || {};
              if (successful) {
                setSelected(src);
                loadImages();
              } else {
                openNotificationWithIcon("error", `Đã xảy ra lỗi. ${error}`);
              }
            })
            .catch(error => {
              openNotificationWithIcon("error", `Đã xảy ra lỗi. ${error}`);
            });
        } else {
          openNotificationWithIcon(
            "error",
            "Không thể tải ảnh. Vui lòng kiểm tra lại dường dẫn."
          );
        }
      })
      .catch(() => {
        openNotificationWithIcon(
          "error",
          "Không thể tải ảnh. Vui lòng kiểm tra lại dường dẫn."
        );
      });
  };

  const handleOk = () => {
    callback(selected);
    close();
  };

  const handleCancel = () => {
    close();
  };
  const avatarStyle = {
    backgroundImage: `url("${selected || imageDefault}")`
  };
  return (
    <Modal
      style={{ top: 30 }}
      width={900}
      visible={visible}
      title="Quản lý ảnh"
      onOk={handleOk}
      onCancel={handleCancel}
      footer={[
        selected && (
          <Button key="submit" type="primary" onClick={handleOk}>
            Chọn
          </Button>
        ),
        <Button key="back" onClick={handleCancel}>
          Đóng
        </Button>
      ]}
    >
      <Row>
        <Col span={14} push={10}>
          <div className="list-images">
            {images &&
              images.map((item, index) => (
                <ImageItem
                  key={index}
                  image={item}
                  isSelected={item.id === selected}
                  remove={() => {
                    handleImageRemove(item);
                  }}
                  callback={() => {
                    handleImageSelected(item);
                  }}
                />
              ))}
          </div>
        </Col>
        <Col span={10} pull={14}>
          <Row>
            <div className="image-selected" style={avatarStyle} />
          </Row>
          <Row>
            <label>Từ máy tính</label>
            <label htmlFor="input-image" className="input-button">
              <UploadOutlined /> Upload ảnh mới
            </label>
            <input type="file" id="input-image" onChange={handleImageChange} />
          </Row>
          <Row>
            <label>Từ Internet</label>
            <Search
              className="input-from-url"
              placeholder="Nhập đường dẫn ..."
              enterButton="Upload"
              size="large"
              allowClear
              onSearch={url => {
                handleUploadFromUrl(url);
              }}
            />
          </Row>
        </Col>
      </Row>
    </Modal>
  );
};

ImageManager.propTypes = {
  callback: PropTypes.func,
  close: PropTypes.func
};
ImageManager.defaultProps = {
  callback: () => {},
  close: () => {}
};

export default ImageManager;

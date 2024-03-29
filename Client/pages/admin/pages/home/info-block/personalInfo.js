import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Form, Input, Button, Space, notification } from "antd";
import { EditOutlined } from "@ant-design/icons";
import EditorComponent from "../../../components/editor";
import { getAuthentication } from "../../../store/authStore";
import defaultAvatar from "../../../assets/images/avatar.jpg";
import getApiInstance from "../../../api/generic-api";

const openNotificationWithIcon = (type, content) => {
  notification[type]({
    message: "Thông báo",
    description: content
  });
};
const PersonalInfoBlock = ({ personalInfo }) => {
  const [key, setKey] = useState(1);
  const [user, setUser] = useState(personalInfo);
  const { fullName, jobTitle, email, mobile, skype, address, about, avatar } =
    user || {};
  const [form] = Form.useForm();

  const onReset = () => {
    setKey(key + 1);
    form.resetFields();
  };
  const onFinish = values => {
    handleSave(values);
  };

  useEffect(() => {
    setUser(personalInfo);
    setKey(key + 1);
  }, [personalInfo]);

  const refIpAvatar = useRef();

  const handleSave = data => {
    const auth = getAuthentication();
    const username = auth && auth.username;
    getApiInstance()
      .postWithFormAuth({
        url: "/User/UpdateUserInfo",
        data: { ...user, ...data, UserName: username }
      })
      .then(res => {
        const { successful, errorMessage } = res;
        if (successful) {
          openNotificationWithIcon("success", "Lưu thành công!!!");
        } else {
          openNotificationWithIcon(
            "error",
            `Lỗi: ${errorMessage || "Không xác định"}.`
          );
        }
      })
      .catch(error => {
        console.error(error);
        openNotificationWithIcon("error", `Đã xảy ra lỗi. ${error}`);
      });
  };

  const resizeImage = dataSrc => {
    const img = new Image();

    const maxWidth = 300;
    const maxHeight = 300;

    img.onload = () => {
      let { width } = img;
      let { height } = img;

      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else if (height > maxHeight) {
        width *= maxHeight / height;
        height = maxHeight;
      }

      const oc = document.createElement("canvas");
      const octx = oc.getContext("2d");

      oc.width = width;
      oc.height = height;
      octx.drawImage(img, 0, 0, oc.width, oc.height);
      const result = oc.toDataURL("image/jpg");
      setUser({ ...user, avatar: result });
    };
    img.src = dataSrc;
  };

  const changeAvatar = () => {
    const filesToUpload = refIpAvatar.current.files;
    const file = filesToUpload[0];
    const reader = new FileReader();
    reader.onload = e => {
      resizeImage(e.target.result);
    };
    reader.onerror = error => {
      console.error(error);
      refIpAvatar.current.value = null;
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const avatarStyle = {
    backgroundImage: `url("${avatar || defaultAvatar}")`
  };

  return (
    <Form
      key={key}
      layout="vertical"
      form={form}
      name="advanced_search"
      className="ant-advanced-search-form"
      onFinish={onFinish}
    >
      <Row gutter={24} justify="center" style={{ marginBottom: 16 }}>
        <div className="avatar" style={avatarStyle}>
          <label htmlFor="input-avatar" className="input-avatar-button">
            <EditOutlined />
          </label>
          <input
            type="file"
            id="input-avatar"
            ref={refIpAvatar}
            onChange={changeAvatar}
          />
        </div>
      </Row>
      <Row gutter={24}>
        <Col md={12} span={24}>
          <Form.Item
            name="fullName"
            label="Tên đầy đủ"
            initialValue={fullName}
            rules={[
              {
                required: true,
                message: "Vui lòng nhập tên!"
              }
            ]}
          >
            <Input placeholder="Tên ..." />
          </Form.Item>
        </Col>
        <Col md={12} span={24}>
          <Form.Item
            name="jobTitle"
            label="Nghề nghiệp"
            initialValue={jobTitle}
            rules={[
              {
                required: true,
                message: "Vui lòng nhập nghề nghiệp!"
              }
            ]}
          >
            <Input placeholder="Nghề nghiệp ..." />
          </Form.Item>
        </Col>
        <Col md={12} span={24}>
          <Form.Item
            name="email"
            label="Email"
            initialValue={email}
            rules={[
              {
                required: true,
                message: "Vui lòng nhập email!"
              }
            ]}
          >
            <Input placeholder="Email ..." />
          </Form.Item>
        </Col>
        <Col md={12} span={24}>
          <Form.Item
            name="mobile"
            label="Số điện thoại"
            initialValue={mobile}
            rules={[
              {
                required: true,
                message: "Vui lòng nhập số điện thoại!"
              }
            ]}
          >
            <Input placeholder="Số điện thoại ..." />
          </Form.Item>
        </Col>
        <Col md={12} span={24}>
          <Form.Item name="skype" label="Skype" initialValue={skype}>
            <Input placeholder="Tên tỉnh hoặc thành phố ..." />
          </Form.Item>
        </Col>
        <Col md={12} span={24}>
          <Form.Item name="address" label="Địa chỉ" initialValue={address}>
            <Input placeholder="Địa chỉ ..." />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={24}>
          <span style={{ marginBottom: 16 }}>Giới thiệu bản thân</span>
          <EditorComponent
            html={about}
            callback={content => {
              setUser({ ...user, about: content });
            }}
          />
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={24} style={{ textAlign: "right", marginTop: 16 }}>
          <Space>
            <Button type="primary" htmlType="submit">
              Lưu
            </Button>
            <Button onClick={onReset}>Làm mới</Button>
          </Space>
        </Col>
      </Row>
    </Form>
  );
};

export default PersonalInfoBlock;

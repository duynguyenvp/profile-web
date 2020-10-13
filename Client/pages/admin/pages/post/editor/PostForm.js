import React from "react";
import { Form, Button, Input, notification, Layout } from "antd";
import getApiInstance from "../../../api/generic-api";
import { removeObject } from "../../../utils/localForage";
import { getAuthentication } from "../../../store/authStore";

const openNotificationWithIcon = (type, content) => {
  notification[type]({
    message: "Thông báo",
    description: content,
  });
};
const PostForm = ({ onClose, callback, post, content, delta }) => {
  const onFinish = (values) => {
    let data = { ...values };
    const user = getAuthentication();
    data = { ...data, avatar: "", delta: JSON.stringify(delta), content };

    if (post && post.id) {
      data = { ...post, ...data };
    } else {
      data = {
        ...data,
        avatar: "string",
        postTime: new Date(),
        isDelete: false,
        userName: user.userName,
        userId: user.id,
        categoryId: null, //Thêm category
      };
    }
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        if (typeof data[key] != "boolean" && !data[key]) {
          delete data[key];
        }
      }
    }
    getApiInstance()
      .postWithFormAuth({
        url: "/Post/InsertOrUpdate",
        data,
      })
      .then((res) => {
        if (res.successful) {
          removeObject("post-content");
          openNotificationWithIcon("success", "Thành công!!!");
          onClose();
          callback();
        } else {
          openNotificationWithIcon(
            "error",
            "Đã xảy ra lỗi: " + (res.errorMessage || "Không xác định")
          );
        }
      })
      .catch((error) => {
        console.error(error);
        openNotificationWithIcon("error", error);
      });
  };

  const { id, tag, title } = post || {};

  return (
    <Form
      layout="vertical"
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 24 }}
      onFinish={onFinish}
    >
      <Form.Item
        name="title"
        label="Tiêu đề"
        labelCol={24}
        initialValue={title}
        rules={[
          {
            required: true,
            message: "Vui lòng nhập đề!",
          },
        ]}
      >
        <Input placeholder="Nhập tiêu đề ..." />
      </Form.Item>
      <Form.Item
        name="tag"
        label="Tags"
        labelCol={24}
        initialValue={tag}
        rules={[
          {
            required: true,
            message: "Vui lòng nhập tags!",
          },
        ]}
      >
        <Input placeholder="Nhập họ tags ..." />
      </Form.Item>

      <Form.Item wrapperCol={{ span: 12 }}>
        <Button type="primary" htmlType="submit">
          Lưu
        </Button>
      </Form.Item>
    </Form>
  );
};

export default PostForm;

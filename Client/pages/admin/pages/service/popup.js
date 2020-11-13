import React from "react";
import {
  Form, Drawer, Button, Input, notification
} from "antd";
import { addOrUpdateService } from "../../store/serviceStore";
import getApiInstance from "../../api/generic-api";

const openNotificationWithIcon = (type, content) => {
  notification[type]({
    message: "Thông báo",
    description: content
  });
};
const ServiceForm = ({ onClose, service }) => {
  const { id, serviceName, serviceDescription } = service || {};
  const onFinish = values => {
    const data = { ...values };

    const rqData = {
      Id: id || null,
      ServiceName: data.serviceName,
      ServiceDescription: data.serviceDescription,
      IsDelete: false
    };
    Object.keys(rqData).forEach(key => {
      if (Object.prototype.hasOwnProperty.call(rqData, key)) {
        if (typeof rqData[key] !== "boolean" && !rqData[key]) {
          delete rqData[key];
        }
      }
    });
    getApiInstance()
      .postWithFormAuth({
        url: "/User/UserServiceAddOrUpdate",
        data: rqData
      })
      .then(res => {
        if (res.successful) {
          addOrUpdateService(res.result);
          onClose();
          openNotificationWithIcon("success", "Thành công!!!");
        } else {
          openNotificationWithIcon(
            "error",
            `Đã xảy ra lỗi: ${res.errorMessage || "Không xác định"}`
          );
        }
      })
      .catch(error => {
        console.error(error);
        openNotificationWithIcon("error", error);
      });
  };
  return (
    <Form labelCol={{ span: 5 }} wrapperCol={{ span: 12 }} onFinish={onFinish}>
      <Form.Item
        name="serviceName"
        label="Tên"
        initialValue={serviceName}
        rules={[
          {
            required: true,
            message: "Vui lòng nhập họ tên!"
          }
        ]}
      >
        <Input placeholder="Nhập họ tên ..." />
      </Form.Item>
      <Form.Item
        name="serviceDescription"
        label="Mô tả"
        hasFeedback
        initialValue={serviceDescription}
      >
        <Input placeholder="Nhập mô tả ..." />
      </Form.Item>
      <Form.Item wrapperCol={{ span: 12, offset: 5 }}>
        <Button type="primary" htmlType="submit">
          Lưu
        </Button>
      </Form.Item>
    </Form>
  );
};

const ServicePopup = ({ visible, onClose, service }) => (
  <Drawer
    title={`${
      service && Object.keys(service) ? "Cập nhật" : "Thêm mới"
    } dịch vụ`}
    width={720}
    onClose={onClose}
    visible={visible}
    destroyOnClose
    bodyStyle={{ paddingBottom: 80 }}
  >
    <ServiceForm onClose={onClose} service={service} />
  </Drawer>
);

export default ServicePopup;

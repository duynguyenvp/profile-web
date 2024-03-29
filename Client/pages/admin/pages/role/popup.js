import React from "react";
import {
  Form, Drawer, Button, Input, Select, notification
} from "antd";
import { number } from "prop-types";
import { addOrUpdateRole } from "../../store/roleStore";
import getApiInstance from "../../api/generic-api";

const { Option } = Select;

const openNotificationWithIcon = (type, content) => {
  notification[type]({
    message: "Thông báo",
    description: content
  });
};
const RoleForm = ({ onClose, role, allServices }) => {
  const onFinish = values => {
    const { services, ...data } = values;

    const rqData = {
      Id: (role && role.id) || null,
      roleName: data.roleName,
      roleDescription: data.roleDescription,
      roleLevel: data.roleLevel,
      IsDelete: false,
      Services:
        allServices.filter(service => services.includes(service.id)) || []
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
        url: "/User/UserRoleAddOrUpdate",
        data: rqData
      })
      .then(res => {
        if (res.successful) {
          openNotificationWithIcon("success", "Thành công!");
          addOrUpdateRole(res.result);
          onClose();
        } else {
          openNotificationWithIcon(
            "error",
            `Đã xảy ra lỗi: ${res.errorMessage || "Không xác định"}`
          );
        }
      })
      .catch(err => {
        console.error("Lỗi", err);
        openNotificationWithIcon("error", err);
      });
  };

  const {
    roleName, roleDescription, roleLevel, services
  } = role || {};
  const initialServiceValue = (services && services.map(service => `${service.id}`)) || [];
  const options = allServices.map((service, index) => (
    <Option key={index} value={service.id}>
      {service.serviceName}
    </Option>
  )) || [];
  return (
    <Form labelCol={{ span: 5 }} wrapperCol={{ span: 12 }} onFinish={onFinish}>
      <Form.Item
        name="roleName"
        label="Tên"
        initialValue={roleName}
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
        name="roleDescription"
        label="Mô tả"
        hasFeedback
        initialValue={roleDescription}
      >
        <Input placeholder="Nhập mô tả ..." />
      </Form.Item>
      <Form.Item
        name="roleLevel"
        label="Cấp bậc"
        hasFeedback
        initialValue={roleLevel}
      >
        <Input type={number} placeholder="Nhập mô tả ..." />
      </Form.Item>
      <Form.Item
        name="services"
        label="Dịch vụ"
        hasFeedback
        initialValue={initialServiceValue}
        rules={[{ required: true, message: "Vui lòng chọn dịch vụ!" }]}
      >
        <Select mode="multiple" placeholder="Dịch vụ">
          {options}
        </Select>
      </Form.Item>
      <Form.Item wrapperCol={{ span: 12, offset: 5 }}>
        <Button type="primary" htmlType="submit">
          Lưu
        </Button>
      </Form.Item>
    </Form>
  );
};

const RolePopup = ({
  visible, onClose, role, services
}) => (
  <Drawer
    title={`${role && Object.keys(role) ? "Cập nhật" : "Thêm mới"} quyền`}
    width={720}
    onClose={onClose}
    visible={visible}
    destroyOnClose
    bodyStyle={{ paddingBottom: 80 }}
  >
    <RoleForm onClose={onClose} role={role} allServices={services} />
  </Drawer>
);

export default RolePopup;

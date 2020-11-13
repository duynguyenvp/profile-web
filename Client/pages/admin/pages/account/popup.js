import React from "react";
import {
  Form, Drawer, Button, Input, Select, notification
} from "antd";
import { addOrUpdateAccount } from "../../store/accountStore";
import getApiInstance from "../../api/generic-api";
import "@ant-design/compatible/assets/index.css";

const { Option } = Select;
const openNotificationWithIcon = (type, content) => {
  notification[type]({
    message: "Thông báo",
    description: content
  });
};
const AccountForm = ({ onClose, account, dataRoles }) => {
  const onFinish = values => {
    const role = dataRoles.find(f => f.id === values.role);
    getApiInstance()
      .postWithFormAuth({
        url: "/User/UserSetRole",
        data: {
          UserId: account.id,
          RoleId: values.role
        }
      })
      .then(res => {
        if (res.successful) {
          openNotificationWithIcon("success", res.result || "Thành công!");
          addOrUpdateAccount({
            ...account,
            role: role.roleName,
            roleId: role.id
          });
          onClose();
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

  const { roleId, username, email } = account || {};
  const options = dataRoles.map((_role, index) => (
    <Option key={index} value={_role.id}>
      {_role.roleName}
    </Option>
  )) || [];
  return (
    <Form labelCol={{ span: 5 }} wrapperCol={{ span: 12 }} onFinish={onFinish}>
      <Form.Item name="username" label="Tài khoản" initialValue={username}>
        <Input disabled />
      </Form.Item>
      <Form.Item name="email" label="Email" initialValue={email}>
        <Input disabled />
      </Form.Item>
      <Form.Item
        name="role"
        label="Quyền"
        hasFeedback
        initialValue={roleId}
        rules={[{ required: true, message: "Vui lòng chọn quyền!" }]}
      >
        <Select allowClear placeholder="Quyền">
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

const AccountPopup = ({
  visible, onClose, account, dataRoles
}) => (
  <Drawer
    title="Tạo tài khoản mới"
    width={720}
    onClose={onClose}
    visible={visible}
    destroyOnClose
    bodyStyle={{ paddingBottom: 80 }}
  >
    <AccountForm onClose={onClose} account={account} dataRoles={dataRoles} />
  </Drawer>
);

export default AccountPopup;

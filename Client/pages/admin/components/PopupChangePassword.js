import React, { useState } from "react";
import { Modal, Form, Input, notification } from "antd";
import getApiInstance from "../api/generic-api";
import { getAuthentication } from "../store/authStore";

const openNotificationWithIcon = (type, content) => {
  notification[type]({
    message: "Thông báo",
    description: content
  });
};

const layout = {
  labelCol: {
    span: 8
  },
  wrapperCol: {
    span: 16
  }
};

function validatePassword(pass) {
  if (pass) {
    return {
      validateStatus: "success",
      errorMsg: null
    };
  }
  return {
    validateStatus: "error",
    errorMsg: "Vui lòng nhập mật khẩu hiện tại!"
  };
}
function validateNewPassword(pass) {
  if (pass) {
    return {
      validateStatus: "success",
      errorMsg: null
    };
  }
  return {
    validateStatus: "error",
    errorMsg: "Vui lòng nhập mật khẩu mới!"
  };
}
function validateConfirmPassword(confirmPassword, newPassword) {
  if (!confirmPassword) {
    return {
      validateStatus: "error",
      errorMsg: "Vui lòng nhập mật khẩu mới!"
    };
  }
  if (confirmPassword !== newPassword) {
    return {
      validateStatus: "error",
      errorMsg: "Mật khẩu mới không trùng khớp!"
    };
  }
  return {
    validateStatus: "success",
    errorMsg: null
  };
}

function defaultValue() {
  return {
    value: ""
  };
}
const ChangePassword = ({ visible, onClose, sigout }) => {
  const [password, setPassword] = useState(defaultValue());
  const [newPassword, setNewPassword] = useState(defaultValue());
  const [confirmPassword, setConfirmPassword] = useState(defaultValue());

  const onPassChange = value => {
    setPassword({
      ...validatePassword(value),
      value
    });
  };

  const onNewPassChange = value => {
    setNewPassword({
      ...validateNewPassword(value),
      value
    });
  };

  const onConfirmPassChange = value => {
    setConfirmPassword({
      ...validateConfirmPassword(value, newPassword.value),
      value
    });
  };

  const validate = () => {
    setPassword({
      ...password,
      ...validatePassword(password.value)
    });
    setNewPassword({
      ...newPassword,
      ...validateNewPassword(newPassword.value)
    });
    setConfirmPassword({
      ...confirmPassword,
      ...validateConfirmPassword(confirmPassword.value, newPassword.value)
    });
    if (
      password.validateStatus !== "success" ||
      newPassword.validateStatus !== "success" ||
      confirmPassword.validateStatus !== "success"
    ) {
      return false;
    }
    return true;
  };

  const handleOk = () => {
    if (validate()) {
      const auth = getAuthentication();
      if (!auth) {
        openNotificationWithIcon(
          "error",
          "Đã xảy ra lỗi, vui lòng đăng nhập lại!"
        );
        return;
      }
      getApiInstance()
        .postWithFormAuth({
          url: "/User/ChangePassword",
          data: {
            UserName: auth.username,
            CurrentPassword: password.value,
            NewPassword: confirmPassword.value
          }
        })
        .then(res => {
          const { successful, errorMessage, result } = res;
          if (successful) {
            const descriptioin = (
              <p>
                {result || "Đổi mật khẩu thành công!"} <br />
                Vui lòng đăng nhập lại sau 3s.
              </p>
            );
            openNotificationWithIcon("success", descriptioin);
            setTimeout(() => {
              sigout();
            }, 3000);
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
    }
  };

  const handleReset = () => {
    onClose();
  };
  return (
    <Modal
      title="Đổi mật khẩu"
      visible={visible}
      cancelText="Đóng"
      okText="Lưu"
      onOk={handleOk}
      onCancel={handleReset}
    >
      <Form {...layout} name="basic">
        <Form.Item
          label="Mật khẩu"
          hasFeedback
          validateStatus={password.validateStatus}
          help={password.errorMsg}
        >
          <Input.Password
            allowClear
            placeholder="Mật khẩu ..."
            value={password.value}
            onChange={event => {
              onPassChange(event.target.value);
            }}
          />
        </Form.Item>
        <Form.Item
          label="Mật khẩu mới"
          hasFeedback
          validateStatus={newPassword.validateStatus}
          help={newPassword.errorMsg}
        >
          <Input.Password
            allowClear
            placeholder="Mật khẩu mới ..."
            value={newPassword.value}
            onChange={event => {
              onNewPassChange(event.target.value);
            }}
          />
        </Form.Item>
        <Form.Item
          label="Nhập lại mật khẩu mới"
          hasFeedback
          validateStatus={confirmPassword.validateStatus}
          help={confirmPassword.errorMsg}
        >
          <Input.Password
            allowClear
            placeholder="Mật khẩu mới ..."
            value={confirmPassword.value}
            onChange={event => {
              onConfirmPassChange(event.target.value);
            }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ChangePassword;

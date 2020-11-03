import React from "react";
import { notification } from "antd";
import getApiInstance from "../../../api/generic-api";
import { getAuthentication } from "../../../store/authStore";

export const openNotificationWithIcon = (type, content) => {
  notification[type]({
    message: "Thông báo",
    description: content,
  });
};

export const loadData = () => {
  return new Promise((resolve, reject) => {
    getApiInstance()
      .getWithQueryStringAuth({
        url: "/Portfolio/GetAll",
      })
      .then((res) => {
        const { successful, result } = res;
        if (successful) {
          if (result && result.length) {
            resolve({ result: result[0] });
          } else {
            resolve({ isEmpty: true });
          }
        } else {
          resolve({ error: "Đã xảy ra lỗi khi tải dữ liệu." });
        }
      })
      .catch((error) => {
        reject(error);
        console.error(error);
      });
  });
};

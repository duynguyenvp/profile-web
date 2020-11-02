import getApiInstance from "../../ajax/generic-api";
import { addAlert } from "../../services/alertService";
import { getState } from "../../services/userService";
import { dateToStringFormatCultureVi } from "../../utils/date-utils";

export const getResumeData = (Username) => {
  let options = {
    url: "/Portfolio/ForHomePage",
  };
  if (Username) {
    options = {
      ...options,
      data: {
        Username,
      },
    };
  }
  return new Promise((resolve, reject) => {
    getApiInstance()
      .getWithQueryString(options)
      .then((res) => {
        const { successful, result } = res;
        if (successful) {
          if (result && result.length) {
            resolve({ ...result[0] });
            return;
          }
        }
        reject("Something went wrong!");
      })
      .catch((error) => {
        reject(error);
        console.error(error);
      });
  });
};

export const resumePrint = (username) => {
  return new Promise((resolve, reject) => {
    getApiInstance("/resume/getprint")
      .getPrint(
        {
          url: `/resume/print/${username || ""}`,
        },
        {
          responseType: "arraybuffer",
          headers: {
            Accept: "application/pdf",
          },
          timeout: 15 * 1000,
        }
      )
      .then((res) => {
        const blob = new Blob([res], { type: "application/pdf" });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = `${
          username ? username + "-" : ""
        }resume-${dateToStringFormatCultureVi(new Date())}.pdf`;
        link.click();
        setTimeout(() => {
          resolve();
        }, 300);
      })
      .catch((err) => {
        console.error(err);
        addAlert({ type: "error", message: "Đã xảy ra lỗi!" })
        reject();
      });
  });
};

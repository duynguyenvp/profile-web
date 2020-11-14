import getApiInstance from "../../ajax/generic-api";
import { addAlert } from "../../services/alertService";
import { dateToStringFormatCultureVi } from "../../utils/date-utils";

export const getLastPost = username => new Promise((resolve, reject) => {
  getApiInstance()
    .postWithForm({
      url: "/post/GetLastPost",
      data: {
        Username: username
      }
    })
    .then(res => {
      if (res.successful && res.result) {
        resolve(res.result);
      } else {
        reject();
      }
    })
    .catch(err => {
      console.error(err);
      reject(err);
    });
});

export const resumePrint = username => new Promise((resolve, reject) => {
  getApiInstance("/resume/getprint")
    .getPrint(
      {
        url: `/resume/print/${username || ""}`
      },
      {
        responseType: "arraybuffer",
        headers: {
          Accept: "application/pdf"
        },
        timeout: 15 * 1000
      }
    )
    .then(res => {
      const blob = new Blob([res], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `${
        username ? `${username}-` : ""
      }resume-${dateToStringFormatCultureVi(new Date())}.pdf`;
      link.click();
      setTimeout(() => {
        resolve();
      }, 300);
    })
    .catch(() => {
      addAlert({ type: "error", message: "Đã xảy ra lỗi!" });
      reject();
    });
});

import React from "react";
import { notification } from "antd";
import getApiInstance from "../../api/generic-api";
import { getAuthentication } from "../../store/authStore";

const openNotificationWithIcon = (type, content) => {
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

export const insertNewSkill = (portfolioId) => {
  const auth = getAuthentication();
  const data = {
    id: portfolioId,
    userId: auth.id,
    portfolioSkills: [
      {
        skillName: "",
        level: 1,
        detail: "",
      },
    ],
  };

  return new Promise((resolve, reject) => {
    getApiInstance()
      .postWithBodyAuth({
        url: "/Portfolio/InsertOrUpdateSkills",
        data,
      })
      .then((res) => {
        const { successful, errorMessage, result } = res;
        if (successful) {
          resolve(result);
        } else {
          openNotificationWithIcon(
            "error",
            "Lỗi: " + (errorMessage || "Không xác định") + "."
          );
        }
      })
      .catch((error) => {
        openNotificationWithIcon("error", "Đã xảy ra lỗi. " + error);
        console.error(error);
      });
  });
};

export const saveSkill = (portfolioId, skills, skill) => {
  let isExisted = false;
  const nextSkills = skills.map((item) => {
    if (item.id === skill.id) {
      isExisted = true;
      return skill;
    }
    return item;
  });
  if (!isExisted) {
    nextSkills = [...nextSkills, skill];
  }
  const auth = getAuthentication();
  const data = {
    id: portfolioId,
    userId: auth.id,
    portfolioSkills: nextSkills || [],
  };
  return new Promise((resolve, reject) => {
    getApiInstance()
      .postWithBodyAuth({
        url: "/Portfolio/InsertOrUpdateSkills",
        data,
      })
      .then((res) => {
        const { successful, errorMessage, result } = res;
        if (successful) {
          openNotificationWithIcon("success", "Lưu thành công!!!");
          resolve(nextSkills);
        } else {
          openNotificationWithIcon(
            "error",
            "Lỗi: " + (errorMessage || "Không xác định") + "."
          );
        }
      })
      .catch((error) => {
        openNotificationWithIcon("error", "Đã xảy ra lỗi. " + error);
        console.error(error);
      });
  });
};

export const removeSkill = (portfolioId, item) => {
  return new Promise((resolve, reject) => {
    getApiInstance()
      .deleteWithFormAuth({
        url: "/Portfolio/DeleteSkill",
        data: {
          Id: portfolioId,
          ObjectId: item.id,
        },
      })
      .then((res) => {
        const { successful, errorMessage } = res;
        if (successful) {
          openNotificationWithIcon("success", "Thành công!!!");
          resolve();
        } else {
          openNotificationWithIcon(
            "error",
            "Lỗi: " + (errorMessage || "Không xác định") + "."
          );
        }
      })
      .catch((error) => {
        openNotificationWithIcon("error", "Lỗi khi xóa: " + error);
        console.error(error);
      });
  });
};
export const insertEducation = (portfolioId, educations) => {
  const auth = getAuthentication();
  const data = {
    id: portfolioId,
    userId: auth.id,
    portfolioEducations: [
      {
        schoolName: "",
        specialized: "",
        startDate: new Date(),
        isStillHere: false,
        endDate: new Date(),
        detail: "",
      },
    ],
  };
  return new Promise((resolve, reject) => {
    getApiInstance()
      .postWithBodyAuth({
        url: "/Portfolio/InsertOrUpdateEducations",
        data,
      })
      .then((res) => {
        const { successful, errorMessage, result } = res;
        if (successful) {
          resolve([...educations, ...result]);
        } else {
          openNotificationWithIcon(
            "error",
            "Lỗi: " + (errorMessage || "Không xác định") + "."
          );
        }
      })
      .catch((error) => {
        openNotificationWithIcon("error", "Đã xảy ra lỗi. " + error);
        console.error(error);
      });
  });
};

export const removeEducation = (portfolioId, educations, item) => {
  return new Promise((resolve, reject) => {
    getApiInstance()
      .deleteWithFormAuth({
        url: "/Portfolio/DeleteEducation",
        data: {
          Id: portfolioId,
          ObjectId: item.id,
        },
      })
      .then((res) => {
        const { successful, errorMessage, result } = res;
        if (successful) {
          let newEducations = educations.filter((f) => f.id != item.id);
          resolve(newEducations);
          openNotificationWithIcon("success", "Thành công!!!");
        } else {
          openNotificationWithIcon(
            "error",
            "Lỗi: " + (errorMessage || "Không xác định") + "."
          );
        }
      })
      .catch((error) => {
        openNotificationWithIcon("error", "Đã xảy ra lỗi. " + error);
        console.error(error);
      });
  });
};
export const saveEducation = (portfolioId, educations, education) => {
  let isExisted = false;
  const nextEducations = educations.map((item) => {
    if (item.id === education.id) {
      isExisted = true;
      return education;
    }
    return item;
  });
  if (!isExisted) {
    nextEducations = [...nextEducations, education];
  }
  const auth = getAuthentication();
  const data = {
    id: portfolioId,
    userId: auth.id,
    portfolioEducations: nextEducations || [],
  };
  return new Promise((resolve, reject) => {
    getApiInstance()
      .postWithBodyAuth({
        url: "/Portfolio/InsertOrUpdateEducations",
        data,
      })
      .then((res) => {
        const { successful, errorMessage, result } = res;
        if (successful) {
          openNotificationWithIcon("success", "Thành công!!!");
          resolve(nextEducations);
        } else {
          openNotificationWithIcon(
            "error",
            "Lỗi: " + (errorMessage || "Không xác định") + "."
          );
        }
      })
      .catch((error) => {
        openNotificationWithIcon("error", "Đã xảy ra lỗi. " + error);
        console.error(error);
      });
  });
};
export const insertNewExperience = (portfolioId, experiences) => {
  const auth = getAuthentication();
  const data = {
    id: portfolioId,
    userId: auth.id,
    portfolioExperiences: [
      {
        company: "",
        position: "",
        startDate: new Date(),
        isStillHere: false,
        endDate: new Date(),
        detail: "",
        image: "",
        url: "",
      },
    ],
  };
  return new Promise((resolve, reject) => {
    getApiInstance()
      .postWithBodyAuth({
        url: "/Portfolio/UpdateExperiences",
        data,
      })
      .then((res) => {
        const { successful, errorMessage, result } = res;
        if (successful) {
          resolve([...experiences, ...result]);
        } else {
          openNotificationWithIcon(
            "error",
            "Lỗi: " + (errorMessage || "Không xác định") + "."
          );
        }
      })
      .catch((error) => {
        openNotificationWithIcon("error", "Đã xảy ra lỗi. " + error);
        console.error(error);
      });
  });
};
export const removeExperience = (portfolioId, experiences, item) => {
  return new Promise((resolve, reject) => {
    getApiInstance()
      .deleteWithFormAuth({
        url: "/Portfolio/DeleteExperience",
        data: {
          Id: portfolioId,
          ObjectId: item.id,
        },
      })
      .then((res) => {
        const { successful, errorMessage, result } = res;
        if (successful) {
          let newExperiences = experiences.filter((f) => f.id != item.id);
          openNotificationWithIcon("success", "Xóa thành công!!!");
          resolve(newExperiences);
        } else {
          openNotificationWithIcon(
            "error",
            "Lỗi: " + (errorMessage || "Không xác định") + "."
          );
        }
      })
      .catch((error) => {
        openNotificationWithIcon("error", "Đã xảy ra lỗi. " + error);
        console.error(error);
      });
  });
};
export const saveExperience = (portfolioId, experiences, experience) => {
  let isExisted = false;
  const nextExperiences = experiences.map((item) => {
    if (item.id === experience.id) {
      isExisted = true;
      return experience;
    }
    return item;
  });
  if (!isExisted) {
    nextExperiences = [...nextExperiences, experience];
  }
  const auth = getAuthentication();
  const data = {
    id: portfolioId,
    userId: auth.id,
    portfolioExperiences: nextExperiences || [],
  };
  return new Promise((resolve, reject) => {
    getApiInstance()
      .postWithBodyAuth({
        url: "/Portfolio/UpdateExperiences",
        data,
      })
      .then((res) => {
        const { successful, errorMessage, result } = res;
        if (successful) {
          openNotificationWithIcon("success", "Lưu thành công!!!");
          resolve(nextExperiences);
        } else {
          openNotificationWithIcon(
            "error",
            "Lỗi: " + (errorMessage || "Không xác định") + "."
          );
        }
      })
      .catch((error) => {
        openNotificationWithIcon("error", "Đã xảy ra lỗi. " + error);
        console.error(error);
      });
  });
};

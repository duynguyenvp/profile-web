import React from "react";
import getApiInstance from "../../../api/generic-api";
import { getAuthentication } from "../../../store/authStore";
import { openNotificationWithIcon } from "./queries";

export const insertNewSkill = (portfolioId, skills) => {
  const auth = getAuthentication();
  const data = {
    id: portfolioId,
    userId: auth.id,
    portfolioSkills: [
      {
        skillName: "",
        level: 1,
        detail: "",
        ordinalNumber: skills.length,
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
          resolve([...skills, ...result]);
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

export const reorderSkill = (portfolioId, skills, skill) => {
  let isExisted = false;
  let skillSwapper = null;
  let nextSkills = skills.map((item) => {
    if (item.id === skill.id) {
      isExisted = true;
      skillSwapper = item;
      return skill;
    }
    return item;
  });
  if (skillSwapper) {
    nextSkills = nextSkills.map((item) => {
      if (
        item.id !== skill.id &&
        (item.ordinalNumber || 0) === (skill.ordinalNumber || 0)
      ) {
        return { ...item, ordinalNumber: skillSwapper.ordinalNumber };
      }
      return item;
    });
  }
  if (!isExisted) {
    nextSkills = [...nextSkills, skill];
  }
  return updateSkill(portfolioId, nextSkills, false);
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
  return updateSkill(portfolioId, nextSkills);
};

const updateSkill = (portfolioId, nextSkills, showAlert = true) => {
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
          showAlert && openNotificationWithIcon("success", "Lưu thành công!!!");
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

export const removeSkill = (portfolioId, skills, item) => {
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
          let index = 0;
          let newSkills = skills
            .filter((f) => f.id != item.id)
            .sort((a, b) => {
              if ((a.ordinalNumber || 0) < (b.ordinalNumber || 0)) return -1;
              if ((a.ordinalNumber || 0) > (b.ordinalNumber || 0)) return 1;
              return 0;
            })
            .map((item) => ({ ...item, ordinalNumber: index++ }));
          resolve(newSkills);
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

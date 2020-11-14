import getApiInstance from "../../../api/generic-api";
import { getAuthentication } from "../../../store/authStore";
import { openNotificationWithIcon } from "./queries";

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
        ordinalNumber: experiences.length
      }
    ]
  };
  return new Promise(resolve => {
    getApiInstance()
      .postWithBodyAuth({
        url: "/Portfolio/UpdateExperiences",
        data
      })
      .then(res => {
        const { successful, errorMessage, result } = res;
        if (successful) {
          resolve([...experiences, ...result]);
        } else {
          openNotificationWithIcon(
            "error",
            `Lỗi: ${errorMessage || "Không xác định"}.`
          );
        }
      })
      .catch(error => {
        openNotificationWithIcon("error", `Đã xảy ra lỗi. ${error}`);
        console.error(error);
      });
  });
};
export const removeExperience = (portfolioId, experiences, item) =>
  new Promise(resolve => {
    getApiInstance()
      .deleteWithFormAuth({
        url: "/Portfolio/DeleteExperience",
        data: {
          Id: portfolioId,
          ObjectId: item.id
        }
      })
      .then(res => {
        const { successful, errorMessage } = res;
        if (successful) {
          openNotificationWithIcon("success", "Xóa thành công!!!");
          let index = 0;
          const newExperiences = experiences
            .filter(f => f.id !== item.id)
            .sort((a, b) => {
              if ((a.ordinalNumber || 0) < (b.ordinalNumber || 0)) return -1;
              if ((a.ordinalNumber || 0) > (b.ordinalNumber || 0)) return 1;
              return 0;
            })
            .map(item => ({ ...item, ordinalNumber: (index += 1) }));
          resolve(newExperiences);
        } else {
          openNotificationWithIcon(
            "error",
            `Lỗi: ${errorMessage || "Không xác định"}.`
          );
        }
      })
      .catch(error => {
        openNotificationWithIcon("error", `Đã xảy ra lỗi. ${error}`);
        console.error(error);
      });
  });

const updateExperiences = (portfolioId, nextExperiences, showAlert = true) => {
  const auth = getAuthentication();
  const data = {
    id: portfolioId,
    userId: auth.id,
    portfolioExperiences: nextExperiences || []
  };
  return new Promise(resolve => {
    getApiInstance()
      .postWithBodyAuth({
        url: "/Portfolio/UpdateExperiences",
        data
      })
      .then(res => {
        const { successful, errorMessage } = res;
        if (successful) {
          if (showAlert) {
            openNotificationWithIcon("success", "Lưu thành công!!!");
          }
          resolve(nextExperiences);
        } else {
          openNotificationWithIcon(
            "error",
            `Lỗi: ${errorMessage || "Không xác định"}.`
          );
        }
      })
      .catch(error => {
        openNotificationWithIcon("error", `Đã xảy ra lỗi. ${error}`);
        console.error(error);
      });
  });
};

export const saveExperience = (portfolioId, experiences, experience) => {
  const nextExperiences = experiences.map(item => {
    if (item.id === experience.id) {
      return experience;
    }
    return item;
  });
  return updateExperiences(portfolioId, nextExperiences);
};

export const reorderExperience = (portfolioId, experiences, experience) => {
  let isExisted = false;
  let experienceSwapper = null;
  let nextExperiences = experiences.map(item => {
    if (item.id === experience.id) {
      isExisted = true;
      experienceSwapper = item;
      return experience;
    }
    return item;
  });
  if (experienceSwapper) {
    nextExperiences = nextExperiences.map(item => {
      if (
        item.id !== experience.id &&
        (item.ordinalNumber || 0) === (experience.ordinalNumber || 0)
      ) {
        return { ...item, ordinalNumber: experienceSwapper.ordinalNumber };
      }
      return item;
    });
  }
  if (!isExisted) {
    nextExperiences = [...nextExperiences, experience];
  }
  return updateExperiences(portfolioId, nextExperiences, false);
};

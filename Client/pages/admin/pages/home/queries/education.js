import getApiInstance from "../../../api/generic-api";
import { getAuthentication } from "../../../store/authStore";
import { openNotificationWithIcon } from "./queries";

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
        ordinalNumber: educations.length
      }
    ]
  };
  return new Promise(resolve => {
    getApiInstance()
      .postWithBodyAuth({
        url: "/Portfolio/InsertOrUpdateEducations",
        data
      })
      .then(res => {
        const { successful, errorMessage, result } = res;
        if (successful) {
          resolve([...educations, ...result]);
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

export const removeEducation = (portfolioId, educations, item) =>
  new Promise(resolve => {
    getApiInstance()
      .deleteWithFormAuth({
        url: "/Portfolio/DeleteEducation",
        data: {
          Id: portfolioId,
          ObjectId: item.id
        }
      })
      .then(res => {
        const { successful, errorMessage } = res;
        if (successful) {
          let index = 0;
          const newEducations = educations
            .filter(f => f.id !== item.id)
            .sort((a, b) => {
              if ((a.ordinalNumber || 0) < (b.ordinalNumber || 0)) return -1;
              if ((a.ordinalNumber || 0) > (b.ordinalNumber || 0)) return 1;
              return 0;
            })
            .map(item => ({ ...item, ordinalNumber: (index += 1) }));
          resolve(newEducations);
          openNotificationWithIcon("success", "Thành công!!!");
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
const updateEducation = (portfolioId, nextEducations, showAlert = true) => {
  const auth = getAuthentication();
  const data = {
    id: portfolioId,
    userId: auth.id,
    portfolioEducations: nextEducations || []
  };
  return new Promise(resolve => {
    getApiInstance()
      .postWithBodyAuth({
        url: "/Portfolio/InsertOrUpdateEducations",
        data
      })
      .then(res => {
        const { successful, errorMessage } = res;
        if (successful) {
          if (showAlert) openNotificationWithIcon("success", "Thành công!!!");
          resolve(nextEducations);
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
export const reorderEducation = (portfolioId, educations, education) => {
  let isExisted = false;
  let educationSwapper = null;
  let nextEducations = educations.map(item => {
    if (item.id === education.id) {
      isExisted = true;
      educationSwapper = item;
      return education;
    }
    return item;
  });
  if (educationSwapper) {
    nextEducations = nextEducations.map(item => {
      if (
        item.id !== education.id &&
        (item.ordinalNumber || 0) === (education.ordinalNumber || 0)
      ) {
        return { ...item, ordinalNumber: educationSwapper.ordinalNumber };
      }
      return item;
    });
  }
  if (!isExisted) {
    nextEducations = [...nextEducations, education];
  }
  return updateEducation(portfolioId, nextEducations, false);
};

export const saveEducation = (portfolioId, educations, education) => {
  let isExisted = false;
  let nextEducations = educations.map(item => {
    if (item.id === education.id) {
      isExisted = true;
      return education;
    }
    return item;
  });
  if (!isExisted) {
    nextEducations = [...nextEducations, education];
  }
  return updateEducation(portfolioId, nextEducations);
};

export const cloneDate = date => {
  if (!date) {
    return null;
  }
  const result = new Date(date);
  if (result === "Invalid Date") {
    return null;
  }
  return result;
};

export const dateToStringFormatCultureVi = date => {
  const newDate = cloneDate(date);
  try {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return newDate.toLocaleDateString("vi", options);
  } catch (error) {
    return "";
  }
};

export const datetimeToStringFormatCultureVi = date => {
  const newDate = cloneDate(date);
  try {
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    };
    const result = newDate.toLocaleDateString("vi", options);
    return result.split(",").reverse().join(" ").trim();
  } catch (error) {
    return "";
  }
};

function lamtron(value) {
  return value > 0 && value < 10 ? `0${value}` : value;
}

export const dateToStringFormatNoDayCultureVi = date => {
  try {
    const newDate = new Date(date);
    const result = `${lamtron(
      newDate.getMonth() + 1
    )}/${newDate.getFullYear()}`;
    return result;
  } catch (error) {
    return "";
  }
};

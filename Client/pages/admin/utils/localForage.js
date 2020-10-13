import localForage from "localforage";

export const getObject = async (key) => {
  try {
    const value = await localForage.getItem(key);
    return value;
  } catch (err) {
    console.error(err);
    return undefined;
  }
};
export const setObject = async (key, value) => {
  try {
    await localForage.setItem(key, value);
  } catch (err) {
    console.error(err);
  }
};
export const removeObject = async (key) => {
  try {
    await localForage.removeItem(key);
  } catch (err) {
    console.error(err);
  }
};

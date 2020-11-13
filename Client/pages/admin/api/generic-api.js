import { create } from "./api-axios.js";

const getApiInstance = (baseURL = "/api") => {
  const ajax = create({ baseURL });

  const postWithBodyAuth = args => ajax.post("/postWithBodyAuth", args);

  const postWithBody = args => ajax.post("/postWithBody", args);

  const postWithFormAuth = args => ajax.post("/postWithFormAuth", args);

  const postWithForm = args => ajax.post("/postWithForm", args);

  const deleteWithFormAuth = args => ajax.post("/deleteWithFormAuth", args);

  const getWithQueryString = args => ajax.post("/getWithQueryString", args);

  const getWithQueryStringAuth = args => ajax.post("/getWithQueryStringAuth", args);

  const signout = args => ajax.post("/signout", args);

  const getPrint = (args, config) => ajax.post("", args, config);

  const uploadBase64Image = args => ajax.post("/uploadBase64Image", args);
  const uploadImageFromUrl = args => ajax.post("/uploadImageFromUrl", args);
  const deleteImage = args => ajax.post("/deleteImage", args);

  return {
    signout,
    postWithBodyAuth,
    postWithBody,
    postWithFormAuth,
    postWithForm,
    deleteWithFormAuth,
    getWithQueryString,
    getWithQueryStringAuth,
    getPrint,
    uploadBase64Image,
    uploadImageFromUrl,
    deleteImage
  };
};

export default getApiInstance;

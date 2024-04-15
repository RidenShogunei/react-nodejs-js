import axios from "axios";

const sendDocument = async (uid, file) => {
  let formData = new FormData();
  formData.append("uid", uid);
  formData.append("file", file);

  try {
    const response = await axios({
      method: "post",
      url: `${process.env.REACT_APP_API_URL}/document`,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data;charset=utf-8", //加上字符编码信息
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error during API Call", error);
    return { error: error.message };
  }
};

const getDocument = async (uid) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/document/${uid}`
    );

    // 请确保后端返回的response.data中包含你需要的文件信息
    return response.data;

  } catch (error) {
    console.error("Error during API Call", error);
    return { error: error.message };
  }
};
const deleteDocument = async (docId) => {
  try {
    const response = await axios.delete(
      `${process.env.REACT_APP_API_URL}/document/${docId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error during API Call", error);
    return { error: error.message };
  }
};
const api = {
  sendDocument,
  getDocument,
  deleteDocument
};

export default api;

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

const getDocument = async (docId) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/documents/${docId}`,
      {
        responseType: "blob", //设置响应类型为blob以确保能正确获取包含非文本字符的文件
        headers: {
          "Accept-Charset": "charset=utf-8", //设置请求头以确保后端响应能被正确解码
        },
      }
    );
    // 处理响应数据以确保非文本文件能被正确显示
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "file.pdf"); //设置下载的文件名，根据实际情况修改
    document.body.appendChild(link);
    link.click();
  } catch (error) {
    console.error("Error during API Call", error);
    return { error: error.message };
  }
};
const api = {
  sendDocument,
  getDocument,
};

export default api;

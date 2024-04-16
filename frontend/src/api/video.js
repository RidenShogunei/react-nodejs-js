import axios from "axios";

const sendVideo = async (uid, file) => {
  let formData = new FormData();
  formData.append("uid", uid);
  formData.append("file", file);

  try {
    const response = await axios({
      method: "post",
      url: `${process.env.REACT_APP_API_URL}/video`,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data;charset=utf-8",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error during API Call", error);
    return { error: error.message };
  }
};

const getVideo = async (uid) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/video/${uid}`
    );
    return response.data;
  } catch (error) {
    console.error("Error during API Call", error);
    return { error: error.message };
  }
};

const deleteVideo = async (videoId) => {
  try {
    const response = await axios.delete(
      `${process.env.REACT_APP_API_URL}/video/${videoId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error during API Call", error);
    return { error: error.message };
  }
};

const api = {
  sendVideo,
  getVideo,
  deleteVideo
};

export default api;
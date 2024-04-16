import axios from "axios";

const sendAudio = async (uid, file) => {
  let formData = new FormData();
  formData.append("uid", uid);
  formData.append("file", file);

  try {
    const response = await axios({
      method: "post",
      url: `${process.env.REACT_APP_API_URL}/audio`,
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

const getAudio = async (uid) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/audio/${uid}`
    );
    return response.data;
  } catch (error) {
    console.error("Error during API Call", error);
    return { error: error.message };
  }
};

const deleteAudio = async (audioId) => {
  try {
    const response = await axios.delete(
      `${process.env.REACT_APP_API_URL}/audio/${audioId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error during API Call", error);
    return { error: error.message };
  }
};

const api = {
  sendAudio,
  getAudio,
  deleteAudio
};

export default api;
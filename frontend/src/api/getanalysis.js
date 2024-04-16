import axios from 'axios';

const getanalysis = async (uid) => {
    try {
        const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/getanalysis/${uid}`
        );
        return response.data;
    } catch (error) {
        console.error("Error during API Call", error);
        return { error: error.message };
    }
};

const api = {
    getanalysis
};

export default api;
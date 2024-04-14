import axios from 'axios';

const login = async (username, password) => {
    const data = {
        username: username,
        password: password
    };

    try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/login`, data);
        return response.data;
    } catch (error) {
        console.error('Error during API Call', error);
        return { error: error.message };
    }
};

const register=async (username, password,realname) => {
    const data = {
        username: username,
        password: password,
        realname:realname,
    };
    try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/register`, data);
        return response.data;
    } catch (error) {
        console.error('Error during API Call', error);
        return { error: error.message };
    }
};

const  confirm=async (uid) => {
    const data = {
        uid:uid
    };
    try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/getconfirm`, data);
        return response.data;
    } catch (error) {
        console.error('Error during API Call', error);
        return { error: error.message };
    }
};
const api = {
    login,
    register,
    confirm
};

export default api;
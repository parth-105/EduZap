const { default: axiosInstance } = require(".");

export const registerUser = async (payload) => {
    try {
        const response = await axiosInstance.post('https://edu-zap-backend-ddth.vercel.app/api/users/register', payload);
        console.log("res for register",response.data);
        return response.data;
    } catch (error) {
        console.error("Error during user registration:", error);
        return error.response.data;
    }
}

export const loginUser = async (payload) => {
    try {
        const response = await axiosInstance.post('https://edu-zap-backend-ddth.vercel.app/api/users/login', payload);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export const getUserInfo = async () => {
    try {
        const response = await axiosInstance.post('/api/users/get-user-info');
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

import axios from 'axios';

const BASE_URL = process.env.BACKEND_URL;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true
});

export default axiosInstance;

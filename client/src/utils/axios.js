import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://forumbackend.heranyimer.com/api",
});

export default axiosInstance;

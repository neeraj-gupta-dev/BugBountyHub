import axios from "axios";

const API = axios.create({
  baseURL: "https://bugbountyhub.onrender.com/api",
  withCredentials: true // ⭐ VERY IMPORTANT FOR COOKIES
});

export default API;

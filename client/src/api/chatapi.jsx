import axios from "axios";

const api = axios.create({
  baseURL: "https://real-time-chat-backend-7b0eduanx.vercel.app/",
});

export default api;

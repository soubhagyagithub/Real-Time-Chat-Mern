import axios from "axios";

const api = axios.create({
  baseURL: "https://real-time-chat-backend-five.vercel.app/",
});

export default api;

import axios from "axios";

const api = axios.create({
  baseURL: "https://real-time-chat-backend-psi.vercel.app/",
});

export default api;

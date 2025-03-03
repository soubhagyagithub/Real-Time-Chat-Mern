import axios from "axios";

const api = axios.create({
  baseURL: "https://real-time-chat-be-tnoj.onrender.com/",
});

export default api;

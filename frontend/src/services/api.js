import axios from "axios";

const api = axios.create({
  baseURL: "https://techsolutions-api-oyus.onrender.com/api",
});

export default api;
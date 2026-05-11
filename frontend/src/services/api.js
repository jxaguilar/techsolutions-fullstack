import axios from "axios";

const api = axios.create({
  baseURL: "https://https://techsolutions-api-oyus.onrender.com/api",
});

export default api;
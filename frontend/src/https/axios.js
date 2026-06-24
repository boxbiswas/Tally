import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000", // Replace with your backend API URL
    withCredentials: true,    // Allow sending cookies with requests
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;
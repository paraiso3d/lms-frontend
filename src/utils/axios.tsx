// @/utils/axios.ts
import axios from "axios";

const isLocalhost = window.location.hostname === "localhost";

const api = axios.create({
    baseURL: isLocalhost
        ? "http://127.0.0.1:8000/api"
        : "https://api-lms.slarenasitsolutions.com/public/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// ✅ Attach token from localStorage
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);

// 🧠 Handle expired tokens
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default api;
import axios from "axios";

// Axios yapılandırması
const api = axios.create({
    baseURL: "http://localhost:8080/api", // Spring Boot backend URL'sini buraya yazın
    headers: {
        "Content-Type": "application/json",
    },
});

// İsteklerde otomatik olarak token eklemek için bir interceptor
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token"); // Eğer oturum token'ınız varsa
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;

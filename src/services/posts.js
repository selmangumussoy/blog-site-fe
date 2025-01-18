import api from "./api"; // Axios yapılandırmasını buradan alıyoruz

// Backend'den tüm postları al
export const fetchPosts = () => {
    return api.get("/posts");
};

// Yeni bir post oluştur
export const createPost = (post) => {
    return api.post("/posts", post);
};

// Belirli bir postu getir
export const fetchPostById = (id) => {
    return api.get(`/posts/${id}`);
};

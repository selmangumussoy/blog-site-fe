import { AuthService } from './AuthService'; // Token alma fonksiyonu

export const UserService = {
    async getMe() {
        const token = AuthService.getToken(); // JWT token alınır
        const response = await fetch("http://localhost:8080/users/me", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // Gerekli header
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch user");
        }

        return await response.json();
    },
};

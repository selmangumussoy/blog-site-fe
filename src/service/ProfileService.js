import { AuthService } from '@/service/AuthService.js';

export const ProfileService = {


    async getProfileById(id) {
        const token = AuthService.getToken();
        const response = await fetch(`http://localhost:8080/profiles/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Profil alınamadı');
        }

        return await response.json();
    },





    async updateProfile(profile) {
        const response = await fetch(`http://localhost:8080/profiles/${profile.profileId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(profile),
        });

        if (!response.ok) {
            throw new Error('Failed to update profile');
        }

        return response.json();
    }
};

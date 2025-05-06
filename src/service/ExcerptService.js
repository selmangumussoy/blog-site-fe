export const ExcerptService = {

    async getExcerpts() {
        const response = await fetch("http://localhost:8080/excerpts", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch excerpts");
        }

        return await response.json();
    },

    async createExcerpt(excerpt) {
        const token = localStorage.getItem("jwtToken");
        const response = await fetch('http://localhost:8080/excerpts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`  // Token'ı header'a ekliyoruz
            },
            body: JSON.stringify(excerpt),
        });

        if (!response.ok) {
            throw new Error('Failed to create excerpt');
        }

        return response.json();
    },

    async updateExcerpt(excerpt) {
        const token = localStorage.getItem("jwtToken");
        const response = await fetch(`http://localhost:8080/excerpts/${excerpt.id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(excerpt),
        });

        if (!response.ok) {
            throw new Error('Failed to update excerpt');
        }

        return response.json();
    },

    async deleteExcerpt(id) {
        const token = localStorage.getItem("jwtToken");
        const response = await fetch(`http://localhost:8080/excerpts/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            },
        });

        if (!response.ok) {
            throw new Error('Failed to delete excerpt');
        }
    },

    async getExcerptsByUserId(userId) {
        const token = localStorage.getItem("jwtToken");
        const response = await fetch(`http://localhost:8080/excerpts/${userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch excerpts by userId");
        }

        return await response.json();
    }
};

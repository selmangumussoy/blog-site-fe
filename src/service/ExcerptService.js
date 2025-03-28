export const ExcerptService = {
    async getExcerpts() {
        const response = await fetch("http://localhost:8080/excerpts", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch tags");
        }

        return await response.json();
    },


    async createExcerpt(tag) {
        const response = await fetch('http://localhost:8080/excerpts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(tag),
        });

        if (!response.ok) {
            throw new Error('Failed to create tag');
        }

        return response.json();
    },

    async updateExcerpt(tag) {
        const response = await fetch(`http://localhost:8080/excerpts/${tag.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(tag),
        });

        if (!response.ok) {
            throw new Error('Failed to update tag');
        }

        return response.json();
    },

    async deleteExcerpt(id) {
        const response = await fetch(`http://localhost:8080/excerpts/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Failed to delete tag');
        }
    }
};

export const TagService = {
    async getTags() {
        const response = await fetch('/api/tags');
        return response.json();
    },

    async createTag(tag) {
        const response = await fetch('/api/tags', {
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

    async updateTag(tag) {
        const response = await fetch(`/api/tags/${tag.id}`, {
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

    async deleteTag(id) {
        const response = await fetch(`/api/tags/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Failed to delete tag');
        }
    }
};

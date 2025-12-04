const API_BASE = 'http://localhost:8000';

export const api = {
    async listConversations() {
        const response = await fetch(`${API_BASE}/api/conversations`);
        if (!response.ok) throw new Error('Failed to list conversations');
        return response.json();
    },

    async createConversation() {
        const response = await fetch(`${API_BASE}/api/conversations`, {
            method: 'POST',
        });
        if (!response.ok) throw new Error('Failed to create conversation');
        return response.json();
    },

    async getConversation(id) {
        const response = await fetch(`${API_BASE}/api/conversations/${id}`);
        if (!response.ok) throw new Error('Failed to get conversation');
        return response.json();
    },

    async renameConversation(id, title) {
        const response = await fetch(`${API_BASE}/api/conversations/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title }),
        });
        if (!response.ok) throw new Error('Failed to rename conversation');
        return response.json();
    },

    async deleteConversation(id) {
        const response = await fetch(`${API_BASE}/api/conversations/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete conversation');
        return response.json();
    },

    async sendMessageStream(cid, content, onEvent) {
        const response = await fetch(`${API_BASE}/api/conversations/stream?cid=${cid}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content }),
        });

        if (!response.ok) throw new Error('Failed to send message');

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    try {
                        const data = JSON.parse(line.slice(6));
                        onEvent(data.type, data);
                    } catch (e) {
                        console.error('Failed to parse SSE event:', e);
                    }
                }
            }
        }
    },
};

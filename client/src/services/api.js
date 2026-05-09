import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 responses globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect to login if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ─── Auth ───
export const login = (email, password) =>
  api.post('/api/auth/login', { email, password });

export const getMe = () => api.get('/api/auth/me');

// ─── Conversations ───
export const getConversations = (params) =>
  api.get('/api/conversations', { params });

export const getConversation = (id) =>
  api.get(`/api/conversations/${id}`);

export const updateConversationStatus = (id, status) =>
  api.patch(`/api/conversations/${id}/status`, { status });

export const toggleAI = (id) =>
  api.patch(`/api/conversations/${id}/toggle-ai`);

export const takeoverConversation = (id) =>
  api.patch(`/api/conversations/${id}/takeover`);

// ─── Messages ───
export const getMessages = (conversationId) =>
  api.get(`/api/messages/${conversationId}`);

export const sendMessage = (conversationId, message) =>
  api.post('/api/messages/send', { conversationId, message });

export default api;

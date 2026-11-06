import axios from 'axios';

const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, '');
  }
  if (typeof window !== 'undefined') {
    // In browser: use same-origin relative /api on https://www.abyssholding.com
    return '/api';
  }
  return 'http://localhost:3000/api';
};

const api = axios.create({
  baseURL: getBaseUrl(),
});

// Attach token and ensure dynamic same-origin resolution in browser
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    if (!config.baseURL || config.baseURL.includes('localhost:5000')) {
      config.baseURL = getBaseUrl();
    }
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// ── Public ──────────────────────────────────────────────────
export const getCompany    = () => api.get('/company').then(r => r.data);
export const getServices   = () => api.get('/services').then(r => r.data);
export const getLocations  = () => api.get('/locations').then(r => r.data);
export const getProjects   = () => api.get('/projects').then(r => r.data);
export const sendMessage   = (body: object) => api.post('/contact', body).then(r => r.data);

// ── Auth ────────────────────────────────────────────────────
export const login = (username: string, password: string) =>
  api.post('/auth/login', { username, password }).then(r => r.data);
export const getMe = () => api.get('/auth/me').then(r => r.data);

// ── Admin: Services ─────────────────────────────────────────
export const getAllServices  = () => api.get('/services/all').then(r => r.data);
export const createService   = (body: object) => api.post('/services', body).then(r => r.data);
export const updateService   = (id: string, body: object) => api.put(`/services/${id}`, body).then(r => r.data);
export const deleteService   = (id: string) => api.delete(`/services/${id}`).then(r => r.data);

// ── Admin: Locations ────────────────────────────────────────
export const createLocation  = (body: object) => api.post('/locations', body).then(r => r.data);
export const updateLocation  = (id: string, body: object) => api.put(`/locations/${id}`, body).then(r => r.data);
export const deleteLocation  = (id: string) => api.delete(`/locations/${id}`).then(r => r.data);

// ── Admin: Projects ─────────────────────────────────────────
export const createProject   = (body: object) => api.post('/projects', body).then(r => r.data);
export const updateProject   = (id: string, body: object) => api.put(`/projects/${id}`, body).then(r => r.data);
export const deleteProject   = (id: string) => api.delete(`/projects/${id}`).then(r => r.data);

// ── Admin: Company ──────────────────────────────────────────
export const updateCompany = (body: object) =>
  api.put('/company', body).then(r => r.data?.company || r.data);

// ── Admin: Messages ─────────────────────────────────────────
export const getMessages     = () => api.get('/contact/messages').then(r => r.data);
export const markMessageRead = (id: string) => api.patch(`/contact/messages/${id}/read`).then(r => r.data);
export const deleteMessage   = (id: string) => api.delete(`/contact/messages/${id}`).then(r => r.data);

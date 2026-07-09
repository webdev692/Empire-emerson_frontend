import axios from 'axios';
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '../store/authStore';
import { mockLogin, logMockCredentials } from './mockAuth';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'https://the-emerson-empirebackend-production.up.railway.app',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Log mock credentials in development
if (import.meta.env.DEV) {
  logMockCredentials();
}

// ── Request interceptor ───────────────────────────────────────────────────────
// 1. Mock /auth/login in development mode
// 2. Attach the Bearer token from the auth store to every outgoing request.

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    // Mock interceptor — only runs when VITE_MOCK_AUTH=true
    if (import.meta.env.VITE_MOCK_AUTH === 'true' && config.url === '/api/auth/login' && config.method === 'post') {
      const data = config.data;
      try {
        const response = mockLogin({ email: data.email, password: data.password, role: data.role });
        return new Promise((resolve) => {
          config.adapter = () =>
            Promise.resolve({ data: response, status: 200, statusText: 'OK', headers: {}, config } as AxiosResponse);
          resolve(config);
        }) as any;
      } catch (error) {
        return new Promise((_, reject) => {
          config.adapter = () =>
            Promise.reject({
              response: { data: { message: (error as Error).message }, status: 401, statusText: 'Unauthorized', headers: {}, config },
            });
          reject(error);
        }) as any;
      }
    }

    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config;
  },
  (error: unknown) => Promise.reject(error)
);

// ── Response interceptor ──────────────────────────────────────────────────────
// On 401, clear auth and redirect — but NOT for auth endpoints themselves
// (login failures must surface to the form as an error, not a silent redirect).

const AUTH_ENDPOINTS = ['/api/auth/login', '/api/auth/register', '/api/auth/forgot-password', '/api/auth/reset-password'];

api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      const url = error.config?.url ?? '';
      const isAuthEndpoint = AUTH_ENDPOINTS.some((e) => url.includes(e));
      if (!isAuthEndpoint) {
        useAuthStore.getState().clearAuth();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

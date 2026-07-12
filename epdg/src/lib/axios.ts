import axios from 'axios';
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '../store/authStore';
import type { MockLoginRequest } from './mockAuth';
import { API_ORIGIN, ApiConfigurationError } from './apiConfig';

const MOCK_MODE = import.meta.env.DEV && import.meta.env.VITE_MOCK_AUTH === 'true';

const api = axios.create({
  baseURL: API_ORIGIN ?? undefined,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Log mock credentials only in an explicitly enabled development demo.
// ── Request interceptor ───────────────────────────────────────────────────────
// 1. Mock /auth/login in development mode
// 2. Attach the Bearer token from the auth store to every outgoing request.

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig> => {
    // Mock interceptor — requires Vite development mode and VITE_MOCK_AUTH=true.
    if (MOCK_MODE && config.url === '/api/auth/login' && config.method === 'post') {
      const data = config.data as MockLoginRequest;
      return import('./mockAuth').then(({ mockLogin }) => {
        const response = mockLogin({ email: data.email, password: data.password, role: data.role });
        config.adapter = () =>
          Promise.resolve({ data: response, status: 200, statusText: 'OK', headers: {}, config } as AxiosResponse);
        return config;
      });
    }

    if (!API_ORIGIN) {
      return Promise.reject(new ApiConfigurationError());
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

const AUTH_ENDPOINTS = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/forgot-password',
  '/api/auth/reset-password',
  '/api/auth/verify-email',
];

api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      const url = error.config?.url ?? '';
      const isAuthEndpoint = AUTH_ENDPOINTS.some((endpoint) => url.includes(endpoint));
      if (!isAuthEndpoint) {
        useAuthStore.getState().clearAuth();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

import axios from "axios";
import {clearAuthTokens, getAccessToken} from "@/lib/auth.ts";
import {publicLinks} from "@/lib/link.ts";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/v1';

export const API = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
})

API.interceptors.request.use(
    (config) => {
        const token = getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          // Only redirect to login if we're on a protected page, not for public API calls
          const currentPath = window.location.pathname;
          const protectedPaths = ['/dashboard', '/admin'];
          const isProtectedPage = protectedPaths.some(path => currentPath.startsWith(path));
          
          clearAuthTokens();
          
          if (isProtectedPage) {
            window.location.href = publicLinks.login.to;
          }
        }
        return Promise.reject(error);
    }
);

export const API_ROUTES = {
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    register: `${API_BASE_URL}/auth/register`,
    forgotPassword: `${API_BASE_URL}/auth/forgot-password`,
  },
  oauth: {
    google: {
      login: `${API_BASE_URL}/oauth/google/login`,
      callback: `${API_BASE_URL}/oauth/google/callback`,
    },
  },
  fields: {
    list: `${API_BASE_URL}/fields`,
    details: (id: string) => `${API_BASE_URL}/fields/${id}`,
    byLocation: (locationId: string) => `${API_BASE_URL}/locations/${locationId}/fields`,
  },
  locations: {
    list: `${API_BASE_URL}/locations`,
    details: (id: string) => `${API_BASE_URL}/locations/${id}`,
  },
  bookings: {
    create: `${API_BASE_URL}/bookings`,
    list: `${API_BASE_URL}/users/bookings`,
    details: (id: string) => `${API_BASE_URL}/bookings/${id}`,
    cancel: (id: string) => `${API_BASE_URL}/bookings/${id}/cancel`,
    slots: `${API_BASE_URL}/bookings/slots`,
  },
  users: {
    profile: () => `${API_BASE_URL}/users/profile`,
  },
};
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/v1';

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
  },
  locations: {
    list: `${API_BASE_URL}/locations`,
    details: (id: string) => `${API_BASE_URL}/locations/${id}`,
  },
  users: {
    profile: (userId: string) => `${API_BASE_URL}/users/${userId}`,
  },
};
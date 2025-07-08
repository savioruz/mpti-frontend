import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {API, API_ROUTES} from "@/lib/api.ts";

// Types based on the Swagger API docs
export interface UserLoginRequest {
  email: string;
  password: string;
}

export interface UserRegisterRequest {
  name: string;
  email: string;
  password: string;
}

// User profile types
export interface UserProfile {
  email: string;
  name: string;
  profile_image: string;
}

export interface UserProfileResponse {
  data: UserProfile;
}

// Login mutation hook
export const useLogin = () => {
  return useMutation({
    mutationFn: async (userData: UserLoginRequest) => {
      try {
        const { data } = await API.post(API_ROUTES.auth.login, userData);
        return data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const message = error.response?.data?.message || 'Failed to login';
          throw new Error(message);
        }
        throw error;
      }
    },
  });
};

// Register mutation hook
export const useRegister = () => {
  return useMutation({
    mutationFn: async (userData: UserRegisterRequest) => {
      try {
        const { data } = await API.post(API_ROUTES.auth.register, userData);
        return data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const message = error.response?.data?.message || 'Failed to register';
          throw new Error(message);
        }
        throw error;
      }
    },
  });
};

// Google OAuth handling
export const initiateGoogleLogin = async () => {
  try {
    // Define the frontend callback URL
    const frontendCallbackUrl = `${window.location.origin}/oauth/callback`;

    // Make a request to the backend to get the Google OAuth URL
    const response = await API.get(`${API_ROUTES.oauth.google.login}?redirect_uri=${encodeURIComponent(frontendCallbackUrl)}`);

    // Check for the new response format with data.url
    if (response.data && response.data.data && response.data.data.url) {
      // Store the state if provided for verification later
      if (response.data.data.state) {
        localStorage.setItem('oauth_state', response.data.data.state);
      }

      // Redirect to the Google OAuth URL
      window.location.href = response.data.data.url;
    } else {
      throw new Error('Invalid response from server');
    }
  } catch (error) {
    // Display error toast notification
    import('sonner').then(({ toast }) => {
      toast.error('Failed to initiate Google login. Please try again later.');
    });
    throw error;
  }
};

// Handle OAuth callback and extract tokens
export const useHandleOAuthCallback = (code: string | null) => {
  return useQuery({
    queryKey: ['oauth-callback', code],
    queryFn: async () => {
      if (!code) throw new Error('No authorization code provided');

      try {
        // Get saved state from localStorage if available
        const state = localStorage.getItem('oauth_state');

        // Make the API request, including state if available
        const { data } = await API.get(
          `${API_ROUTES.oauth.google.callback}?code=${code}${state ? `&state=${state}` : ''}`
        );

        // Handle different response formats
        const tokens = data.data || data;

        // Save tokens to localStorage if they exist
        if (tokens && tokens.access_token && tokens.refresh_token) {
          saveAuthTokens(tokens.access_token, tokens.refresh_token);
          // Clean up state after successful use
          localStorage.removeItem('oauth_state');
        } else {
          console.error('Invalid token format in response', data);
          throw new Error('Invalid token format in response');
        }

        return data;
      } catch (error) {
        console.error('OAuth callback error:', error);
        if (axios.isAxiosError(error)) {
          const message = error.response?.data?.message || 'Failed to authenticate with Google';
          throw new Error(message);
        }
        throw error;
      }
    },
    enabled: !!code,
  });
};

// Check if current token is valid
export const useCheckAuthStatus = () => {
  return useQuery({
    queryKey: ['auth-status'],
    queryFn: async () => {
      const token = getAccessToken();

      if (!token || isTokenExpired(token)) {
        clearAuthTokens();
        return { isAuthenticated: false };
      }

      try {
        await API.get(API_ROUTES.users.profile());
        return { isAuthenticated: true };
      } catch (error) {
        clearAuthTokens();
        return { isAuthenticated: false };
      }
    },
  });
};

// User profile query hook
export const useUserProfile = () => {
  return useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      try {
        const { data } = await API.get<UserProfileResponse>(API_ROUTES.users.profile());
        return data.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const message = error.response?.data?.message || 'Failed to fetch user profile';
          throw new Error(message);
        }
        throw error;
      }
    },
    enabled: !!getAccessToken(),
  });
};

// Storage helpers for auth tokens
export const saveAuthTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem('access_token', accessToken);
  localStorage.setItem('refresh_token', refreshToken);
};

export const getAccessToken = () => {
  return localStorage.getItem('access_token');
};

export const clearAuthTokens = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

export const isTokenExpired = (token?: string | null): boolean => {
  if (!token) return true;

  try {
    const base64Payload = token.split('.')[1];
    const payload = JSON.parse(atob(base64Payload));

    return payload.exp * 1000 < Date.now();
  } catch (error) {
    return true;
  }
};

// RBAC Types
export enum UserRole {
  USER = "1",
  STAFF = "2", 
  ADMIN = "9",
}

export interface JWTPayload {
  id: string;
  email: string;
  level: string;
  token_type: string;
  iss: string;
  sub: string;
  exp: number;
  nbf: number;
  iat: number;
}

// Decode JWT token to get payload
export const decodeToken = (token?: string | null): JWTPayload | null => {
  if (!token) return null;

  try {
    const base64Payload = token.split('.')[1];
    const payload = JSON.parse(atob(base64Payload));
    return payload as JWTPayload;
  } catch (error) {
    console.error("Error decoding JWT token:", error);
    return null;
  }
};

// Get user role from token
export const getUserRole = (): UserRole | null => {
  const token = getAccessToken();
  if (!token) return null;

  const payload = decodeToken(token);
  if (!payload) return null;

  return payload.level as UserRole;
};

// Check if user has required role
export const hasRole = (requiredRole: UserRole): boolean => {
  const userRole = getUserRole();
  if (!userRole) return false;

  return parseInt(userRole) >= parseInt(requiredRole);
};

// Check if user is admin (level 9) or higher
export const isAdmin = (): boolean => {
  return hasRole(UserRole.ADMIN);
};

// Check if user is staff (level 2) or higher (includes admin)
export const isStaffOrAdmin = (): boolean => {
  return hasRole(UserRole.STAFF);
};

// Check if user is regular user only (level 1)
export const isUserOnly = (): boolean => {
  const userRole = getUserRole();
  return userRole === UserRole.USER;
};

// Logout function
export const logout = () => {
  clearAuthTokens();
  window.location.href = '/';
};

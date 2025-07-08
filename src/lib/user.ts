import { API, API_ROUTES } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// User types based on the API documentation
export interface User {
  id: string;
  email: string;
  full_name: string;
  level: string; // "1" (user), "2" (staff), "9" (admin)
  is_verified: boolean;
  last_login?: string;
  profile_image?: string;
  created_at: string;
  updated_at: string;
}

export interface PaginatedUserResponse {
  users: User[];
  total_items: number;
  total_pages: number;
}

export interface GetUsersParams {
  page?: number;
  limit?: number;
  email?: string;
  full_name?: string;
  level?: string;
}

export interface UpdateUserRoleRequest {
  level: "1" | "2" | "9";
}

// API functions
export async function getUsers(params?: GetUsersParams): Promise<{ data: PaginatedUserResponse }> {
  const response = await API.get(API_ROUTES.users.admin.list, { params });
  return response.data;
}

export async function getUserById(id: string): Promise<{ data: User }> {
  const response = await API.get(API_ROUTES.users.admin.details(id));
  return response.data;
}

export async function updateUserRole(id: string, payload: UpdateUserRoleRequest): Promise<{ data: User }> {
  const response = await API.patch(API_ROUTES.users.admin.updateRole(id), payload);
  return response.data;
}

// React Query hooks
export const useUsers = (params?: GetUsersParams) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => getUsers(params),
    select: (data) => data.data,
  });
};

export const useUser = (id: string) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => getUserById(id),
    select: (data) => data.data,
    enabled: !!id,
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, level }: { id: string; level: "1" | "2" | "9" }) =>
      updateUserRole(id, { level }),
    onSuccess: () => {
      // Invalidate users queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};

// Helper functions
export const getUserLevelLabel = (level: string) => {
  switch (level) {
    case "1":
      return "User";
    case "2":
      return "Staff";
    case "9":
      return "Admin";
    default:
      return "Unknown";
  }
};

export const getUserLevelColor = (level: string) => {
  switch (level) {
    case "1":
      return "bg-blue-100 text-blue-800";
    case "2":
      return "bg-yellow-100 text-yellow-800";
    case "9":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

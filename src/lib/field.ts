import { API, API_ROUTES } from "@/lib/api";

export type CreateFieldPayload = {
  description?: string;
  location_id: string;
  name: string;
  price: number;
  type: string;
};

export type UpdateFieldPayload = {
  description?: string;
  location_id?: string;
  name?: string;
  price?: number;
  type?: string;
};

export type Field = {
  id: string;
  description: string;
  location_id: string;
  name: string;
  price: number;
  type: string;
  created_at: string;
  updated_at: string;
};

export type GetFieldsResponse = {
  data: {
    fields: Field[];
    total_items: number;
    total_pages: number;
  };
};

export type GetFieldsParams = {
  filter?: string;
  limit?: number;
  page?: number;
};

export async function getAllFields(params?: GetFieldsParams): Promise<GetFieldsResponse> {
  try {
    const response = await API.get(API_ROUTES.fields.list, { params });
    return response.data;
  } catch (error: any) {
    // If unauthorized and no token, try without auth (in case fields are public)
    if (error.response?.status === 401) {
      console.log("Fields endpoint requires authentication. Redirecting to login...");
      throw new Error("Authentication required to access fields. Please log in.");
    }
    throw error;
  }
}

export async function getFieldsByLocation(locationId: string, params?: GetFieldsParams): Promise<GetFieldsResponse> {
  const response = await API.get(API_ROUTES.fields.byLocation(locationId), { params });
  return response.data;
}

export async function createField(payload: CreateFieldPayload) {
  const response = await API.post(API_ROUTES.fields.list, payload);
  return response.data;
}

export async function getField(id: string): Promise<{ data: Field }> {
  const response = await API.get(API_ROUTES.fields.details(id));
  return response.data;
}

export async function updateField(id: string, payload: UpdateFieldPayload) {
  const response = await API.patch(API_ROUTES.fields.details(id), payload);
  return response.data;
}

export async function deleteField(id: string) {
  const response = await API.delete(API_ROUTES.fields.details(id));
  return response.data;
} 
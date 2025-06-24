import { API, API_ROUTES } from "@/lib/api";

export type CreateFieldPayload = {
  description: string;
  location_id: string;
  name: string;
  price: number;
  type: string;
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

export async function createField(payload: CreateFieldPayload) {
  const response = await API.post(API_ROUTES.fields.list, payload);
  return response.data;
}

export async function getField(id: string): Promise<Field> {
  const response = await API.get(API_ROUTES.fields.details(id));
  return response.data.data;
}

export async function updateField(id: string, payload: CreateFieldPayload) {
  const response = await API.put(API_ROUTES.fields.details(id), payload);
  return response.data;
}

export async function deleteField(id: string) {
  const response = await API.delete(API_ROUTES.fields.details(id));
  return response.data;
} 
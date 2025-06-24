import { API_ROUTES, API } from "@/lib/api";

// getAllLocationsResponse
export interface Location {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  created_at: string;
  updated_at: string;
}

export interface GetAllLocationsResponse {
  data: {
    locations: Location[];
    total_items: number;
    total_pages: number;
  };
}

export interface ErrorResponse {
  error: string;
}

export interface GetAllLocationsParams {
  filter?: string;
  limit?: number;
  page?: number;
}

export async function getAllLocations(params: GetAllLocationsParams) {
  try {
    const response = await API.get<GetAllLocationsResponse>(API_ROUTES.locations.list, {
      params,
    });
    if (response.status === 200) {
      return response.data;
    }
    throw new Error("Failed to fetch locations");
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.error || "Unknown error");
    }
    throw error;
  }
}

// post to create a new location
export interface CreateLocationRequest {
  name: string;
  description: string;
  latitude: number;
  longitude: number;
}

export interface CreateLocationSuccessResponse {
  data: string;
}

export async function createLocation(location: CreateLocationRequest) {
  try {
    const response = await API.post<CreateLocationSuccessResponse>(
      API_ROUTES.locations.list,
      location
    );
    if (response.status === 201) {
      return response.data;
    }
    throw new Error("Failed to create location");
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.error || "Unknown error");
    }
    throw error;
  }
}

// getLocationById
export interface GetLocationByIdResponse {
  data: Location;
}

export async function getLocationById(id: string) {
  try {
    const response = await API.get<GetLocationByIdResponse>(
      API_ROUTES.locations.details(id)
    );
    if (response.status === 200) {
      return response.data;
    }
    throw new Error("Failed to fetch location by id");
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.error || "Unknown error");
    }
    throw error;
  }
}

// put to update a location by id
export interface UpdateLocationRequest {
  name?: string;
  description?: string;
  latitude?: number;
  longitude?: number;
}

export interface UpdateLocationResponse {
  data: string;
}

export async function updateLocationById(id: string, location: UpdateLocationRequest) {
  try {
    const response = await API.patch<UpdateLocationResponse>(
      API_ROUTES.locations.details(id),
      location
    );
    if (response.status === 200) {
      return response.data;
    }
    throw new Error("Failed to update location");
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.error || "Unknown error");
    }
    throw error;
  }
}

// delete a location by id
export interface DeleteLocationResponse {
  data: string;
}

export async function deleteLocationById(id: string) {
  try {
    const response = await API.delete<DeleteLocationResponse>(
      API_ROUTES.locations.details(id)
    );
    if (response.status === 200) {
      return response.data;
    }
    throw new Error("Failed to delete location");
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.error || "Unknown error");
    }
    throw error;
  }
}
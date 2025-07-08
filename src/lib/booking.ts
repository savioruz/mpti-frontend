import { API, API_ROUTES } from "@/lib/api";

export type CreateBookingRequest = {
  date: string; // Format: "2006-01-02"
  duration: number;
  field_id: string;
  start_time: string; // Format: "15:04"
  cash: boolean;
};

export type BookingResponse = {
  id: string;
  booking_date: string;
  created_at: string;
  end_time: string;
  field_id: string;
  field_name?: string; // Optional for backward compatibility
  start_time: string;
  status: "PENDING" | "EXPIRED" | "CANCELLED";
  total_price: number;
  updated_at: string;
};

export type GetBookedSlotsRequest = {
  date: string; // Format: "2006-01-02"
  field_id: string;
};

export type BookedSlot = {
  start_time: string;
  end_time: string;
};

export type GetBookedSlotsResponse = {
  data: {
    booked_slots: BookedSlot[];
    field_id: string;
    total_items: number;
  };
};

export type GetBookingsResponse = {
  data: {
    bookings: BookingResponse[];
    total_items: number;
    total_pages: number;
  };
};

export type GetBookingsParams = {
  filter?: string;
  limit?: number;
  page?: number;
};

export async function createBooking(payload: CreateBookingRequest): Promise<{ data: string }> {
  const response = await API.post(API_ROUTES.bookings.create, payload);
  return response.data;
}

export async function getBookedSlots(payload: GetBookedSlotsRequest): Promise<GetBookedSlotsResponse> {
  const response = await API.post(API_ROUTES.bookings.slots, payload);
  return response.data;
}

export async function getUserBookings(params?: GetBookingsParams): Promise<GetBookingsResponse> {
  const response = await API.get(API_ROUTES.bookings.list, { params });
  return response.data;
}

export type AdminBookingsResponse = GetBookingsResponse & {
  isAdminEndpoint?: boolean;
};

// Admin function to get all bookings - tries admin endpoint first, falls back to user endpoint
export async function getAdminBookings(params?: GetBookingsParams): Promise<AdminBookingsResponse> {
  try {
    // First try GET /bookings/ for admin to get all bookings
    const response = await API.get(API_ROUTES.bookings.adminList, { params });
    return {
      ...response.data,
      isAdminEndpoint: true
    };
  } catch (error) {
    // If admin endpoint doesn't exist or fails, fall back to user bookings endpoint
    console.warn('Admin bookings endpoint (GET /bookings/) not available or failed, falling back to user bookings');
    const response = await API.get(API_ROUTES.bookings.list, { params });
    return {
      ...response.data,
      isAdminEndpoint: false
    };
  }
}

export async function getBookingById(id: string): Promise<{ data: BookingResponse }> {
  const response = await API.get(API_ROUTES.bookings.details(id));
  return response.data;
}

export async function cancelBooking(id: string): Promise<{ data: string }> {
  const response = await API.put(API_ROUTES.bookings.cancel(id));
  return response.data;
}

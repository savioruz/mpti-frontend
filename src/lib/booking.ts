import { API, API_ROUTES } from "@/lib/api";

export type CreateBookingRequest = {
  date: string; // Format: "2006-01-02"
  duration: number;
  field_id: string;
  start_time: string; // Format: "15:04"
};

export type BookingResponse = {
  id: string;
  booking_date: string;
  created_at: string;
  end_time: string;
  field_id: string;
  start_time: string;
  status: string;
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

export async function getBookingById(id: string): Promise<{ data: BookingResponse }> {
  const response = await API.get(API_ROUTES.bookings.details(id));
  return response.data;
}

export async function cancelBooking(id: string): Promise<{ data: string }> {
  const response = await API.put(API_ROUTES.bookings.cancel(id));
  return response.data;
}

import { createFileRoute } from "@tanstack/react-router";
import BookingManagement from "@/components/booking/booking-management";

export const Route = createFileRoute("/bookings")({
  component: BookingManagement,
});

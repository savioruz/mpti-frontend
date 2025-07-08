import { createFileRoute } from '@tanstack/react-router'
import { BookingDetails } from '@/components/pages/booking-details'

export const Route = createFileRoute('/booking/$bookingId')({
  component: () => <BookingDetails />,
})

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Eye } from "lucide-react";
import { format } from "date-fns";
import { Link } from "@tanstack/react-router";
import { type BookingResponse } from "@/lib/booking";
import { type Field } from "@/lib/field";
import { type Location } from "@/lib/location";

interface BookingCardProps {
  booking: BookingResponse;
  field?: Field;
  location?: Location;
  onCancelBooking?: (bookingId: string) => void;
  isCanceling?: boolean;
  className?: string;
}

export const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  field,
  location,
  onCancelBooking,
  isCanceling = false,
  className = "",
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-800 border-green-300";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "CANCELLED":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800 border-blue-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Helper function to determine if a booking can be canceled
  const canCancelBooking = (status: string) => {
    // Only allow cancellation for pending and confirmed bookings
    const cancelableStatuses = ["PENDING", "CONFIRMED"];
    return cancelableStatuses.includes(status.toUpperCase());
  };

  return (
    <Card className={`border-l-4 border-l-blue-500 ${className}`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg">
                {field?.name || "Loading..."}
              </h3>
              <Badge className={getStatusColor(booking.status)}>
                {booking.status}
              </Badge>
            </div>

            {/* Location and Date Info */}
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{location?.name || "Loading location..."}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{format(new Date(booking.booking_date), "PPP")}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>
                  {booking.start_time} - {booking.end_time}
                </span>
              </div>
            </div>

            {/* Price and Created Date */}
            <div className="flex items-center gap-4 text-sm">
              <span className="font-medium">
                Total: {formatPrice(booking.total_price)}
              </span>
              <span className="text-gray-500">
                Booked on {format(new Date(booking.created_at), "PPp")}
              </span>
            </div>

            {/* Field Description */}
            {field?.description && (
              <p className="text-sm text-gray-600 mt-2">{field.description}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="ml-4 flex flex-col gap-2">
            <Button asChild variant="outline" size="sm">
              <Link to="/booking/$bookingId" params={{ bookingId: booking.id }}>
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Link>
            </Button>
            {canCancelBooking(booking.status) && onCancelBooking && (
              <button
                onClick={() => onCancelBooking(booking.id)}
                disabled={isCanceling}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded text-sm transition-colors disabled:opacity-50"
              >
                {isCanceling ? "Cancelling..." : "Cancel"}
              </button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingCard;

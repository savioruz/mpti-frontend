import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Calendar, Clock, MapPin, Eye, CreditCard } from "lucide-react";
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
        return "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-700";
      case "PENDING":
        return "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-700";
      case "CANCELLED":
        return "bg-red-100 text-red-800 border-red-300 dark:bg-red-950/30 dark:text-red-400 dark:border-red-700";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-700";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-950/30 dark:text-gray-400 dark:border-gray-700";
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
    <Card className={cn("border-0 shadow-xl bg-card/95 dark:bg-slate-800/95 backdrop-blur-sm", className)}>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Header with Field Name and Status */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-foreground">
                {field?.name || "Loading..."}
              </h3>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{location?.name || "Loading location..."}</span>
              </div>
            </div>
            <Badge className={cn("px-4 py-2 rounded-full font-medium", getStatusColor(booking.status))}>
              {booking.status}
            </Badge>
          </div>

          {/* Booking Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Date */}
            <div className="p-4 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-950/30 dark:to-cyan-950/30 rounded-xl border border-teal-200 dark:border-teal-800">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-teal-600" />
                <div>
                  <div className="text-sm text-muted-foreground">Date</div>
                  <div className="font-semibold text-foreground">
                    {format(new Date(booking.booking_date), "MMM d, yyyy")}
                  </div>
                </div>
              </div>
            </div>

            {/* Time */}
            <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-emerald-600" />
                <div>
                  <div className="text-sm text-muted-foreground">Time</div>
                  <div className="font-semibold text-foreground">
                    {booking.start_time} - {booking.end_time}
                  </div>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-xl border border-amber-200 dark:border-amber-800">
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-amber-600" />
                <div>
                  <div className="text-sm text-muted-foreground">Total</div>
                  <div className="font-semibold text-foreground">
                    {formatPrice(booking.total_price)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Field Description */}
          {field?.description && (
            <div className="p-4 bg-muted/30 rounded-xl">
              <p className="text-sm text-muted-foreground leading-relaxed">{field.description}</p>
            </div>
          )}

          {/* Booking Info */}
          <div className="p-4 bg-card/50 dark:bg-slate-700/50 rounded-xl">
            <div className="text-sm text-muted-foreground">
              Booked on {format(new Date(booking.created_at), "PPp")}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button 
              asChild 
              className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              <Link to="/booking/$bookingId" params={{ bookingId: booking.id }}>
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Link>
            </Button>
            {canCancelBooking(booking.status) && onCancelBooking && (
              <Button
                variant="outline"
                onClick={() => onCancelBooking(booking.id)}
                disabled={isCanceling}
                className="flex-1 border-red-300 text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-950/20 rounded-xl"
              >
                {isCanceling ? "Cancelling..." : "Cancel Booking"}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingCard;

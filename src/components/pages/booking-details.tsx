import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Calendar,
  Clock,
  MapPin,
  CreditCard,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { getBookingById, type BookingResponse } from "@/lib/booking";
import { getField, type Field } from "@/lib/field";
import { getLocationById, type Location } from "@/lib/location";
import { PaymentStatusBadge } from "@/components/payment/payment-status";
import {
  getPaymentByBookingId,
  openPaymentInNewTab,
  type PaymentStatus,
  type PaymentResponse,
} from "@/lib/payment";
import { format } from "date-fns";

interface BookingDetailsState {
  booking: BookingResponse | null;
  field: Field | null;
  location: Location | null;
  payments: PaymentResponse[] | null;
  loading: boolean;
  error: string | null;
}

export const BookingDetails: React.FC = () => {
  const { bookingId } = useParams({ strict: false }) as { bookingId: string };
  const navigate = useNavigate();

  const [state, setState] = useState<BookingDetailsState>({
    booking: null,
    field: null,
    location: null,
    payments: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const loadBookingDetails = async () => {
      if (!bookingId) {
        setState((prev) => ({
          ...prev,
          error: "Booking ID is required",
          loading: false,
        }));
        return;
      }

      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        // Load booking details
        const bookingResponse = await getBookingById(bookingId);
        const booking = bookingResponse.data;

        // Load field details
        const fieldResponse = await getField(booking.field_id);
        const field = fieldResponse.data;

        // Load location details
        let location: Location | null = null;
        try {
          const locationResponse = await getLocationById(field.location_id);
          location = locationResponse.data;
        } catch (locationError) {
          console.warn("Failed to load location details:", locationError);
          // Continue without location details
        }

        // Load payment details
        let payments: PaymentResponse[] = [];
        try {
          const paymentsResponse = await getPaymentByBookingId(bookingId);
          payments = paymentsResponse.data;
          console.log("Payment details loaded:", payments);
        } catch (paymentError) {
          console.warn("Failed to load payment details:", paymentError);
          // Payment details might not be available yet, it's okay
        }

        setState({
          booking,
          field,
          location,
          payments,
          loading: false,
          error: null,
        });
      } catch (error: any) {
        let errorMessage = "Failed to load booking details";

        if (error.response?.status === 404) {
          errorMessage = "Booking not found";
        } else if (error.response?.status === 401) {
          errorMessage = "Please log in to view booking details";
        } else if (error.response?.status === 403) {
          errorMessage = "You don't have permission to view this booking";
        } else if (error.response?.data?.error) {
          errorMessage = error.response.data.error;
        } else if (error.message) {
          errorMessage = error.message;
        }

        setState((prev) => ({
          ...prev,
          loading: false,
          error: errorMessage,
        }));
        toast.error(errorMessage);
      }
    };

    loadBookingDetails();
  }, [bookingId]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

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

  const handlePayNow = () => {
    // Find the most recent pending payment
    const pendingPayment = state.payments?.find(
      (payment) => payment.payment_status === "PENDING",
    );

    if (pendingPayment && pendingPayment.transaction_id) {
      // Use the payment utility to open the payment URL
      openPaymentInNewTab(pendingPayment.transaction_id);
      toast.info(
        "Payment page opened in a new tab. Please complete your payment there.",
      );
    } else if (pendingPayment && !pendingPayment.transaction_id) {
      toast.error("Payment URL not available. Transaction ID is missing.");
    } else {
      toast.info("No pending payment found for this booking.");
    }
  };

  if (state.loading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate({ to: "/bookings" })}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Bookings
          </Button>
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-16 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (state.error || !state.booking) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate({ to: "/bookings" })}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Bookings
          </Button>
        </div>

        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-red-500 mb-4">
              <CreditCard className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Error Loading Booking
              </h3>
              <p className="text-gray-600">{state.error}</p>
            </div>
            <Button onClick={() => navigate({ to: "/bookings" })}>
              Go to My Bookings
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { booking, field, location } = state;

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate({ to: "/bookings" })}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Bookings
        </Button>
      </div>

      {/* Booking Details */}
      <div className="space-y-6">
        {/* Main Booking Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Booking Details</CardTitle>
                <CardDescription>Booking ID: {booking.id}</CardDescription>
              </div>
              <Badge className={getStatusColor(booking.status)}>
                {booking.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Field Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Field Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">
                      {field?.name || "Loading..."}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Location:{" "}
                    {location?.name || "Location information unavailable"}
                  </div>
                  {field?.description && (
                    <div className="text-sm text-gray-600">
                      {field.description}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Booking Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>{format(new Date(booking.booking_date), "PPP")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>
                      {booking.start_time} - {booking.end_time}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Booked on: {format(new Date(booking.created_at), "PPp")}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="border-t pt-6">
              <h3 className="font-semibold text-lg mb-4">
                Payment Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">
                    Total Amount: {formatPrice(booking.total_price)}
                  </span>
                </div>

                {state.payments && state.payments.length > 0 ? (
                  <div className="space-y-3">
                    {state.payments.map((payment) => (
                      <div key={payment.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <PaymentStatusBadge
                              status={payment.payment_status as PaymentStatus}
                              amount={booking.total_price}
                              showPayButton={false}
                            />

                            {payment.payment_method && (
                              <span className="text-sm text-gray-600">
                                via {payment.payment_method}
                              </span>
                            )}
                          </div>

                          {payment.payment_status === "PENDING" &&
                            payment.transaction_id && (
                              <Button
                                onClick={handlePayNow}
                                className="flex items-center gap-2"
                              >
                                <ExternalLink className="h-4 w-4" />
                                Pay Now
                              </Button>
                            )}
                        </div>

                        <div className="text-sm text-gray-600 space-y-1">
                          <div>Payment ID: {payment.id}</div>
                          {payment.transaction_id && (
                            <div>Transaction ID: {payment.transaction_id}</div>
                          )}
                          <div>
                            Created:{" "}
                            {format(new Date(payment.created_at), "PPp")}
                          </div>
                          {payment.paid_at && (
                            <div>
                              Paid: {format(new Date(payment.paid_at), "PPp")}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-600">
                    Payment information not available yet
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => navigate({ to: "/bookings" })}
          >
            View All Bookings
          </Button>
          {booking.status !== "CANCELLED" && (
            <Button
              variant="outline"
              onClick={() => navigate({ to: "/fields" })}
            >
              Book Another Field
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

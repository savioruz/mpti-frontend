import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
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
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8">        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <Button 
            variant="ghost" 
            onClick={() => navigate({ to: "/bookings" })}
            className="mb-6 hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Bookings
          </Button>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl mb-6 shadow-lg">
              <CreditCard className="h-8 w-8 text-white" />
            </div>
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-48 mx-auto" />
          </div>
        </div>

          <Card className="border-0 shadow-xl bg-card/95 dark:bg-slate-800/95 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-24 w-full" />
                </div>
                <div className="space-y-4">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-24 w-full" />
                </div>
              </div>
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (state.error || !state.booking) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8">        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <Button 
            variant="ghost" 
            onClick={() => navigate({ to: "/bookings" })}
            className="mb-6 hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Bookings
          </Button>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl mb-6 shadow-lg">
              <CreditCard className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-foreground via-red-600 to-red-600 bg-clip-text text-transparent mb-4">
              Booking Not Found
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {state.error || "Unable to load booking details"}
            </p>
          </div>
        </div>

          <Card className="border-0 shadow-xl bg-card/95 dark:bg-slate-800/95 backdrop-blur-sm max-w-2xl mx-auto">
            <CardContent className="p-12 text-center">
              <div className="space-y-6">
                <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-950/30 dark:to-red-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <CreditCard className="h-10 w-10 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">Error Loading Booking</h3>
                  <p className="text-muted-foreground leading-relaxed">{state.error}</p>
                </div>
                <Button 
                  onClick={() => navigate({ to: "/bookings" })}
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                >
                  Go to My Bookings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const { booking, field, location } = state;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8">      {/* Hero Section */}
      <div className="mb-8 sm:mb-12">
        <Button 
          variant="ghost" 
          onClick={() => navigate({ to: "/bookings" })}
          className="mb-6 hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Bookings
        </Button>
        
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl mb-6 shadow-lg">
            <CreditCard className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-foreground via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
            Booking Details
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Review your booking information and complete payment if needed
          </p>
        </div>
      </div>

        {/* Status Badge */}
        <div className="text-center mb-8">
          <Badge className={cn(
            "px-6 py-2 text-lg font-semibold rounded-full shadow-lg",
            getStatusColor(booking.status)
          )}>
            {booking.status}
          </Badge>
        </div>

        {/* Main Content */}
        <div className="space-y-8 sm:space-y-12">
          {/* Booking Information Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Field Information Card */}
            <Card className="border-0 shadow-xl bg-card/95 dark:bg-slate-800/95 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-foreground">Field Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800">
                    <h3 className="font-semibold text-lg text-foreground mb-2">
                      {field?.name || "Loading..."}
                    </h3>
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                      <MapPin className="h-4 w-4" />
                      <span>{location?.name || "Location information unavailable"}</span>
                    </div>
                    {field?.description && (
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {field.description}
                      </p>
                    )}
                  </div>
                  
                  <div className="p-4 bg-card/50 dark:bg-slate-700/50 rounded-xl">
                    <div className="text-sm text-muted-foreground mb-1">Booking ID</div>
                    <div className="font-mono text-xs text-foreground break-all">{booking.id}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Booking Schedule Card */}
            <Card className="border-0 shadow-xl bg-card/95 dark:bg-slate-800/95 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-foreground">Schedule Details</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-4 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-950/30 dark:to-cyan-950/30 rounded-xl border border-teal-200 dark:border-teal-800">
                    <div className="flex items-center gap-3 mb-3">
                      <Calendar className="h-5 w-5 text-teal-600" />
                      <span className="font-semibold text-lg text-foreground">
                        {format(new Date(booking.booking_date), "EEEE, MMMM d, yyyy")}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-teal-600" />
                      <span className="font-semibold text-lg text-foreground">
                        {booking.start_time} - {booking.end_time}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-card/50 dark:bg-slate-700/50 rounded-xl">
                    <div className="text-sm text-muted-foreground mb-1">Booked on</div>
                    <div className="text-sm text-foreground">{format(new Date(booking.created_at), "PPp")}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Information Card */}
          <Card className="border-0 shadow-xl bg-card/95 dark:bg-slate-800/95 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-foreground">Payment Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Total Amount */}
              <div className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-xl border border-amber-200 dark:border-amber-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-6 w-6 text-amber-600" />
                    <span className="text-lg font-semibold text-foreground">Total Amount</span>
                  </div>
                  <span className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                    {formatPrice(booking.total_price)}
                  </span>
                </div>
              </div>

              {/* Payment Details */}
              {state.payments && state.payments.length > 0 ? (
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg text-foreground">Payment History</h4>
                  {state.payments.map((payment) => (
                    <Card key={payment.id} className="border border-border/50 bg-card/50 dark:bg-slate-700/50">
                      <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                          <div className="flex items-center gap-3">
                            <PaymentStatusBadge
                              status={payment.payment_status as PaymentStatus}
                              amount={booking.total_price}
                              showPayButton={false}
                            />
                          </div>

                          {payment.payment_status === "PENDING" && payment.transaction_id && (
                            <Button
                              onClick={handlePayNow}
                              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Pay Now
                            </Button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-muted-foreground mb-1">Payment ID</div>
                            <div className="font-mono text-xs text-foreground break-all">{payment.id}</div>
                          </div>
                          {payment.transaction_id && (
                            <div>
                              <div className="text-muted-foreground mb-1">Transaction ID</div>
                              <div className="font-mono text-xs text-foreground break-all">{payment.transaction_id}</div>
                            </div>
                          )}
                          <div>
                            <div className="text-muted-foreground mb-1">Amount</div>
                            <div className="font-mono text-foreground">{formatPrice(booking.total_price)}</div>
                          </div>
                          {payment.payment_method && (
                            <div>
                              <div className="text-muted-foreground mb-1">Payment Method</div>
                              <div className="font-mono text-foreground">{payment.payment_method}</div>
                            </div>
                          )}
                          <div>
                            <div className="text-muted-foreground mb-1">Created</div>
                            <div className="text-foreground">{format(new Date(payment.created_at), "PPp")}</div>
                          </div>
                          {payment.paid_at && (
                            <div>
                              <div className="text-muted-foreground mb-1">Paid</div>
                              <div className="text-foreground">{format(new Date(payment.paid_at), "PPp")}</div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="p-6 bg-muted/30 rounded-xl text-center">
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                    <CreditCard className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">Payment information not available yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="outline"
              onClick={() => navigate({ to: "/bookings" })}
              className="px-8 py-3 border-emerald-300 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-700 dark:text-emerald-400 dark:hover:bg-emerald-950/20"
            >
              View All Bookings
            </Button>
            {booking.status !== "CANCELLED" && (
              <Button
                onClick={() => navigate({ to: "/fields" })}
                className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              >
                Book Another Field
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

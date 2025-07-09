import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Search, RefreshCw, Plus, AlertCircle, Calendar } from "lucide-react";
import { toast } from "sonner";
import {
  getUserBookings,
  cancelBooking,
  type BookingResponse,
} from "@/lib/booking";
import { getField, type Field } from "@/lib/field";
import { getLocationById, type Location } from "@/lib/location";
import { BookingCard } from "@/components/booking/booking-card";

interface BookingDetailsMap {
  [key: string]: {
    field: Field;
    location: Location;
  };
}

const BookingManagement: React.FC = () => {
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [bookingDetails, setBookingDetails] = useState<BookingDetailsMap>({});
  const [loading, setLoading] = useState({
    bookings: false,
    canceling: "",
    refreshing: false,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    setLoading((prev) => ({ ...prev, bookings: true }));
    try {
      const response = await getUserBookings({ limit: 100 });
      setBookings(response.data.bookings);

      // Load field and location details for each booking
      const details: BookingDetailsMap = {};

      for (const booking of response.data.bookings) {
        try {
          const fieldResponse = await getField(booking.field_id);
          const field = fieldResponse.data;
          const locationResponse = await getLocationById(field.location_id);
          const location = locationResponse.data;

          details[booking.id] = { field, location };
        } catch (error) {
          // Skip if unable to load details for this booking
        }
      }

      setBookingDetails(details);
    } catch (error: any) {
      let errorMessage = "Failed to load bookings";

      if (error.response?.status === 401) {
        errorMessage = "Please log in to view your bookings";
      } else if (error.response?.status === 403) {
        errorMessage = "You don't have permission to view bookings";
      } else if (error.response?.status >= 500) {
        errorMessage = "Server error. Please try again later";
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      setLoading((prev) => ({ ...prev, bookings: false }));
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    setLoading((prev) => ({ ...prev, canceling: bookingId }));
    try {
      await cancelBooking(bookingId);
      toast.success("Booking cancelled successfully");

      // Update the booking status in the state
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === bookingId
            ? { ...booking, status: "CANCELLED" as const }
            : booking,
        ),
      );
    } catch (error: any) {
      let errorMessage = "Failed to cancel booking";

      if (error.response?.status === 400) {
        if (error.response?.data?.error) {
          errorMessage = error.response.data.error;
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.response?.status === 401) {
        errorMessage = "Please log in to cancel bookings";
      } else if (error.response?.status === 403) {
        errorMessage = "You don't have permission to cancel this booking";
      } else if (error.response?.status === 404) {
        errorMessage = "Booking not found";
      } else if (error.response?.status === 409) {
        errorMessage = "This booking cannot be cancelled";
      } else if (error.response?.status >= 500) {
        errorMessage = "Server error. Please try again later";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      setLoading((prev) => ({ ...prev, canceling: "" }));
    }
  };

  const handleRefresh = async () => {
    setLoading((prev) => ({ ...prev, refreshing: true }));
    await loadBookings();
    setLoading((prev) => ({ ...prev, refreshing: false }));
    toast.success("Bookings refreshed");
  };

  // Filter bookings based on search term and status
  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      searchTerm === "" ||
      bookingDetails[booking.id]?.field?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      bookingDetails[booking.id]?.location?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      booking.status.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusCount = (status: string) => {
    return bookings.filter((booking) =>
      status === "all" ? true : booking.status === status,
    ).length;
  };

  const statusOptions = [
    { value: "all", label: "All Bookings", count: getStatusCount("all") },
    {
      value: "CONFIRMED",
      label: "Confirmed",
      count: getStatusCount("CONFIRMED"),
    },
    { value: "PENDING", label: "Pending", count: getStatusCount("PENDING") },
    {
      value: "CANCELLED",
      label: "Cancelled",
      count: getStatusCount("CANCELLED"),
    },
    {
      value: "COMPLETED",
      label: "Completed",
      count: getStatusCount("COMPLETED"),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
        {/* Hero Section */}
        <div className="mb-8 sm:mb-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl mb-6 shadow-lg">
              <Calendar className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-foreground via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
              My Bookings
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Manage your field reservations and payments
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={loading.refreshing}
            className="px-6 py-3 border-emerald-300 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-700 dark:text-emerald-400 dark:hover:bg-emerald-950/20"
          >
            <RefreshCw
              className={cn("h-4 w-4 mr-2", loading.refreshing && "animate-spin")}
            />
            Refresh
          </Button>
          <Button 
            asChild
            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
          >
            <a href="/fields">
              <Plus className="h-4 w-4 mr-2" />
              New Booking
            </a>
          </Button>
        </div>

        {/* Search and Filter Section */}
        <Card className="border-0 shadow-xl bg-card/95 dark:bg-slate-800/95 backdrop-blur-sm mb-8">
          <CardHeader className="pb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center">
                <Search className="h-5 w-5 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-foreground">Search & Filter</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search bookings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-0 bg-muted/50 focus:bg-background transition-colors"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {statusOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={statusFilter === option.value ? "default" : "outline"}
                  onClick={() => setStatusFilter(option.value)}
                  className={cn(
                    "flex items-center gap-2 rounded-xl transition-all duration-300",
                    statusFilter === option.value
                      ? "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg"
                      : "border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-700 dark:text-emerald-400 dark:hover:bg-emerald-950/20"
                  )}
                >
                  {option.label}
                  <Badge 
                    variant="secondary" 
                    className={cn(
                      "ml-1",
                      statusFilter === option.value
                        ? "bg-white/20 text-white"
                        : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400"
                    )}
                  >
                    {option.count}
                  </Badge>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bookings List */}
        <div className="space-y-6">
          {loading.bookings ? (
            // Loading skeleton
            <div className="space-y-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="border-0 shadow-xl bg-card/95 dark:bg-slate-800/95 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-6 w-20" />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-40" />
                      </div>
                      <div className="flex justify-end">
                        <Skeleton className="h-10 w-32" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredBookings.length === 0 ? (
            <Card className="border-0 shadow-xl bg-card/95 dark:bg-slate-800/95 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <div className="space-y-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-muted to-muted/80 rounded-2xl flex items-center justify-center mx-auto">
                    <AlertCircle className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      No bookings found
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {searchTerm || statusFilter !== "all"
                        ? "No bookings match your search criteria."
                        : "You haven't made any bookings yet."}
                    </p>
                    <Button 
                      asChild
                      className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                    >
                      <a href="/fields">
                        <Plus className="h-4 w-4 mr-2" />
                        Book a Field
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                field={bookingDetails[booking.id]?.field}
                location={bookingDetails[booking.id]?.location}
                onCancelBooking={handleCancelBooking}
                isCanceling={loading.canceling === booking.id}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingManagement;

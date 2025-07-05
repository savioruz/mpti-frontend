import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, RefreshCw, Plus, AlertCircle } from 'lucide-react';
import { toast } from "sonner";
import { getUserBookings, cancelBooking, type BookingResponse } from "@/lib/booking";
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
    setLoading(prev => ({ ...prev, bookings: true }));
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
      toast.error('Failed to load bookings');
    } finally {
      setLoading(prev => ({ ...prev, bookings: false }));
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    setLoading(prev => ({ ...prev, canceling: bookingId }));
    try {
      await cancelBooking(bookingId);
      toast.success('Booking cancelled successfully');
      
      // Update the booking status in the state
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: 'CANCELLED' as const }
            : booking
        )
      );
    } catch (error: any) {
      toast.error('Failed to cancel booking');
    } finally {
      setLoading(prev => ({ ...prev, canceling: "" }));
    }
  };

  const handlePayNow = (paymentUrl: string) => {
    // Open payment URL in a new tab
    window.open(paymentUrl, '_blank');
    
    // Show a toast to inform the user
    toast.info('Payment page opened in a new tab. Please complete your payment there.');
  };

  const handleRefresh = async () => {
    setLoading(prev => ({ ...prev, refreshing: true }));
    await loadBookings();
    setLoading(prev => ({ ...prev, refreshing: false }));
    toast.success('Bookings refreshed');
  };

  // Filter bookings based on search term and status
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = searchTerm === "" || 
      bookingDetails[booking.id]?.field?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bookingDetails[booking.id]?.location?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.status.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusCount = (status: string) => {
    return bookings.filter(booking => 
      status === "all" ? true : booking.status === status
    ).length;
  };

  const statusOptions = [
    { value: "all", label: "All Bookings", count: getStatusCount("all") },
    { value: "CONFIRMED", label: "Confirmed", count: getStatusCount("CONFIRMED") },
    { value: "PENDING", label: "Pending", count: getStatusCount("PENDING") },
    { value: "CANCELLED", label: "Cancelled", count: getStatusCount("CANCELLED") },
    { value: "COMPLETED", label: "Completed", count: getStatusCount("COMPLETED") },
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">My Bookings</h1>
          <p className="text-gray-600 mt-2">Manage your field reservations and payments</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={loading.refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading.refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button asChild>
            <a href="/fields">
              <Plus className="h-4 w-4 mr-2" />
              New Booking
            </a>
          </Button>
        </div>
      </div>

      {/* Search and Filter Section */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              {statusOptions.map(option => (
                <Button
                  key={option.value}
                  variant={statusFilter === option.value ? "default" : "outline"}
                  onClick={() => setStatusFilter(option.value)}
                  className="flex items-center gap-2"
                >
                  {option.label}
                  <Badge variant="secondary" className="ml-1">
                    {option.count}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bookings List */}
      <div className="space-y-4">
        {loading.bookings ? (
          // Loading skeleton
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="border-l-4 border-l-gray-300">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : filteredBookings.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookings found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || statusFilter !== "all" 
                  ? "No bookings match your search criteria." 
                  : "You haven't made any bookings yet."}
              </p>
              <Button asChild>
                <a href="/fields">
                  <Plus className="h-4 w-4 mr-2" />
                  Book a Field
                </a>
              </Button>
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
              onPayNow={handlePayNow}
              isCanceling={loading.canceling === booking.id}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default BookingManagement;

import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar, Clock, MapPin, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { getUserRole, type JWTPayload, decodeToken, getAccessToken } from "@/lib/auth";
import { getUserBookings, cancelBooking, type BookingResponse } from "@/lib/booking";
import { getField, type Field } from "@/lib/field";
import { getLocationById, type Location } from "@/lib/location";
import { PaymentStatusBadge } from "@/components/payment/payment-status";
import { type PaymentStatus } from "@/lib/payment";

const UserDashboard: React.FC = () => {
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [bookingDetails, setBookingDetails] = useState<{ [key: string]: { field: Field; location: Location } }>({});
  const [loading, setLoading] = useState({
    bookings: false,
    canceling: "",
  });

  // Get user information from JWT token
  const token = getAccessToken();
  const userInfo = decodeToken(token) as JWTPayload | null;
  const userRole = getUserRole();

  useEffect(() => {
    loadUserBookings();
  }, []);

  const loadUserBookings = async () => {
    setLoading(prev => ({ ...prev, bookings: true }));
    try {
      const response = await getUserBookings({ limit: 100 });
      setBookings(response.data.bookings);
      
      // Load field and location details for each booking
      const details: { [key: string]: { field: Field; location: Location } } = {};
      
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
      toast.error(error.message || "Failed to load bookings");
    } finally {
      setLoading(prev => ({ ...prev, bookings: false }));
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    setLoading(prev => ({ ...prev, canceling: bookingId }));
    try {
      await cancelBooking(bookingId);
      toast.success("Booking cancelled successfully");
      // Remove the cancelled booking from the list
      setBookings(prev => prev.filter(booking => booking.id !== bookingId));
      // Clean up booking details
      setBookingDetails(prev => {
        const updated = { ...prev };
        delete updated[bookingId];
        return updated;
      });
    } catch (error: any) {
      toast.error(error.message || "Failed to cancel booking");
    } finally {
      setLoading(prev => ({ ...prev, canceling: "" }));
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">User Dashboard</h1>
        <Button onClick={loadUserBookings} disabled={loading.bookings}>
          {loading.bookings ? "Loading..." : "Refresh"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Welcome to Your Dashboard</CardTitle>
          <CardDescription>You are logged in as a regular user (level {userRole})</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">User Information</h3>
              <p>Email: {userInfo?.email}</p>
              <p>ID: {userInfo?.id}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bookings Section */}
      <Card>
        <CardHeader>
          <CardTitle>Your Bookings</CardTitle>
          <CardDescription>
            View and manage your field bookings
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading.bookings ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Loading your bookings...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">You have no bookings yet.</p>
              <p className="text-sm text-gray-400 mt-2">Book a field to see your reservations here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => {
                const details = bookingDetails[booking.id];
                
                return (
                  <Card key={booking.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg">
                              {details?.field?.name || "Loading..."}
                            </h3>
                            <Badge className={getStatusColor(booking.status)}>
                              {booking.status}
                            </Badge>
                          </div>
                          
                          {details && (
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                <span>{details.location.name}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>{format(new Date(booking.booking_date), "PPP")}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>{booking.start_time} - {booking.end_time}</span>
                              </div>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-4 text-sm">
                            <span className="font-medium">
                              Total: {formatPrice(booking.total_price)}
                            </span>
                            <span className="text-gray-500">
                              Booked on {format(new Date(booking.created_at), "PPp")}
                            </span>
                          </div>
                          
                          {/* Payment Status */}
                          {booking.payment_status && (
                            <div className="mt-2">
                              <PaymentStatusBadge
                                status={booking.payment_status as PaymentStatus}
                                amount={booking.total_price}
                                paymentUrl={booking.payment_url}
                                showPayButton={booking.payment_status === "PENDING"}
                              />
                            </div>
                          )}
                          
                          {details?.field?.description && (
                            <p className="text-sm text-gray-600 mt-2">
                              {details.field.description}
                            </p>
                          )}
                        </div>
                        
                        {booking.status !== 'CANCELLED' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCancelBooking(booking.id)}
                            disabled={loading.canceling === booking.id}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            {loading.canceling === booking.id ? (
                              "Cancelling..."
                            ) : (
                              <>
                                <X className="h-4 w-4 mr-1" />
                                Cancel
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Book New Field</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Reserve your next field session
            </p>
            <Button asChild className="w-full">
              <a href="/fields">Book Now</a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              View and update your profile information
            </p>
            <Button variant="outline" className="w-full">
              View Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard;

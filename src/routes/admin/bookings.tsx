import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable } from "@/components/ui/data-table";
import { bookingColumns } from "@/components/admin/booking-columns";
import { BookingForm } from "@/components/admin/booking-form";
import { Plus, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  getAdminBookings,
  type BookingResponse,
  type GetBookingsParams,
} from "@/lib/booking";

export const Route = createFileRoute("/admin/bookings")({
  component: BookingManagement,
});

function BookingManagement() {
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const fetchBookings = async (params?: GetBookingsParams) => {
    try {
      setLoading(true);
      const response = await getAdminBookings(params);
      setBookings(response.data.bookings);
    } catch (error) {
      toast.error("Failed to fetch bookings");
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
  };

  const handleRefresh = () => {
    fetchBookings();
    toast.success("Bookings refreshed");
  };

  const handleCreateSuccess = () => {
    setIsCreateDialogOpen(false);
    fetchBookings();
  };

  const filteredBookings = bookings.filter((booking) => {
    if (statusFilter === "all") return true;
    return booking.status.toLowerCase() === statusFilter.toLowerCase();
  });

  // Status filter component to be used inside column header
  const StatusFilterComponent = () => (
    <Select value={statusFilter} onValueChange={handleStatusFilter}>
      <SelectTrigger className="h-8 text-xs w-full">
        <SelectValue placeholder="Filter by Status..." />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Statuses</SelectItem>
        <SelectItem value="paid">Paid</SelectItem>
        <SelectItem value="cancelled">Cancelled</SelectItem>
        <SelectItem value="expired">Expired</SelectItem>
      </SelectContent>
    </Select>
  );

  const columns = bookingColumns(<StatusFilterComponent />);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Booking Management</h1>
          <p className="text-muted-foreground">
            Manage field bookings and reservations
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Bookings</CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={loading}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Dialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Booking
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Booking</DialogTitle>
                  </DialogHeader>
                  <BookingForm
                    onSuccess={handleCreateSuccess}
                    onCancel={() => setIsCreateDialogOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">Loading bookings...</div>
            </div>
          ) : (
            <>
              <DataTable
                columns={columns}
                data={filteredBookings}
                showColumnToggle={true}
                initialSorting={[{ id: "booking_date", desc: true }]}
              />

              <div className="mt-2 text-sm text-muted-foreground">
                Showing {filteredBookings.length} of {bookings.length} bookings
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

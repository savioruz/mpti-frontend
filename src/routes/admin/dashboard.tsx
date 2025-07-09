import { createFileRoute, redirect } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useEffect } from 'react'
import { getAllLocations } from '@/lib/location'
import { getAllFields } from '@/lib/field'
import { getAdminBookings } from '@/lib/booking'
import { getUsers } from '@/lib/user'
import { getAdminPayments } from '@/lib/payment'
import { Loader2, Users, MapPin, Calendar, Building } from 'lucide-react'
import { getAccessToken, isStaffOrAdmin } from '@/lib/auth'

export const Route = createFileRoute('/admin/dashboard')({
  beforeLoad: async () => {
    const token = getAccessToken();
    if (!token) {
      throw redirect({
        to: "/auth/login",
        search: {
          redirect: "/admin/dashboard",
        },
      });
    }
    
    // Check if user has staff or admin role
    if (!isStaffOrAdmin()) {
      throw redirect({
        to: "/dashboard", // Regular users go to user dashboard
      });
    }
  },
  component: AdminDashboard,
})

function AdminDashboard() {
  const [stats, setStats] = useState({
    locations: 0,
    fields: 0,
    bookings: 0,
    users: 0,
    revenue: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch all stats in parallel
        const [locationsResponse, fieldsResponse, bookingsResponse, usersResponse, paymentsResponse] = await Promise.allSettled([
          getAllLocations({ page: 1, limit: 1 }),
          getAllFields({ page: 1, limit: 1 }),
          getAdminBookings({ page: 1, limit: 1 }),
          getUsers({ page: 1, limit: 1 }),
          getAdminPayments({ page: 1, limit: 1000, payment_status: 'PAID' }) // Get all paid payments for revenue
        ])

        // Update stats with actual data
        setStats({
          locations: locationsResponse.status === 'fulfilled' ? locationsResponse.value.data.total_items : 0,
          fields: fieldsResponse.status === 'fulfilled' ? fieldsResponse.value.data.total_items : 0,
          bookings: bookingsResponse.status === 'fulfilled' ? bookingsResponse.value.data.total_items : 0,
          users: usersResponse.status === 'fulfilled' ? usersResponse.value.data.total_items : 0,
          revenue: paymentsResponse.status === 'fulfilled' 
            ? paymentsResponse.value.data.payments.reduce((total, payment) => total + (payment.paid_at ? 1 : 0) * 100000, 0) // Mock revenue calculation
            : 0
        })
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Locations</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.locations}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.locations === 0 ? 'No locations yet' : 'Active locations'}
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Fields</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.fields}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.fields === 0 ? 'No fields yet' : 'Available fields'}
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.bookings}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.bookings === 0 ? 'No bookings yet' : 'Total bookings'}
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.users}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.users === 0 ? 'No users yet' : 'Registered users'}
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>System Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Active Locations</span>
                <span className="text-sm text-muted-foreground">{stats.locations}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Available Fields</span>
                <span className="text-sm text-muted-foreground">{stats.fields}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Bookings</span>
                <span className="text-sm text-muted-foreground">{stats.bookings}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Registered Users</span>
                <span className="text-sm text-muted-foreground">{stats.users}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <a 
                href="/admin/locations" 
                className="block p-3 rounded-lg border border-border hover:bg-accent transition-colors"
              >
                <div className="font-medium text-sm">Manage Locations</div>
                <div className="text-xs text-muted-foreground">Add or edit field locations</div>
              </a>
              <a 
                href="/admin/fields" 
                className="block p-3 rounded-lg border border-border hover:bg-accent transition-colors"
              >
                <div className="font-medium text-sm">Manage Fields</div>
                <div className="text-xs text-muted-foreground">Configure sports fields</div>
              </a>
              <a 
                href="/admin/bookings" 
                className="block p-3 rounded-lg border border-border hover:bg-accent transition-colors"
              >
                <div className="font-medium text-sm">View Bookings</div>
                <div className="text-xs text-muted-foreground">Monitor all reservations</div>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

import { createFileRoute, redirect } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useEffect } from 'react'
import { getAllLocations } from '@/lib/location'
import { Loader2 } from 'lucide-react'
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
    users: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch locations count
        const locationsResponse = await getAllLocations({ page: 1, limit: 1 })
        setStats(prev => ({
          ...prev,
          locations: locationsResponse.data.total_items || 0
        }))
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
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.fields}</div>
            <p className="text-xs text-muted-foreground">
              {stats.fields === 0 ? 'Fields temporarily disabled' : 'No fields yet'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.bookings}</div>
            <p className="text-xs text-muted-foreground">
              {stats.bookings === 0 ? 'No bookings yet' : 'No users yet'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.users}</div>
            <p className="text-xs text-muted-foreground">
              {stats.users === 0 ? 'No users yet' : 'No users yet'}
            </p>
          </CardContent>
        </Card>
      </div>
      </div>
  )
}

import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Loader2 } from "lucide-react"
import { useState, useEffect } from 'react'
import { 
  getAllLocations, 
  createLocation, 
  updateLocationById, 
  deleteLocationById,
  type Location, 
  type CreateLocationRequest
} from '@/lib/location'
import { toast } from 'sonner'
import { DataTable } from "@/components/ui/data-table"
import { createLocationColumns } from "@/components/admin/location-columns"
import { Skeleton } from "@/components/ui/skeleton"

export const Route = createFileRoute('/admin/locations')({
  component: LocationManagement,
})

function LocationManagement() {
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [dataRefreshKey, setDataRefreshKey] = useState(0) // For forcing re-renders
  const [formData, setFormData] = useState<CreateLocationRequest>({
    name: '',
    description: '',
    latitude: 0,
    longitude: 0,
  })
  
  // Helper functions for number input handling
  const handleLatitudeChange = (value: string) => {
    const numValue = value === '' ? 0 : parseFloat(value)
    setFormData({ ...formData, latitude: isNaN(numValue) ? 0 : numValue })
  }
  
  const handleLongitudeChange = (value: string) => {
    const numValue = value === '' ? 0 : parseFloat(value)
    setFormData({ ...formData, longitude: isNaN(numValue) ? 0 : numValue })
  }

  // Fetch all locations for the data table (client-side filtering and pagination)
  const fetchLocations = async () => {
    setLoading(true)
    try {
      // Fetch a larger set for client-side handling
      const response = await getAllLocations({
        page: 1,
        limit: 100, // Increased limit to get all locations
      })
      console.log('Fetched locations:', response.data.locations.length)
      setLocations(response.data.locations)
    } catch (error) {
      toast.error('Failed to fetch locations')
      console.error('Error fetching locations:', error)
    } finally {
      setLoading(false)
    }
  }

  // Refresh data after CRUD operations with force update
  const refreshData = async (forceWindowRefresh = false) => {
    console.log('Refreshing location data...')
    try {
      if (forceWindowRefresh) {
        // Force a complete page refresh to ensure UI updates
        setTimeout(() => {
          window.location.reload()
        }, 100) // Small delay to let the toast show
        return
      }

      // First update the refresh key to prepare for re-render
      setDataRefreshKey(prev => prev + 1)
      
      // Fetch fresh data from the server
      const response = await getAllLocations({
        page: 1,
        limit: 100,
      })
      
      console.log('Fresh data fetched:', response.data.locations.length)
      setLocations(response.data.locations)
      
      // Force re-render by updating the key again
      setTimeout(() => {
        setDataRefreshKey(prev => prev + 1)
      }, 100)
    } catch (error) {
      console.error('Error refreshing data:', error)
      toast.error('Failed to refresh data')
    }
  }

  // Load locations on component mount
  useEffect(() => {
    fetchLocations()
  }, [])

  // Remove old search handler since DataTable handles filtering
  // const handleSearch = async () => { ... }

  // Handle create location
  const handleCreateLocation = async () => {
    setActionLoading(true)
    try {
      await createLocation(formData)
      toast.success('Location created successfully')
      setIsCreateDialogOpen(false)
      setFormData({ name: '', description: '', latitude: 0, longitude: 0 })
      
      // Force page refresh to show new data
      await refreshData(true)
    } catch (error: any) {
      toast.error(error.message || 'Failed to create location')
    } finally {
      setActionLoading(false)
    }
  }

  // Handle edit location
  const handleEditLocation = async () => {
    if (!selectedLocation) return
    
    setActionLoading(true)
    try {
      await updateLocationById(selectedLocation.id, formData)
      toast.success('Location updated successfully')
      setIsEditDialogOpen(false)
      setSelectedLocation(null)
      setFormData({ name: '', description: '', latitude: 0, longitude: 0 })
      
      // Force page refresh to show updated data
      await refreshData(true)
    } catch (error: any) {
      toast.error(error.message || 'Failed to update location')
    } finally {
      setActionLoading(false)
    }
  }

  // Handle delete location
  const handleDeleteLocation = async (id: string) => {
    setActionLoading(true)
    try {
      await deleteLocationById(id)
      toast.success('Location deleted successfully')
      
      // Force page refresh to show updated list
      await refreshData(true)
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete location')
    } finally {
      setActionLoading(false)
    }
  }

  // Handle view location
  const handleViewLocation = async (location: Location) => {
    setSelectedLocation(location)
    setIsViewDialogOpen(true)
  }

  // Handle edit dialog open
  const handleEditDialogOpen = (location: Location) => {
    setSelectedLocation(location)
    setFormData({
      name: location.name,
      description: location.description || '',
      latitude: location.latitude,
      longitude: location.longitude,
    })
    setIsEditDialogOpen(true)
  }

  // Handle create dialog open
  const handleCreateDialogOpen = () => {
    setFormData({ name: '', description: '', latitude: 0, longitude: 0 })
    setIsCreateDialogOpen(true)
  }

  // Create columns for the data table
  const columns = createLocationColumns(
    handleViewLocation,
    handleEditDialogOpen,
    handleDeleteLocation,
    actionLoading
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Location Management</h1>
          <p className="text-muted-foreground">Manage sports field locations</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={() => refreshData(false)}
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Refresh
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleCreateDialogOpen}>
                <Plus className="mr-2 h-4 w-4" />
                Add Location
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Location</DialogTitle>
                <DialogDescription>
                  Add a new location for sports fields. All fields are required.
                </DialogDescription>
              </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter location name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter location description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    value={formData.latitude === 0 ? '' : formData.latitude.toString()}
                    onChange={(e) => handleLatitudeChange(e.target.value)}
                    placeholder="Enter latitude"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    value={formData.longitude === 0 ? '' : formData.longitude.toString()}
                    onChange={(e) => handleLongitudeChange(e.target.value)}
                    placeholder="Enter longitude"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} disabled={actionLoading}>
                Cancel
              </Button>
              <Button onClick={handleCreateLocation} disabled={actionLoading}>
                {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Location
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      {/* Data Table */}
      <Card key={`locations-table-${dataRefreshKey}`}>
        <CardHeader>
          <CardTitle>Locations ({locations.length} total)</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {/* Table header skeleton */}
              <div className="flex items-center justify-between">
                <Skeleton className="h-9 w-[200px]" />
                <Skeleton className="h-9 w-[100px]" />
              </div>
              
              {/* Table skeleton */}
              <div className="rounded-md border">
                {/* Table header */}
                <div className="border-b p-4">
                  <div className="grid grid-cols-5 gap-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-[80px]" />
                  </div>
                </div>
                
                {/* Table rows */}
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="border-b p-4 last:border-b-0">
                    <div className="grid grid-cols-5 gap-4">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <div className="flex gap-2">
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Pagination skeleton */}
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-[200px]" />
                <div className="flex gap-2">
                  <Skeleton className="h-9 w-[80px]" />
                  <Skeleton className="h-9 w-[80px]" />
                </div>
              </div>
            </div>
          ) : (
            <DataTable
              key={dataRefreshKey}
              columns={columns}
              data={locations}
              searchKey="name"
              searchPlaceholder="Search locations..."
            />
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Location</DialogTitle>
            <DialogDescription>
              Update the location information.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter location name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter location description"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-latitude">Latitude</Label>
                <Input
                  id="edit-latitude"
                  type="number"
                  step="any"
                  value={formData.latitude === 0 ? '' : formData.latitude.toString()}
                  onChange={(e) => handleLatitudeChange(e.target.value)}
                  placeholder="Enter latitude"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-longitude">Longitude</Label>
                <Input
                  id="edit-longitude"
                  type="number"
                  step="any"
                  value={formData.longitude === 0 ? '' : formData.longitude.toString()}
                  onChange={(e) => handleLongitudeChange(e.target.value)}
                  placeholder="Enter longitude"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={actionLoading}>
              Cancel
            </Button>
            <Button onClick={handleEditLocation} disabled={actionLoading}>
              {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Location
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Location Details</DialogTitle>
            <DialogDescription>
              View location information.
            </DialogDescription>
          </DialogHeader>
          {selectedLocation && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Name</Label>
                <p className="text-sm">{selectedLocation.name}</p>
              </div>
              <div className="grid gap-2">
                <Label>Description</Label>
                <p className="text-sm">{selectedLocation.description || 'No description'}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Latitude</Label>
                  <p className="text-sm">{selectedLocation.latitude}</p>
                </div>
                <div className="grid gap-2">
                  <Label>Longitude</Label>
                  <p className="text-sm">{selectedLocation.longitude}</p>
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Created At</Label>
                <p className="text-sm">{new Date(selectedLocation.created_at).toLocaleString()}</p>
              </div>
              <div className="grid gap-2">
                <Label>Updated At</Label>
                <p className="text-sm">{new Date(selectedLocation.updated_at).toLocaleString()}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

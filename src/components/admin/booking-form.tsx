import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format, parse } from "date-fns"
import { CalendarIcon, ClockIcon } from "lucide-react"
import { Combobox } from "@/components/ui/combobox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { getAllFields } from "@/lib/field"
import { createBooking, type CreateBookingRequest } from "@/lib/booking"
import type { Field } from "@/lib/field"

interface BookingFormProps {
  onSuccess: () => void
  onCancel: () => void
}

export function BookingForm({ onSuccess, onCancel }: BookingFormProps) {
  const [loading, setLoading] = useState(false)
  const [fields, setFields] = useState<Field[]>([])
  const [formData, setFormData] = useState<CreateBookingRequest>({
    field_id: "",
    date: "",
    start_time: "",
    duration: 1,
    cash: false,
  })

  useEffect(() => {
    const fetchFields = async () => {
      try {
        const response = await getAllFields()
        setFields(response.data.fields)
      } catch (error) {
        toast.error("Failed to fetch fields")
      }
    }
    fetchFields()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    if (!formData.field_id || !formData.date) {
      toast.error("Please fill in all required fields")
      return
    }
    
    // Validate start time
    if (!formData.start_time) {
      toast.error("Please enter a start time")
      return
    }
    
    // Format time properly before submission
    const hourStr = formData.start_time.split(':')[0];
    const hour = parseInt(hourStr);
    
    if (isNaN(hour) || hour < 0 || hour > 23) {
      toast.error("Please enter a valid hour (0-23)")
      return
    }
    
    // Ensure time is properly formatted
    const formattedTime = `${hour.toString().padStart(2, '0')}:00`;
    const updatedFormData = {
      ...formData,
      start_time: formattedTime
    };
    
    setLoading(true)

    try {
      await createBooking(updatedFormData)
      toast.success("Booking created successfully")
      onSuccess()
    } catch (error) {
      toast.error("Failed to create booking")
    } finally {
      setLoading(false)
    }
  }

  const handleFieldChange = (field: keyof CreateBookingRequest, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Create New Booking</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="field_id">Field</Label>
              <div className="mt-1">
                <Combobox
                  options={fields.map(field => ({
                    value: field.id,
                    label: `${field.name} - Rp ${field.price.toLocaleString()}`
                  }))}
                  value={formData.field_id}
                  onValueChange={(value) => handleFieldChange("field_id", value)}
                  placeholder="Select field"
                  emptyMessage="No fields found."
                />
              </div>
            </div>

            <div>
              <Label htmlFor="date">Date</Label>
              <div className="relative mt-1">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                      id="date"
                    >
                      {formData.date ? (
                        format(parse(formData.date, "yyyy-MM-dd", new Date()), "PPP")
                      ) : (
                        <span className="text-muted-foreground">Select a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.date ? parse(formData.date, "yyyy-MM-dd", new Date()) : undefined}
                      onSelect={(date) => {
                        if (date) {
                          handleFieldChange("date", format(date, "yyyy-MM-dd"));
                        }
                      }}
                      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>              <div>
              <Label htmlFor="start_time">Start Time (hour)</Label>
              <div className="mt-1">
                <div className="relative">
                  <Input
                    id="start_time"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="Enter hour (0-23)"
                    value={formData.start_time ? formData.start_time.split(':')[0] : ''}
                    onChange={(e) => {
                      const hour = e.target.value.trim();
                      // Only allow numbers and ensure it's within 0-23 range
                      if (hour === '' || (/^\d+$/.test(hour) && parseInt(hour) >= 0 && parseInt(hour) <= 23)) {
                        const formattedTime = hour ? `${hour.padStart(2, '0')}:00` : '';
                        handleFieldChange("start_time", formattedTime);
                      }
                    }}
                    className="pr-10"
                  />
                  <ClockIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 opacity-50 pointer-events-none" />
                </div>
              </div>
              {formData.start_time && (
                <p className="text-xs text-blue-600 mt-1">
                  Selected time: {formData.start_time.split(':')[0]}:00
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Enter hour in 24-hour format (0-23)
              </p>
            </div>

            <div>
              <Label htmlFor="duration">Duration (hours)</Label>
              <Select
                value={formData.duration.toString()}
                onValueChange={(value) => handleFieldChange("duration", parseInt(value))}
                required
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 hour</SelectItem>
                  <SelectItem value="2">2 hours</SelectItem>
                  <SelectItem value="3">3 hours</SelectItem>
                  <SelectItem value="4">4 hours</SelectItem>
                  <SelectItem value="5">5 hours</SelectItem>
                  <SelectItem value="6">6 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="cash"
              checked={formData.cash}
              onChange={(e) => handleFieldChange("cash", e.target.checked)}
              className="h-4 w-4"
            />
            <Label htmlFor="cash">Cash Payment</Label>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Booking"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

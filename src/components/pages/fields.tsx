"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

import { getAllFields, type Field } from "@/lib/field";
import { createBooking, getBookedSlots, type BookedSlot } from "@/lib/booking";

const FormSchema = z.object({
  field_id: z.string().min(1, "Please select a field!"),
  date: z.string().min(1, "Please select a date!"),
  time_start: z.string().min(1, "Please select a start time!"),
  time_end: z.string().min(1, "Please select an end time!"),
});

export function DatetimePickerV1() {
  const [fields, setFields] = useState<Field[]>([]);
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [bookedSlots, setBookedSlots] = useState<BookedSlot[]>([]);
  const [loading, setLoading] = useState({
    fields: false,
    booking: false,
    slots: false,
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      field_id: "",
      date: "",
      time_start: "",
      time_end: "",
    },
  });

  // Load all fields on component mount
  useEffect(() => {
    const loadAllFields = async () => {
      setLoading(prev => ({ ...prev, fields: true }));
      try {
        console.log("Loading all fields...");
        const response = await getAllFields({ limit: 100 });
        console.log("Fields response:", response);
        setFields(response.data.fields);
      } catch (error: any) {
        console.error("Error loading fields:", error);
        if (error.message?.includes("Authentication required")) {
          toast.error("Please log in to view available fields");
        } else {
          toast.error("Failed to load fields");
        }
      } finally {
        setLoading(prev => ({ ...prev, fields: false }));
      }
    };

    loadAllFields();
  }, []);

  // Load booked slots when field or date changes
  useEffect(() => {
    const fieldId = form.watch("field_id");
    const date = form.watch("date");
    
    if (fieldId && date) {
      const loadBookedSlots = async () => {
        setLoading(prev => ({ ...prev, slots: true }));
        try {
          const response = await getBookedSlots({
            field_id: fieldId,
            date: date,
          });
          setBookedSlots(response.data.booked_slots);
          // Reset selected times when booked slots change
          form.setValue("time_start", "");
          form.setValue("time_end", "");
        } catch (error) {
          toast.error("Failed to load booked slots");
          console.error("Error loading booked slots:", error);
        } finally {
          setLoading(prev => ({ ...prev, slots: false }));
        }
      };

      loadBookedSlots();
    } else {
      setBookedSlots([]);
    }
  }, [form.watch("field_id"), form.watch("date")]);

  // Update selected field when field_id changes
  useEffect(() => {
    const fieldId = form.watch("field_id");
    const field = fields.find(f => f.id === fieldId);
    setSelectedField(field || null);
  }, [form.watch("field_id"), fields]);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(prev => ({ ...prev, booking: true }));
    try {
      // Calculate duration in hours from start and end time
      const startHour = parseInt(data.time_start.split(':')[0]);
      const endHour = parseInt(data.time_end.split(':')[0]);
      const duration = endHour - startHour;
      
      await createBooking({
        field_id: data.field_id,
        date: data.date,
        start_time: data.time_start,
        duration: duration,
      });
      
      toast.success(
        `Successfully booked ${selectedField?.name} on ${data.date} from ${data.time_start} to ${data.time_end}`
      );
      
      // Reset form
      form.reset();
      
      // Reload booked slots if same field and date are still selected
      if (data.field_id && data.date) {
        const response = await getBookedSlots({
          field_id: data.field_id,
          date: data.date,
        });
        setBookedSlots(response.data.booked_slots);
      }
      
    } catch (error: any) {
      toast.error(error.message || "Failed to create booking");
      console.error("Error creating booking:", error);
    } finally {
      setLoading(prev => ({ ...prev, booking: false }));
    }
  }

  // Generate time slots from 6 AM to 12 AM (midnight) - 18 hours total
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 6; hour <= 24; hour++) {
      const currentHour = hour === 24 ? 0 : hour; // Handle midnight as 00:00
      const startTime = `${currentHour.toString().padStart(2, "0")}:00`;
      const displayHour = hour === 24 ? "00:00" : `${hour.toString().padStart(2, "0")}:00`;
      
      slots.push({
        display: displayHour,
        startTime: startTime,
        value: `${startTime} - ${hour === 24 ? "01:00" : (hour + 1).toString().padStart(2, "0") + ":00"}`,
        hour: hour
      });
    }
    return slots;
  };

  const timeOptions = generateTimeSlots();

  const isTimeSlotBooked = (timeSlot: string) => {
    const [startTime] = timeSlot.split(" - ");
    return bookedSlots.some(slot => {
      // Handle different time formats from API
      const slotStartTime = slot.start_time.length === 5 ? slot.start_time : slot.start_time.substring(0, 5);
      return slotStartTime === startTime;
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(price);
  };

  const totalPrice = selectedField ? selectedField.price : 0;

  // Generate date options for the next 7 days only
  const generateDateOptions = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        value: date.toISOString().split('T')[0], // YYYY-MM-DD format
        label: date.toLocaleDateString('en-US', { 
          weekday: 'short', 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        }),
        shortLabel: date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })
      });
    }
    return dates;
  };

  const dateOptions = generateDateOptions();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Book a Field</h1>
        <p className="text-gray-600">Follow the steps to make your booking.</p>
        
        {/* Progress Steps */}
        <div className="flex items-center gap-4 mt-6">
          <div className={cn(
            "flex items-center gap-2 px-3 py-1 rounded-full text-sm",
            "bg-blue-100 text-blue-800"
          )}>
            <span className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">1</span>
            Field
          </div>
          <div className={cn(
            "flex items-center gap-2 px-3 py-1 rounded-full text-sm",
            form.watch("field_id") ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-500"
          )}>
            <span className={cn(
              "w-5 h-5 rounded-full flex items-center justify-center text-xs",
              form.watch("field_id") ? "bg-blue-600 text-white" : "bg-gray-400 text-white"
            )}>2</span>
            Date & Time
          </div>
          <div className={cn(
            "flex items-center gap-2 px-3 py-1 rounded-full text-sm",
            form.watch("time_start") && form.watch("time_end") ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-500"
          )}>
            <span className={cn(
              "w-5 h-5 rounded-full flex items-center justify-center text-xs",
              form.watch("time_start") && form.watch("time_end") ? "bg-green-600 text-white" : "bg-gray-400 text-white"
            )}>3</span>
            Book
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Field Selection */}
          <FormField
            control={form.control}
            name="field_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Field</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a field" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {loading.fields ? (
                      <SelectItem value="loading" disabled>Loading fields...</SelectItem>
                    ) : fields.length === 0 ? (
                      <SelectItem value="no-fields" disabled>
                        {!localStorage.getItem('access_token') ? "Please log in to view fields" : "No fields available"}
                      </SelectItem>
                    ) : (
                      fields.map((fieldOption) => (
                        <SelectItem key={fieldOption.id} value={fieldOption.id}>
                          <div className="flex flex-col items-start">
                            <span>{fieldOption.name}</span>
                            <span className="text-sm text-gray-500">{formatPrice(fieldOption.price)}/hour</span>
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <FormDescription>Choose the field you want to book.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Field Information Card - Only show if field is selected */}
          {selectedField && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {selectedField.name}
                  <Badge variant="secondary">{selectedField.type}</Badge>
                </CardTitle>
                <CardDescription>{selectedField.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="font-medium">Price: {formatPrice(selectedField.price)}/hour</span>
                  {form.watch("time_start") && form.watch("time_end") && (
                    <span className="font-medium text-green-600">
                      Total: {formatPrice(totalPrice * (parseInt(form.watch("time_end").split(':')[0]) - parseInt(form.watch("time_start").split(':')[0])))}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Date Selection - Cards - Only show if field is selected */}
          {form.watch("field_id") && (
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <div className="grid grid-cols-7 gap-2">
                    {dateOptions.map((dateOption) => (
                      <Card 
                        key={dateOption.value} 
                        className={cn(
                          "cursor-pointer transition-all hover:shadow-md",
                          field.value === dateOption.value 
                            ? "border-blue-500 bg-blue-50 shadow-md" 
                            : "hover:border-gray-300"
                        )}
                        onClick={() => field.onChange(dateOption.value)}
                      >
                        <CardContent className="p-3 text-center">
                          <div className="text-xs text-gray-500 mb-1">
                            {dateOption.shortLabel.split(' ')[0]}
                          </div>
                          <div className="text-sm font-medium">
                            {dateOption.shortLabel.split(' ')[1]}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <FormDescription>Choose your preferred date.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Time Start Selection - Cards - Only show if field and date are selected */}
          {form.watch("field_id") && form.watch("date") && (
            <FormField
              control={form.control}
              name="time_start"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Time {loading.slots && <span className="text-sm text-gray-500">(Loading...)</span>}</FormLabel>
                  <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                    {timeOptions.map((timeOption) => {
                      const isBooked = isTimeSlotBooked(timeOption.value);
                      const isSelected = field.value === timeOption.startTime;
                      
                      return (
                        <Card 
                          key={timeOption.value} 
                          className={cn(
                            "cursor-pointer transition-all",
                            isSelected && "border-blue-500 bg-blue-50 shadow-md",
                            !isBooked && !isSelected && "hover:shadow-md hover:border-gray-300",
                            isBooked && "opacity-50 cursor-not-allowed bg-red-50 border-red-200"
                          )}
                          onClick={() => {
                            if (!isBooked) {
                              field.onChange(timeOption.startTime);
                              // Reset end time when start time changes
                              form.setValue("time_end", "");
                            }
                          }}
                        >
                          <CardContent className="p-3 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span className="text-sm font-medium">
                                {timeOption.display}
                              </span>
                            </div>
                            {isBooked && (
                              <Badge variant="destructive" className="mt-1 text-xs">
                                Booked
                              </Badge>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                  <FormDescription>Choose your start time.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Time End Selection - Cards - Only show if start time is selected */}
          {form.watch("field_id") && form.watch("date") && form.watch("time_start") && (
            <FormField
              control={form.control}
              name="time_end"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Time</FormLabel>
                  <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                    {timeOptions
                      .filter(timeOption => {
                        const startHour = parseInt(form.watch("time_start").split(':')[0]);
                        const endHour = parseInt(timeOption.startTime.split(':')[0]);
                        return endHour > startHour; // Only show times after start time
                      })
                      .map((timeOption) => {
                        const isBooked = isTimeSlotBooked(timeOption.value);
                        const isSelected = field.value === timeOption.startTime;
                        
                        return (
                          <Card 
                            key={timeOption.value} 
                            className={cn(
                              "cursor-pointer transition-all",
                              isSelected && "border-blue-500 bg-blue-50 shadow-md",
                              !isBooked && !isSelected && "hover:shadow-md hover:border-gray-300",
                              isBooked && "opacity-50 cursor-not-allowed bg-red-50 border-red-200"
                            )}
                            onClick={() => !isBooked && field.onChange(timeOption.startTime)}
                          >
                            <CardContent className="p-3 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span className="text-sm font-medium">
                                  {timeOption.display}
                                </span>
                              </div>
                              {isBooked && (
                                <Badge variant="destructive" className="mt-1 text-xs">
                                  Booked
                                </Badge>
                              )}
                            </CardContent>
                          </Card>
                        );
                      })}
                  </div>
                  <FormDescription>Choose your end time.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          
          {/* Submit Button - Only show if all fields are filled */}
          {form.watch("field_id") && form.watch("date") && form.watch("time_start") && form.watch("time_end") && (
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading.booking}
            >
              {loading.booking ? "Creating Booking..." : (() => {
                const startHour = parseInt(form.watch("time_start").split(':')[0]);
                const endHour = parseInt(form.watch("time_end").split(':')[0]);
                const duration = endHour - startHour;
                const totalCost = totalPrice * duration;
                return `Book Now - ${formatPrice(totalCost)} (${duration} ${duration === 1 ? 'hour' : 'hours'})`;
              })()}
            </Button>
          )}
        </form>
      </Form>
    </div>
  );
}

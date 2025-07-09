"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "@tanstack/react-router";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

import { getAllFields, type Field } from "@/lib/field";
import { createBooking, getBookedSlots, type BookedSlot } from "@/lib/booking";
import { getCurrentDateString, generateDateOptions } from "@/lib/date-utils";

const FormSchema = z.object({
  field_id: z.string().min(1, "Please select a field!"),
  date: z.string().min(1, "Please select a date!"),
  time_start: z.string().min(1, "Please select a start time!"),
  time_end: z.string().min(1, "Please select an end time!"),
});

export function DatetimePickerV1() {
  const navigate = useNavigate();
  const [fields, setFields] = useState<Field[]>([]);
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [bookedSlots, setBookedSlots] = useState<BookedSlot[]>([]);
  const [showStartTimeSelection, setShowStartTimeSelection] = useState(true);
  const [showEndTimeSelection, setShowEndTimeSelection] = useState(true);
  const [loading, setLoading] = useState({
    fields: false,
    booking: false,
    slots: false,
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      field_id: "",
      date: getCurrentDateString(), // Use utility function for current date
      time_start: "",
      time_end: "",
    },
  });

  // Load all fields on component mount
  useEffect(() => {
    const loadAllFields = async () => {
      setLoading((prev) => ({ ...prev, fields: true }));
      try {
        const response = await getAllFields({ limit: 100 });
        setFields(response.data.fields);
      } catch (error: any) {
        if (error.message?.includes("Authentication required")) {
          toast.error("Please log in to view available fields");
        } else {
          toast.error("Failed to load fields");
        }
      } finally {
        setLoading((prev) => ({ ...prev, fields: false }));
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
        setLoading((prev) => ({ ...prev, slots: true }));
        try {
          const response = await getBookedSlots({
            field_id: fieldId,
            date: date,
          });
          setBookedSlots(response.data.booked_slots);
          // Reset selected times when booked slots change
          form.setValue("time_start", "");
          form.setValue("time_end", "");
          // Show time selections again when field or date changes
          setShowStartTimeSelection(true);
          setShowEndTimeSelection(true);
        } catch (error) {
          toast.error("Failed to load booked slots");
        } finally {
          setLoading((prev) => ({ ...prev, slots: false }));
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
    const field = fields.find((f) => f.id === fieldId);
    setSelectedField(field || null);
    // Show start time selection again when field changes
    if (fieldId) {
      setShowStartTimeSelection(true);
      setShowEndTimeSelection(true);
    }
  }, [form.watch("field_id"), fields]);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading((prev) => ({ ...prev, booking: true }));

    try {
      // Calculate duration in hours from start and end time
      const startHour = parseInt(data.time_start.split(":")[0]);
      const endHour = parseInt(data.time_end.split(":")[0]);
      const duration = endHour - startHour;

      const bookingResponse = await createBooking({
        field_id: data.field_id,
        date: data.date,
        start_time: data.time_start,
        duration: duration,
        cash: false, // Default to online payment
      });

      // Get the booking details to get payment information
      const bookingId =
        typeof bookingResponse.data === "string"
          ? bookingResponse.data
          : (bookingResponse.data as any)?.id || String(bookingResponse.data); // Handle different response formats

      console.log("Booking response:", bookingResponse.data);
      console.log("Extracted booking ID:", bookingId);

      toast.success(
        `Booking created successfully! Redirecting to booking details...`,
      );

      // Navigate to booking details page instead of showing modal
      setTimeout(() => {
        navigate({
          to: "/booking/$bookingId",
          params: { bookingId: String(bookingId) },
        });
      }, 1500);

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
      let errorMessage = "Failed to create booking";

      if (error.response?.status === 400) {
        // Handle validation and business logic errors
        if (error.response?.data?.error) {
          errorMessage = error.response.data.error;
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.message?.toLowerCase().includes("validation")) {
          errorMessage = error.message;
        }
      } else if (error.response?.status === 401) {
        errorMessage = "Please log in to create a booking";
      } else if (error.response?.status === 403) {
        errorMessage = "You don't have permission to create bookings";
      } else if (error.response?.status === 409) {
        errorMessage = "This time slot is already booked";
      } else if (error.response?.status >= 500) {
        errorMessage = "Server error. Please try again later";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      setLoading((prev) => ({ ...prev, booking: false }));
    }
  }

  // Generate time slots from 6 AM to 11 PM (23:00) - maximum start time is 23:00
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 6; hour <= 23; hour++) {
      const startTime = `${hour.toString().padStart(2, "0")}:00`;
      const displayHour = `${hour.toString().padStart(2, "0")}:00`;

      slots.push({
        display: displayHour,
        startTime: startTime,
        value: `${startTime} - ${(hour + 1).toString().padStart(2, "0")}:00`,
        hour: hour,
      });
    }
    return slots;
  };

  const timeOptions = generateTimeSlots();

  const isTimeSlotBooked = (timeSlot: string) => {
    const [startTime] = timeSlot.split(" - ");
    return bookedSlots.some((slot) => {
      // Handle different time formats from API
      const slotStartTime =
        slot.start_time.length === 5
          ? slot.start_time
          : slot.start_time.substring(0, 5);
      return slotStartTime === startTime;
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(price);
  };

  const totalPrice = selectedField ? selectedField.price : 0;

  // Generate date options for the next 7 days only
  const dateOptions = generateDateOptions(7);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl mb-6 shadow-lg">
            <span className="text-3xl">🏟️</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-foreground via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
            Book Your Perfect Field
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Choose from premium sports facilities, pick your ideal time, and secure your booking in seconds
          </p>
        </div>
        {/* Progress Steps */}
        <div className="max-w-4xl mx-auto mb-8 sm:mb-12">
          <div className="bg-card/95 dark:bg-slate-800/95 backdrop-blur-sm border border-border/50 rounded-2xl p-4 sm:p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-start sm:justify-center gap-6 sm:gap-8">
              {/* Step 1 - Select Field */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">1</span>
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full opacity-20 animate-pulse"></div>
                </div>
                <div className="text-left">
                  <div className="font-semibold text-foreground text-sm sm:text-base">Select Field</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Choose your preferred venue</div>
                </div>
              </div>
              
              {/* Connector */}
              <div className="hidden sm:block w-12 md:w-16 h-0.5 bg-gradient-to-r from-emerald-300 to-muted relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500" 
                     style={{ width: form.watch("field_id") ? "100%" : "0%" }}></div>
              </div>
              
              {/* Step 2 - Date & Time */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300",
                    form.watch("field_id") 
                      ? "bg-gradient-to-br from-emerald-500 to-teal-600" 
                      : "bg-muted"
                  )}>
                    <span className={cn(
                      "font-bold text-lg transition-colors",
                      form.watch("field_id") ? "text-white" : "text-muted-foreground"
                    )}>2</span>
                  </div>
                  {form.watch("field_id") && (
                    <div className="absolute -inset-1 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full opacity-20 animate-pulse"></div>
                  )}
                </div>
                <div className="text-left">
                  <div className={cn(
                    "font-semibold transition-colors text-sm sm:text-base",
                    form.watch("field_id") ? "text-foreground" : "text-muted-foreground"
                  )}>Date & Time</div>
                  <div className={cn(
                    "text-xs sm:text-sm transition-colors",
                    form.watch("field_id") ? "text-muted-foreground" : "text-muted-foreground/60"
                  )}>Pick your schedule</div>
                </div>
              </div>
              
              {/* Connector */}
              <div className="hidden sm:block w-12 md:w-16 h-0.5 bg-muted relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-emerald-500 transition-all duration-500" 
                     style={{ width: (form.watch("time_start") && form.watch("time_end")) ? "100%" : "0%" }}></div>
              </div>
              
              {/* Step 3 - Confirm */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300",
                    (form.watch("time_start") && form.watch("time_end"))
                      ? "bg-gradient-to-br from-emerald-500 to-teal-600" 
                      : "bg-muted"
                  )}>
                    <span className={cn(
                      "font-bold text-lg transition-colors",
                      (form.watch("time_start") && form.watch("time_end")) ? "text-white" : "text-muted-foreground"
                    )}>3</span>
                  </div>
                  {(form.watch("time_start") && form.watch("time_end")) && (
                    <div className="absolute -inset-1 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full opacity-20 animate-pulse"></div>
                  )}
                </div>
                <div className="text-left">
                  <div className={cn(
                    "font-semibold transition-colors text-sm sm:text-base",
                    (form.watch("time_start") && form.watch("time_end")) ? "text-foreground" : "text-muted-foreground"
                  )}>Confirm Booking</div>
                  <div className={cn(
                    "text-xs sm:text-sm transition-colors",
                    (form.watch("time_start") && form.watch("time_end")) ? "text-muted-foreground" : "text-muted-foreground/60"
                  )}>Review and book</div>
                </div>
              </div>
            </div>
          </div>
        </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 sm:space-y-12">
          {/* Field Selection */}
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">Choose Your Field</h2>
              <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
                Select from our premium collection of sports facilities
              </p>
            </div>
            
            {loading.fields ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="overflow-hidden border-0 shadow-lg bg-card/80 dark:bg-slate-800/90 backdrop-blur-sm">
                    <div className="animate-pulse">
                      <div className="h-56 bg-gradient-to-br from-muted to-muted/60"></div>
                      <CardContent className="p-6">
                        <div className="h-6 bg-muted rounded-lg mb-3"></div>
                        <div className="h-4 bg-muted rounded-lg w-3/4 mb-2"></div>
                        <div className="h-4 bg-muted rounded-lg w-1/2"></div>
                        <div className="flex justify-between items-center mt-4">
                          <div className="h-6 bg-muted rounded-lg w-20"></div>
                          <div className="h-6 bg-muted rounded-lg w-16"></div>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
            ) : fields.length === 0 ? (
              <Card className="border-0 shadow-lg bg-card/80 dark:bg-slate-800/90 backdrop-blur-sm">
                <CardContent className="p-12">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-muted/50 to-muted rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <span className="text-4xl">🏟️</span>
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">No Fields Available</h3>
                    <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
                      {!localStorage.getItem('access_token') 
                        ? "Please log in to view and book our available sports fields" 
                        : "No sports fields are currently available. Please check back later or contact support."}
                    </p>
                    {!localStorage.getItem('access_token') && (
                      <Button className="mt-6 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700">
                        Sign In to View Fields
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {fields.map((field) => (
                  <div key={field.id} className="w-full h-full group">
                    <Card 
                      className={cn(
                        "field-card overflow-hidden cursor-pointer transition-all duration-300 border-0 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 w-full h-full bg-card/90 dark:bg-slate-800/95 backdrop-blur-sm",
                        form.watch("field_id") === field.id 
                          ? "ring-2 ring-emerald-500 shadow-2xl scale-105 bg-card dark:bg-slate-800" 
                          : "hover:ring-2 hover:ring-emerald-200"
                      )}
                      onClick={() => {
                        form.setValue("field_id", field.id);
                        // Reset time selections when field changes
                        form.setValue("time_start", "");
                        form.setValue("time_end", "");
                      }}
                    >
                      {/* Field Image */}
                      <div className="relative h-56 sm:h-64 overflow-hidden">
                        {field.images && field.images.length > 0 ? (
                          <img 
                            src={field.images[0]} 
                            alt={field.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500&h=400&fit=crop';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 flex items-center justify-center">
                            <div className="text-white text-5xl drop-shadow-lg">🏟️</div>
                          </div>
                        )}
                        
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                        
                        {/* Field Type Badge */}
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-background/95 text-foreground font-medium px-3 py-1 shadow-md border-0">
                            {field.type}
                          </Badge>
                        </div>
                        
                        {/* Selected Badge */}
                        {form.watch("field_id") === field.id && (
                          <div className="absolute top-4 right-4">
                            <Badge className="bg-emerald-500 text-white shadow-lg border-0 px-3 py-1">
                              ✓ Selected
                            </Badge>
                          </div>
                        )}
                        
                        {/* Image Count */}
                        {field.images && field.images.length > 1 && (
                          <div className="absolute bottom-4 right-4">
                            <Badge className="bg-black/70 text-white border-0 px-2 py-1">
                              📷 {field.images.length}
                            </Badge>
                          </div>
                        )}
                      </div>
                      
                      <CardContent className="p-6">
                        <div className="space-y-4 h-full flex flex-col justify-between">
                          <div>
                            <h3 className="font-bold text-xl leading-tight text-foreground mb-2 group-hover:text-emerald-700 transition-colors">
                              {field.name}
                            </h3>
                            {field.description && (
                              <p className="text-muted-foreground leading-relaxed line-clamp-2">
                                {field.description}
                              </p>
                            )}
                          </div>
                          
                          <div className="flex items-center justify-between pt-3 border-t border-border">
                            <div className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                              {formatPrice(field.price)}
                              <span className="text-sm font-medium text-muted-foreground ml-1">/hour</span>
                            </div>
                            {form.watch("field_id") === field.id && (
                              <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                                ✓ Selected
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Date Selection - Only show if field is selected */}
          {form.watch("field_id") && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3">Select Your Date</h3>
                <p className="text-muted-foreground">Choose your preferred booking date</p>
              </div>
              
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-center">
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2 sm:gap-3 md:gap-3 max-w-xs sm:max-w-2xl md:max-w-3xl">
                        {dateOptions.map((dateOption) => {
                          const isSelected = field.value === dateOption.value;
                          const isToday = dateOption.isToday;
                          
                          return (
                            <Card
                              key={dateOption.value}
                              className={cn(
                                "cursor-pointer transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 border-0 shadow-md bg-card/90 dark:bg-slate-800/95 backdrop-blur-sm min-h-[90px] sm:min-h-[80px] md:min-h-[70px] flex items-center justify-center group",
                                isSelected && !isToday
                                  ? "ring-2 ring-emerald-500 shadow-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 scale-105"
                                  : isSelected && isToday
                                    ? "ring-2 ring-emerald-500 shadow-xl bg-gradient-to-br from-emerald-50 via-amber-50 to-teal-50 dark:from-emerald-950/30 dark:via-amber-950/30 dark:to-teal-950/30 scale-105"
                                    : isToday
                                      ? "ring-2 ring-amber-400 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30"
                                      : "hover:ring-2 hover:ring-emerald-200 hover:scale-105",
                              )}
                              onClick={() => {
                                field.onChange(dateOption.value);
                                // Show time selections again when date changes
                                setShowStartTimeSelection(true);
                                setShowEndTimeSelection(true);
                              }}
                            >
                              <CardContent className="p-3 sm:p-2 md:p-3 text-center w-full">
                                <div className={cn(
                                  "text-xs sm:text-xs font-semibold mb-1 uppercase tracking-wide transition-colors",
                                  isSelected 
                                    ? "text-emerald-700 dark:text-emerald-400" 
                                    : isToday 
                                      ? "text-amber-700 dark:text-amber-400" 
                                      : "text-muted-foreground group-hover:text-emerald-600"
                                )}>
                                  {dateOption.shortLabel.split(" ")[0].substring(0, 3)}
                                </div>
                                <div className={cn(
                                  "text-xl sm:text-lg md:text-xl font-bold leading-tight transition-colors",
                                  isSelected 
                                    ? "text-emerald-800 dark:text-emerald-300" 
                                    : isToday 
                                      ? "text-amber-800 dark:text-amber-300" 
                                      : "text-foreground group-hover:text-emerald-800 dark:group-hover:text-emerald-300"
                                )}>
                                  {dateOption.shortLabel.split(" ")[1]}
                                </div>
                                {isToday && (
                                  <div className={cn(
                                    "text-xs font-bold mt-1 transition-colors",
                                    isSelected ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"
                                  )}>
                                    Today
                                  </div>
                                )}
                                {isSelected && (
                                  <div className="text-emerald-600 dark:text-emerald-400 text-xs font-bold mt-1 animate-pulse">
                                    ✓ Selected
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {/* Time Selection - Only show if field and date are selected */}
          {form.watch("field_id") && form.watch("date") && (
            <div className="space-y-6">
              {showStartTimeSelection ? (
                // Show full start time selection
                <>
                  <div className="text-center">
                    <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3">Choose Your Time</h3>
                    <p className="text-muted-foreground">
                      Select your preferred start time {loading.slots && <span className="text-emerald-600">(Loading available slots...)</span>}
                    </p>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="time_start"
                    render={({ field }) => (
                      <FormItem>
                        <div className="max-w-6xl mx-auto">
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
                            {timeOptions.map((timeOption) => {
                              const isBooked = isTimeSlotBooked(timeOption.value);
                              const isSelected = field.value === timeOption.startTime;

                              return (
                                <Card
                                  key={timeOption.value}
                                  className={cn(
                                    "cursor-pointer transition-all duration-300 transform hover:-translate-y-1 border-0 shadow-md bg-card/80 dark:bg-slate-800/90 backdrop-blur-sm",
                                    isSelected &&
                                      "ring-2 ring-emerald-500 shadow-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 scale-105",
                                    !isBooked &&
                                      !isSelected &&
                                      "hover:shadow-lg hover:ring-2 hover:ring-emerald-200",
                                    isBooked &&
                                      "opacity-60 cursor-not-allowed bg-gradient-to-br from-red-50 to-rose-100 dark:from-red-950/30 dark:to-rose-950/30 shadow-sm",
                                  )}
                                  onClick={() => {
                                    if (!isBooked) {
                                      field.onChange(timeOption.startTime);
                                      // Reset end time when start time changes
                                      form.setValue("time_end", "");
                                      // Hide start time selection and show end time selection
                                      setShowStartTimeSelection(false);
                                      setShowEndTimeSelection(true);
                                    }
                                  }}
                                >
                                  <CardContent className="p-4 text-center">
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                      <Clock className={cn(
                                        "h-4 w-4",
                                        isSelected ? "text-emerald-600" : isBooked ? "text-red-400" : "text-muted-foreground"
                                      )} />
                                      <span className={cn(
                                        "font-bold text-lg",
                                        isSelected ? "text-emerald-700 dark:text-emerald-400" : isBooked ? "text-red-500" : "text-foreground"
                                      )}>
                                        {timeOption.display}
                                      </span>
                                    </div>
                                    {isBooked ? (
                                      <Badge className="bg-red-500 text-white text-xs border-0 px-2 py-1">
                                        Unavailable
                                      </Badge>
                                    ) : isSelected ? (
                                      <Badge className="bg-emerald-500 text-white text-xs border-0 px-2 py-1">
                                        ✓ Selected
                                      </Badge>
                                    ) : (
                                      <div className="text-xs text-muted-foreground font-medium">Available</div>
                                    )}
                                  </CardContent>
                                </Card>
                              );
                            })}
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              ) : form.watch("time_start") && (
                // Show compact selected start time with option to change
                <div className="text-center space-y-4">
                  {/* If both times are selected and collapsed, show combined view */}
                  {form.watch("time_end") && !showEndTimeSelection ? (
                    <div className="max-w-md mx-auto">
                      <div className="flex flex-col gap-3 p-6 bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950/30 dark:via-teal-950/30 dark:to-cyan-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800">
                        <div className="flex items-center justify-center gap-3 mb-2">
                          <Clock className="h-5 w-5 text-emerald-600" />
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground mb-1">Selected Time Slot</p>
                            <p className="font-bold text-lg text-foreground">
                              {form.watch("time_start")} - {form.watch("time_end")}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 justify-center">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-700 dark:text-emerald-400 dark:hover:bg-emerald-950/20"
                            onClick={() => setShowStartTimeSelection(true)}
                          >
                            Change Start
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="border-teal-300 text-teal-700 hover:bg-teal-50 dark:border-teal-700 dark:text-teal-400 dark:hover:bg-teal-950/20"
                            onClick={() => setShowEndTimeSelection(true)}
                          >
                            Change End
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Show only start time if end time not selected yet */
                    <div className="max-w-md mx-auto">
                      <div className="flex flex-col gap-3 p-6 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800">
                        <div className="flex items-center justify-center gap-3 mb-2">
                          <Clock className="h-5 w-5 text-emerald-600" />
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground mb-1">Start Time Selected</p>
                            <p className="font-bold text-lg text-emerald-700 dark:text-emerald-400">{form.watch("time_start")}</p>
                          </div>
                        </div>
                        <div className="flex justify-center">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-700 dark:text-emerald-400 dark:hover:bg-emerald-950/20"
                            onClick={() => setShowStartTimeSelection(true)}
                          >
                            Change
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* End Time Selection - Only show if start time is selected */}
          {form.watch("field_id") &&
            form.watch("date") &&
            form.watch("time_start") && (
              <div className="space-y-6">
                {showEndTimeSelection ? (
                  // Show full end time selection
                  <>
                    <div className="text-center">
                      <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3">Select End Time</h3>
                      <p className="text-muted-foreground">Choose when your session will end</p>
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="time_end"
                      render={({ field }) => (
                        <FormItem>
                          <div className="max-w-6xl mx-auto">
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
                              {timeOptions
                                .filter((timeOption) => {
                                  const startHour = parseInt(
                                    form.watch("time_start").split(":")[0],
                                  );
                                  const endHour = parseInt(
                                    timeOption.startTime.split(":")[0],
                                  );
                                  return endHour > startHour; // Only show times after start time
                                })
                                .concat(
                                  // Add 24:00 (midnight) option only if start time is 23:00
                                  parseInt(form.watch("time_start").split(":")[0]) ===
                                    23
                                    ? [
                                        {
                                          display: "00:00",
                                          startTime: "00:00",
                                          value: "00:00 - 01:00",
                                          hour: 24,
                                        },
                                      ]
                                    : [],
                                )
                                .map((timeOption) => {
                                  const isBooked = isTimeSlotBooked(timeOption.value);
                                  const isSelected =
                                    field.value === timeOption.startTime;

                                  return (
                                    <Card
                                      key={timeOption.value}
                                      className={cn(
                                        "cursor-pointer transition-all duration-300 transform hover:-translate-y-1 border-0 shadow-md bg-card/80 dark:bg-slate-800/90 backdrop-blur-sm",
                                        isSelected &&
                                          "ring-2 ring-emerald-500 shadow-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 scale-105",
                                        !isBooked &&
                                          !isSelected &&
                                          "hover:shadow-lg hover:ring-2 hover:ring-emerald-200",
                                        isBooked &&
                                          "opacity-60 cursor-not-allowed bg-gradient-to-br from-red-50 to-rose-100 dark:from-red-950/30 dark:to-rose-950/30 shadow-sm",
                                      )}
                                      onClick={() => {
                                        if (!isBooked) {
                                          field.onChange(timeOption.startTime);
                                          // Hide end time selection after selection (better mobile UX)
                                          setShowEndTimeSelection(false);
                                        }
                                      }}
                                    >
                                      <CardContent className="p-4 text-center">
                                        <div className="flex items-center justify-center gap-2 mb-2">
                                          <Clock className={cn(
                                            "h-4 w-4",
                                            isSelected ? "text-emerald-600" : isBooked ? "text-red-400" : "text-muted-foreground"
                                          )} />
                                          <span className={cn(
                                            "font-bold text-lg",
                                            isSelected ? "text-emerald-700 dark:text-emerald-400" : isBooked ? "text-red-500" : "text-foreground"
                                          )}>
                                            {timeOption.display}
                                          </span>
                                        </div>
                                        {isBooked ? (
                                          <Badge className="bg-red-500 text-white text-xs border-0 px-2 py-1">
                                            Unavailable
                                          </Badge>
                                        ) : isSelected ? (
                                          <Badge className="bg-emerald-500 text-white text-xs border-0 px-2 py-1">
                                            ✓ Selected
                                          </Badge>
                                        ) : (
                                          <div className="text-xs text-muted-foreground font-medium">Available</div>
                                        )}
                                      </CardContent>
                                    </Card>
                                  );
                                })}
                            </div>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                ) : form.watch("time_end") && !showStartTimeSelection && (
                  // Show compact selected end time only if start time is also collapsed
                  <div className="text-center space-y-4">
                    <div className="max-w-md mx-auto">
                      <div className="flex flex-col gap-3 p-6 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-950/30 dark:to-cyan-950/30 rounded-xl border border-teal-200 dark:border-teal-800">
                        <div className="flex items-center justify-center gap-3 mb-2">
                          <Clock className="h-5 w-5 text-teal-600" />
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground mb-1">End Time Selected</p>
                            <p className="font-bold text-lg text-teal-700 dark:text-teal-400">{form.watch("time_end")}</p>
                          </div>
                        </div>
                        <div className="flex justify-center">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="border-teal-300 text-teal-700 hover:bg-teal-50 dark:border-teal-700 dark:text-teal-400 dark:hover:bg-teal-950/20"
                            onClick={() => setShowEndTimeSelection(true)}
                          >
                            Change
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

          {/* Submit Button - Only show if all fields are filled */}
          {form.watch("field_id") &&
            form.watch("date") &&
            form.watch("time_start") &&
            form.watch("time_end") && (
              <div className="text-center space-y-6">
                {/* Booking Summary */}
                <div className="bg-card/80 dark:bg-slate-800/90 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-xl max-w-2xl mx-auto">
                  <h3 className="text-xl font-bold text-foreground mb-4">Booking Summary</h3>
                  <div className="space-y-3 text-left">
                    <div className="flex justify-between items-center py-2 border-b border-border">
                      <span className="text-muted-foreground">Field:</span>
                      <span className="font-semibold text-foreground">{selectedField?.name}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border">
                      <span className="text-muted-foreground">Date:</span>
                      <span className="font-semibold text-foreground">{form.watch("date")}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border">
                      <span className="text-muted-foreground">Time:</span>
                      <span className="font-semibold text-foreground">
                        {form.watch("time_start")} - {form.watch("time_end")}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border">
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="font-semibold text-foreground">
                        {(() => {
                          const startHour = parseInt(form.watch("time_start").split(":")[0]);
                          const endHour = parseInt(form.watch("time_end").split(":")[0]);
                          const duration = endHour - startHour;
                          return `${duration} ${duration === 1 ? "hour" : "hours"}`;
                        })()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <span className="text-lg font-semibold text-foreground">Total Cost:</span>
                      <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                        {(() => {
                          const startHour = parseInt(form.watch("time_start").split(":")[0]);
                          const endHour = parseInt(form.watch("time_end").split(":")[0]);
                          const duration = endHour - startHour;
                          const totalCost = totalPrice * duration;
                          return formatPrice(totalCost);
                        })()}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Submit Button */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full max-w-md mx-auto bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border-0 text-lg"
                  disabled={loading.booking}
                >
                  {loading.booking ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Creating Your Booking...
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <span>🎯</span>
                      <span>Confirm Booking</span>
                      <span className="text-white/90">→</span>
                    </div>
                  )}
                </Button>
                
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  By confirming this booking, you agree to our terms and conditions. You'll receive a confirmation email with payment details.
                </p>
              </div>
            )}
        </form>
      </Form>
      </div>
    </div>
  );
}

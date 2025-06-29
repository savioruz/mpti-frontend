"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

const FormSchema = z.object({
  datetime: z.date({
    required_error: "Date is required!",
  }),
  times: z.array(z.string()).min(1, "Pick at least one time!"),
});

export function DatetimePickerV1() {
  const [isOpen, setIsOpen] = useState(false);
  const [, setDate] = useState<Date | null>(new Date());
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      datetime: new Date(),
      times: [],
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    toast.success(
      `Reserved at: ${format(data.datetime, "PPP")} for time(s): ${data.times.join(", ")}`
    );
  }

  const timeOptions = Array.from({ length: 18 }, (_, i) => {
    const startHour = i + 6;
    const endHour = startHour + 1;
    const start = `${startHour.toString().padStart(2, "0")}:00`;
    const end = `${endHour.toString().padStart(2, "0")}:00`;
    return `${start} - ${end}`;
  });

  const toggleTime = (timeValue: string) => {
    setSelectedTimes((prev) => {
      let updated: string[];
      if (prev.includes(timeValue)) {
        updated = prev.filter((t) => t !== timeValue);
      } else {
        updated = [...prev, timeValue];
      }
      form.setValue("times", updated);
      return updated;
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="datetime"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date & Time</FormLabel>
              <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        `${format(field.value, "PPP")}, ${
                          selectedTimes.length > 0
                            ? selectedTimes.sort().join(", ")
                            : "Pick time"
                        }`
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 flex items-start" align="start">
                  <div>
                    <Calendar
                      mode="single"
                      captionLayout="dropdown"
                      selected={field.value}
                      onSelect={(selectedDate) => {
                        if (selectedDate) {
                          setDate(selectedDate);
                          field.onChange(selectedDate);
                        }
                      }}
                      fromYear={2000}
                      toYear={new Date().getFullYear()}
                      disabled={(date) =>
                        Number(date) < Date.now() - 1000 * 60 * 60 * 24 ||
                        Number(date) > Date.now() + 1000 * 60 * 60 * 24 * 30
                      }
                    />
                  </div>
                  <div className="w-[120px] my-4 mr-2">
                    <ScrollArea className="h-[18rem]">
                      <div className="flex flex-col gap-2 h-full">
                        {timeOptions.map((timeValue) => (
                          <Button
                            key={timeValue}
                            className={cn(
                              "w-full text-left px-2",
                              selectedTimes.includes(timeValue) &&
                                "bg-black text-white hover:bg-black"
                            )}
                            variant="outline"
                            onClick={(e) => {
                              e.preventDefault();
                              toggleTime(timeValue);
                            }}
                          >
                            {timeValue}
                          </Button>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </PopoverContent>
              </Popover>
              <FormDescription>Select your date and one or more times.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

"use client";
import { z } from "zod";
import {
  Form,
  FormItem,
  FormLabel,
  FormField,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useEffect } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import axios, { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ApiResponse } from "@/types/apiResponse";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "@radix-ui/react-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import NewRecordSchema from "@/schemas/newRecordSchema";

export default function Page() {
  const { data: session } = useSession();

  const form = useForm<z.infer<typeof NewRecordSchema>>({
    resolver: zodResolver(NewRecordSchema),
    defaultValues: {
      dateOfDeparture: undefined,
      airCraft: {
        name: "",
        model: "",
      },
      from: "",
      to: "",
      departureTime: "",
      arrivalTime: "",
      totalDuration: "",
      numberOfDayLandings: 0,
      numberOfNightLandings: 0,
      flightType: "",
      remark: "",
      flownBy: session?.user._id || "663623b84c93f1a70d664eba",
    },
  });

  const watchDepartureTime = form.watch("departureTime");
  const watchArrivalTime = form.watch("arrivalTime");

  const calculateTotalDuration = (departure: string, arrival: string) => {
    const depHours = departure.slice(0, 2);
    const depMinutes = departure.slice(2, 4);
    const arrHours = arrival.slice(0, 2);
    const arrMinutes = arrival.slice(2, 4);

    if (parseInt(depHours) > 23 || parseInt(arrHours) > 23) {
      toast.error("Hours cannot be greater than 23");
      return "";
    }

    if (parseInt(depMinutes) > 59 || parseInt(arrMinutes) > 59) {
      toast.error("Minutes cannot be greater than 59");
      return "";
    }

    let durationHours = parseInt(arrHours) - parseInt(depHours);
    let durationMinutes = parseInt(arrMinutes) - parseInt(depMinutes);

    if (durationHours < 0) {
      durationHours += 24;
    }
    if (durationMinutes < 0) {
      durationMinutes += 60;
      durationHours -= 1;
    }

    const formattedHours = durationHours.toString();
    const formattedMinutes = durationMinutes.toString();

    const totalDuration = `${formattedHours}h ${formattedMinutes}m`;

    form.setValue("totalDuration", totalDuration);
  };

  useEffect(() => {
    const updateTotalDuration = () => {
      if (watchArrivalTime.length !== 4 && watchArrivalTime.length !== 4) {
        return;
      }
      const departureTime = watchDepartureTime;
      const arrivalTime = watchArrivalTime;
      if (departureTime && arrivalTime) {
        calculateTotalDuration(departureTime, arrivalTime);
      }
    };
    updateTotalDuration();
  }, [watchDepartureTime, watchArrivalTime]);

  const onSubmit = async (data: z.infer<typeof NewRecordSchema>) => {
    try {
      const response = await axios.post("/api/createrecord", data);
      toast.success(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message);
    }
  };

  return (
    <div className="w-full p-2">
      <div className="max-w-[450px] mx-auto">
        <h4 className="font-medium text-lg">New Record</h4>
      </div>
      <div className="max-w-[450px] mx-auto my-4 border border-input p-4 rounded-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="dateOfDeparture"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date of Departure</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="airCraft.name"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Aircraft name</FormLabel>
                  <Input placeholder="aircraft name" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="airCraft.model"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Aircraft model</FormLabel>
                  <Input placeholder="aircraft model" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="from"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>From</FormLabel>
                  <Input placeholder="from" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="to"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>To</FormLabel>
                  <Input placeholder="to" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="departureTime"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Departure Time (HHMM)</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={4} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="arrivalTime"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Arrival Time (HHMM)</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={4} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="totalDuration"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Total Duration</FormLabel>
                  <Input placeholder="total duration" {...field} disabled />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="numberOfDayLandings"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Number Of Day Landings</FormLabel>
                  <Input
                    type="number"
                    placeholder="number of day landings"
                    min={0}
                    value={field.value !== undefined ? String(field.value) : ""}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="numberOfNightLandings"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Number Of Night Landings</FormLabel>
                  <Input
                    type="number"
                    placeholder="number of night landings"
                    min={0}
                    value={field.value !== undefined ? String(field.value) : ""}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="flightType"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Flight Type</FormLabel>
                  <Input placeholder="flight type" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="remark"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Remark</FormLabel>
                  <Input placeholder="remark" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="disabled:bg-gray-500 w-full"
            >
              {form.formState.isSubmitting ? "Please Wait" : "Submit"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
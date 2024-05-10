"use client";
import { z } from "zod";
import dayjs from "dayjs";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { airports } from "@/data";
import utc from "dayjs/plugin/utc";
import { useCallback, useEffect, useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import Loader from "@/components/loader";
import { useForm } from "react-hook-form";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ApiResponse } from "@/types/apiResponse";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "@radix-ui/react-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import MultiSelectFormField from "@/components/ui/multi-select";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import NewRecordSchema, { flightTypeList } from "@/schemas/newRecordSchema";

export default function Page() {
  const { data: session } = useSession();
  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);
  const [departureDateOpen, setDepartureDateOpen] = useState(false);
  const [arrivalDateOpen, setArrivalDateOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  dayjs.extend(utc);

  const router = useRouter();

  const param = useParams();
  const id = param.id;

  const form = useForm<z.infer<typeof NewRecordSchema>>({
    resolver: zodResolver(NewRecordSchema),
    defaultValues: {
      dateOfDeparture: undefined,
      dateOfArrival: undefined,
      airCraft: {
        model: "",
        registration: "",
        engine: "",
      },
      from: "",
      to: "",
      departureTime: "",
      arrivalTime: "",
      totalDuration: "",
      numberOfDayLandings: 0,
      numberOfNightLandings: 0,
      flightType: ["Solo"],
      exercises: "",
      remark: "",
      flownBy: session?.user._id || "663623b84c93f1a70d664eba",
    },
  });

  const watchDepartureTime = form.watch("departureTime");
  const watchArrivalTime = form.watch("arrivalTime");
  const watchDepartureDate = form.watch("dateOfDeparture");
  const watchArrivalDate = form.watch("dateOfArrival");

  const calculateTotalDuration = useCallback(
    (
      departureTime: string,
      arrivalTime: string,
      departureDate: Date,
      arrivalDate: Date
    ) => {
      const departureDateTime = new Date(departureDate);
      const arrivalDateTime = new Date(arrivalDate);

      if (departureDateTime > arrivalDateTime) {
        form.setValue("totalDuration", "");
        toast.error("Departure date cannot be greater than arrival date");
        return;
      }

      const departureHours = parseInt(departureTime.slice(0, 2));
      const departureMinutes = parseInt(departureTime.slice(2));
      const arrivalHours = parseInt(arrivalTime.slice(0, 2));
      const arrivalMinutes = parseInt(arrivalTime.slice(2));

      if (departureHours > 23 || arrivalHours > 23) {
        toast.error("Hours cannot be greater than 23");
        form.setValue("totalDuration", "");
        return;
      }
      if (departureMinutes > 59 || arrivalMinutes > 59) {
        toast.error("Minutes cannot be greater than 59");
        form.setValue("totalDuration", "");
        return;
      }

      departureDateTime.setHours(departureHours, departureMinutes);
      arrivalDateTime.setHours(arrivalHours, arrivalMinutes);

      if (
        departureDateTime.toDateString() === arrivalDateTime.toDateString() &&
        departureDateTime > arrivalDateTime
      ) {
        form.setValue("totalDuration", "");
        toast.error(
          "Departure time cannot be greater than arrival time on same day"
        );
        return;
      }

      const timeDifference =
        arrivalDateTime.getTime() - departureDateTime.getTime();

      const totalHours = Math.floor(timeDifference / (1000 * 60 * 60));
      const totalMinutes = Math.floor(
        (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
      );

      const totalDuration = `${totalHours}h ${totalMinutes}m`;
      form.setValue("totalDuration", totalDuration);
    },
    [form]
  );

  const updateTotalDuration = useCallback(() => {
    if (
      watchDepartureTime.length !== 4 ||
      watchArrivalTime.length !== 4 ||
      !watchDepartureDate ||
      !watchArrivalDate
    ) {
      return;
    }
    calculateTotalDuration(
      watchDepartureTime,
      watchArrivalTime,
      watchDepartureDate,
      watchArrivalDate
    );
  }, [
    calculateTotalDuration,
    watchDepartureTime,
    watchArrivalTime,
    watchDepartureDate,
    watchArrivalDate,
  ]);

  useEffect(() => {
    if (watchDepartureDate > watchArrivalDate) {
      form.setValue("dateOfArrival", watchDepartureDate);
      toast.error("Departure date cannot be greater than arrival date");
    }
  }, [watchDepartureDate, watchArrivalDate]);

  useEffect(() => {
    updateTotalDuration();
  }, [updateTotalDuration]);

  const onSubmit = async (data: z.infer<typeof NewRecordSchema>) => {
    if (!id) {
      try {
        const response = await axios.post("/api/createrecord", data);
        toast.success(response.data.message);
        form.reset();
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast.error(axiosError.response?.data.message);
      }
    } else {
      try {
        const response = await axios.put(
          `/api/edit-flight-details/${id}`,
          data
        );
        toast.success(response.data.message);
        form.reset();
        router.replace(`/detailed-flight/${id}`);
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast.error(axiosError.response?.data.message);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`/api/singleFlightDetails/${id}`);
        const localDate = dayjs
          .utc(data.details.dateOfDeparture)
          .local()
          .toDate();
        const localDate2 = dayjs
          .utc(data.details.dateOfArrival)
          .local()
          .toDate();
        form.setValue("airCraft.engine", data.details.airCraft.engine);
        form.setValue("airCraft.model", data.details.airCraft.model);
        form.setValue(
          "airCraft.registration",
          data.details.airCraft.registration
        );
        form.setValue("dateOfDeparture", localDate);
        form.setValue("dateOfArrival", localDate2);
        form.setValue("from", data.details.from);
        form.setValue("to", data.details.to);
        form.setValue("departureTime", data.details.departureTime);
        form.setValue("arrivalTime", data.details.arrivalTime);
        form.setValue("totalDuration", data.details.totalDuration);
        form.setValue("numberOfDayLandings", data.details.numberOfDayLandings);
        form.setValue(
          "numberOfNightLandings",
          data.details.numberOfNightLandings
        );
        form.setValue("flightType", data.details.flightType);
        form.setValue("exercises", data.details.exercises);
        form.setValue("remark", data.details.remark);
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        console.log(axiosError);
        toast.error(axiosError.response?.data.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchData();
    }
  }, [id]);

  return (
    <div className="p-2">
      <div className="max-w-[450px] mx-auto">
        <h4 className="font-medium text-lg text-center">New Record</h4>
      </div>
      {loading ? (
        <div className="mt-4">
          <Loader />
        </div>
      ) : (
        <div className="max-w-[450px] mx-auto my-4 border border-input p-4 rounded-md">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="airCraft.model"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Aircraft model</FormLabel>
                    <Input placeholder="e.g. Cessna 172" {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="airCraft.registration"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Aircraft registration</FormLabel>
                    <Input placeholder="e.g. VT-FSA" {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="airCraft.engine"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Aircraft Engine</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select the aircraft engine" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Single">Single</SelectItem>
                        <SelectItem value="Multi">Multi</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dateOfDeparture"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of Departure</FormLabel>
                    <Popover
                      open={departureDateOpen}
                      onOpenChange={setDepartureDateOpen}
                    >
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
                          onSelect={(e) => {
                            field.onChange(e);
                            setDepartureDateOpen(false);
                          }}
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
                name="dateOfArrival"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of Arrival</FormLabel>
                    <Popover
                      open={arrivalDateOpen}
                      onOpenChange={setArrivalDateOpen}
                    >
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
                          onSelect={(e) => {
                            field.onChange(e);
                            setArrivalDateOpen(false);
                          }}
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
                name="from"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>From</FormLabel>
                    <Popover open={fromOpen} onOpenChange={setFromOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "max-w-[300px] justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? airports.find(
                                  (airport) => airport.value === field.value
                                )?.value
                              : "Select airport"}
                            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="max-w-[300px] p-0">
                        <Command>
                          <CommandInput
                            placeholder="Search airports..."
                            className="h-9"
                          />
                          <CommandEmpty>No airport found.</CommandEmpty>
                          <CommandGroup>
                            <CommandList>
                              {airports.map((airport) => (
                                <CommandItem
                                  value={airport.label}
                                  key={airport.value}
                                  onSelect={() => {
                                    form.setValue("from", airport.value);
                                    setFromOpen(false);
                                  }}
                                >
                                  {airport.label}
                                  <CheckIcon
                                    className={cn(
                                      "ml-auto h-4 w-4",
                                      airport.value === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandList>
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
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
                    <Popover open={toOpen} onOpenChange={setToOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "max-w-[300px] justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? airports.find(
                                  (airport) => airport.value === field.value
                                )?.value
                              : "Select airport"}
                            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="max-w-[300px] p-0">
                        <Command>
                          <CommandInput
                            placeholder="Search airports..."
                            className="h-9"
                          />
                          <CommandEmpty>No airport found.</CommandEmpty>
                          <CommandGroup>
                            <CommandList>
                              {airports.map((airport) => (
                                <CommandItem
                                  value={airport.label}
                                  key={airport.value}
                                  onSelect={() => {
                                    form.setValue("to", airport.value);
                                    setToOpen(false);
                                  }}
                                >
                                  {airport.label}
                                  <CheckIcon
                                    className={cn(
                                      "ml-auto h-4 w-4",
                                      airport.value === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandList>
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
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
                    <Input placeholder="Total duration" {...field} disabled />
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
                      placeholder="Number of day landings"
                      min={0}
                      value={
                        field.value !== undefined ? String(field.value) : ""
                      }
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
                      placeholder="Number of night landings"
                      min={0}
                      value={
                        field.value !== undefined ? String(field.value) : ""
                      }
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
                  <FormItem>
                    <FormLabel>Flight Type</FormLabel>
                    <FormControl>
                      <MultiSelectFormField
                        options={flightTypeList}
                        value={field.value}
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                        placeholder="Select the type of flight"
                        variant="inverted"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="exercises"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Exercises</FormLabel>
                    <Input placeholder="Exercises (Optional)" {...field} />
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
                    <Input placeholder="Remark (Optional)" {...field} />
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
      )}
    </div>
  );
}

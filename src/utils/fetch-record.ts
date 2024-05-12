import dayjs from "dayjs";
import { toast } from "sonner";
import utc from "dayjs/plugin/utc";
import axios, { AxiosError } from "axios";
import timezone from "dayjs/plugin/timezone";
import { Record } from "@/models/record.model";
import { ApiResponse } from "@/types/apiResponse";

export const fetchRecords = async () => {
  dayjs.extend(utc);
  dayjs.extend(timezone);
  try {
    const { data } = await axios.get("/api/getrecord");
    if (!data.records?.length) {
      return data.records;
    }
    const modifiedRecords = data.records.map((record: Record) => {
      const localDate = dayjs.utc(record.dateOfDeparture).local();
      const formattedDate = localDate.format("YYYY-MM-DD");
      return { ...record, dateOfDeparture: formattedDate };
    });
    return modifiedRecords;
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse>;
    toast.error(axiosError.response?.data.message);
  }
};

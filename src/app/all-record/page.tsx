"use client";
import dayjs from "dayjs";
import { toast } from "sonner";
import utc from "dayjs/plugin/utc";
import Loader from "@/components/loader";
import axios, { AxiosError } from "axios";
import { Columns } from "../records/columns";
import timezone from "dayjs/plugin/timezone";
import { Record } from "@/models/record.model";
import { useQuery } from "@tanstack/react-query";
import { ApiResponse } from "@/types/apiResponse";
import { DataTable } from "../records/data-table";

const Page = () => {
  dayjs.extend(utc);
  dayjs.extend(timezone);

  const fetchRecords = async () => {
    try {
      const { data } = await axios.get("/api/getrecord");
      if (!data.records.length) {
        return [];
      }
      const modifiedRecords = data.records.map((record: Record) => {
        const localDate = dayjs.utc(record.dateOfDeparture).local();
        const formattedDate = localDate.format("YYYY-MM-DD");
        return { ...record, dateOfDeparture: formattedDate };
      });
      return modifiedRecords;
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      console.log(axiosError);
      toast.error(axiosError.response?.data.message);
    }
  };

  const { isLoading, data } = useQuery({
    queryKey: ["records"],
    queryFn: fetchRecords,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
  const typedData = data as Record[];

  return (
    <div className="p-2">
      <div className="max-w-2xl mx-auto">
        <h4 className="font-medium text-lg text-center">All Records</h4>
        {isLoading ? (
          <div className="mt-4">
            <Loader />
          </div>
        ) : (
          <DataTable columns={Columns} data={typedData} />
        )}
      </div>
    </div>
  );
};

export default Page;

"use client";
import { toast } from "sonner";
import Loader from "@/components/loader";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { columns } from "../records/columns";
import { Record } from "@/models/record.model";
import { ApiResponse } from "@/types/apiResponse";
import { DataTable } from "../records/data-table";

const Page = () => {
  const [data, setData] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const { data } = await axios.get("/api/getrecord");
        const modifiedRecords = data.records.map((record: Record) => {
          const datePart = record.dateOfDeparture.toString().split("T")[0];
          return { ...record, dateOfDeparture: datePart };
        });
        setData(modifiedRecords);
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast.error(axiosError.response?.data.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, []);

  return (
    <div className="w-full p-2">
      <div className="max-w-2xl mx-auto">
        <h4 className="font-medium text-lg">All Records</h4>
        {loading ? (
          <div className="mt-4">
            <Loader />
          </div>
        ) : (
          <DataTable columns={columns} data={data} />
        )}
      </div>
    </div>
  );
};

export default Page;

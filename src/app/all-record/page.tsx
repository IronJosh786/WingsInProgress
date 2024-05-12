"use client";
import Loader from "@/components/loader";
import { Columns } from "../records/columns";
import { Record } from "@/models/record.model";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "../records/data-table";
import { fetchRecords } from "@/utils/fetch-record";

const Page = () => {
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

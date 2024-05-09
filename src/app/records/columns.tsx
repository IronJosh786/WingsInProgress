"use client";
import axios, { AxiosError } from "axios";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { Record } from "@/models/record.model";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { toast } from "sonner";
import { ApiResponse } from "@/types/apiResponse";

function FlightCellActions(row: any) {
  const router = useRouter();
  const handleClick = () => {
    router.push(`/detailed-flight/${row.original._id}`);
  };
  return handleClick;
}

function FlightRecordDelete(row: any) {
  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `/api/deleterecord/${row.original._id}`
      );
      toast.success(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message);
    }
  };
  return handleDelete;
}

export const Columns: ColumnDef<Record>[] = [
  {
    id: "actions",
    cell: ({ row }) => {
      const handleClick = FlightCellActions(row);
      const handleDelete = FlightRecordDelete(row);
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleClick}>
              View flight details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete}>
              Delete Record
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
  {
    accessorKey: "dateOfDeparture",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "from",
    header: "From",
  },
  {
    accessorKey: "to",
    header: "To",
  },
  {
    accessorKey: "flightType",
    header: "Type",
  },
];

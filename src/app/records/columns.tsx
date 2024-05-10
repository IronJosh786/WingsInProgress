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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

function FlightRecordView(row: any) {
  const router = useRouter();
  const handleClick = () => {
    router.push(`/detailed-flight/${row.original._id}`);
  };
  return handleClick;
}

function FlightRecordUpdate(row: any) {
  const router = useRouter();
  const handleEdit = () => {
    router.push(`/new-record/${row.original._id}`);
  };
  return handleEdit;
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
      const handleClick = FlightRecordView(row);
      const handleEdit = FlightRecordUpdate(row);
      const handleDelete = FlightRecordDelete(row);

      return (
        <Dialog>
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
              <DropdownMenuItem onClick={handleEdit}>
                Edit flight details
              </DropdownMenuItem>
              <DropdownMenuItem>
                <DialogTrigger>Delete Record</DialogTrigger>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. Are you sure you want to
                permanently delete this record from our servers?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  type="submit"
                  variant={"destructive"}
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
    header: "Flight Type",
    cell: ({ row }) => {
      const flightTypes = row.original.flightType;

      if (!flightTypes || flightTypes.length === 0) {
        return null;
      }

      return (
        <div className="flex min-w-[100px] max-w-[150px] items-center flex-wrap gap-1">
          {flightTypes.map((type: string, index: number) => (
            <Badge key={index}>{type}</Badge>
          ))}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const selectedFlightTypes = value;
      const flightTypes = row.original.flightType;

      if (!selectedFlightTypes || selectedFlightTypes.length === 0) {
        return true;
      }

      if (!flightTypes || flightTypes.length === 0) {
        return false;
      }

      return selectedFlightTypes.every((type: any) =>
        flightTypes.includes(type)
      );
    },
  },
];

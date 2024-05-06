"use client";
import { toast } from "sonner";
import Loader from "@/components/loader";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Record } from "@/models/record.model";
import { ApiResponse } from "@/types/apiResponse";
import { Card, CardContent } from "@/components/ui/card";
import { PlaneTakeoff, PlaneLanding, Clock } from "lucide-react";

const Page = () => {
  const param = useParams();
  const id = param.id;
  const [data, setData] = useState<Record>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const { data } = await axios.get(`/api/singleFlightDetails/${id}`);
        setData(data.details);
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast.error(axiosError.response?.data.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);
  return (
    <div className="min-h-screen p-2 grid place-items-center">
      <div className="max-w-[450px] mx-auto">
        <h4 className="font-medium text-lg mb-4">Flight Details</h4>
        {loading ? (
          <Loader />
        ) : (
          <Card className="w-[300px] xs:w-[350px]">
            <CardContent className="">
              <div className="mt-4 grid w-full items-center gap-4">
                <div className="flex flex-col gap-1">
                  <p className="text-xs text-gray-500">Date:</p>
                  <Badge>
                    {data?.dateOfDeparture?.toString().split("T")[0]}
                  </Badge>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-xs text-gray-500">Aircraft:</p>
                  <Badge>
                    {data?.airCraft.name} ({data?.airCraft.model})
                  </Badge>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-xs text-gray-500">Itinerary:</p>
                  <div className="flex gap-2 items-center">
                    <PlaneTakeoff size={"20px"} />
                    <div className="flex items-center gap-2 uppercase">
                      <Badge>{data?.from}</Badge> <Clock size={"16px"} />{" "}
                      <Badge>{data?.departureTime}</Badge>
                    </div>
                  </div>
                  <div className="mt-1 flex gap-2 items-center">
                    <PlaneLanding size={"20px"} />
                    <div className="flex items-center gap-2 uppercase">
                      <Badge>{data?.to}</Badge> <Clock size={"16px"} />{" "}
                      <Badge>{data?.arrivalTime}</Badge>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-xs text-gray-500">Duration:</p>
                  <Badge>{data?.totalDuration}</Badge>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-xs text-gray-500">Number of Landings:</p>
                  <div className="text-sm">
                    Day <Badge>{data?.numberOfDayLandings}</Badge> Night{" "}
                    <Badge>{data?.numberOfNightLandings}</Badge>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-xs text-gray-500">Flight Type:</p>
                  <Badge>{data?.flightType}</Badge>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-xs text-gray-500">Remark:</p>
                  <Badge>{data?.remark}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Page;

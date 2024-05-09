"use client";
import dayjs from "dayjs";
import { toast } from "sonner";
import utc from "dayjs/plugin/utc";
import Loader from "@/components/loader";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import timezone from "dayjs/plugin/timezone";
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

  dayjs.extend(utc);
  dayjs.extend(timezone);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const { data } = await axios.get(`/api/singleFlightDetails/${id}`);
        const localDate = dayjs.utc(data.details.dateOfDeparture).local();
        const formattedDate = localDate.format("YYYY-MM-DD");
        const localDate2 = dayjs.utc(data.details.dateOfArrival).local();
        const formattedDate2 = localDate2.format("YYYY-MM-DD");
        setData({
          ...data.details,
          dateOfDeparture: formattedDate,
          dateOfArrival: formattedDate2,
        });
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
    <div className="p-2">
      <div className="max-w-[450px] mx-auto">
        <h4 className="font-medium text-lg mb-4 text-center">Flight Details</h4>
        {loading ? (
          <Loader />
        ) : (
          <Card className="w-[300px] xs:w-[350px] mx-auto">
            <CardContent className="">
              <div className="mt-4 grid w-full items-center gap-4">
                <div className="flex flex-col gap-1">
                  <p className="text-xs text-gray-500">Aircraft:</p>
                  <Badge className="uppercase">
                    {data?.airCraft.registration} (
                    <span className="capitalize">{data?.airCraft.model}</span>)
                  </Badge>
                </div>
                <Badge>{data?.airCraft.engine}</Badge>
                <div className="w-full overflow-y-auto">
                  <p className="text-xs text-gray-500">Itinerary:</p>
                  <table className="w-full mt-1">
                    <thead className="text-xs">
                      <tr className="m-0 border-t p-0">
                        <th className="border px-2 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
                          <Badge>Departure</Badge>
                        </th>
                        <th className="border px-2 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
                          <Badge>Arrival</Badge>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-xs">
                      <tr className="m-0 border-t p-0">
                        <td className="border px-2 py-1 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                          {data?.dateOfDeparture.toString()}
                        </td>
                        <td className="border px-2 py-1 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                          {data?.dateOfArrival.toString()}
                        </td>
                      </tr>
                      <tr className="m-0 border-t p-0">
                        <td className="border px-2 py-1 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                          {data?.departureTime}
                        </td>
                        <td className="border px-2 py-1 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                          {data?.arrivalTime}
                        </td>
                      </tr>
                      <tr className="m-0 border-t p-0">
                        <td className="border px-2 py-1 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                          {data?.from}
                        </td>
                        <td className="border px-2 py-1 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                          {data?.to}
                        </td>
                      </tr>
                    </tbody>
                  </table>
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
                {data?.exercises && (
                  <div className="flex flex-col gap-1">
                    <p className="text-xs text-gray-500">Exercises:</p>
                    <Badge>{data?.exercises}</Badge>
                  </div>
                )}
                {data?.remark && (
                  <div className="flex flex-col gap-1">
                    <p className="text-xs text-gray-500">Remark:</p>
                    <Badge>{data?.remark}</Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Page;

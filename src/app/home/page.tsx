"use client";
import Loader from "@/components/loader";
import { useSession } from "next-auth/react";
import { Record } from "@/models/record.model";
import { fetchRecords } from "@/utils/fetch-record";
import { QueryClient } from "@tanstack/react-query";
import { flightTypeList } from "@/schemas/newRecordSchema";
import React, { useState, useEffect, useCallback } from "react";
import MultiSelectFormField from "@/components/ui/multi-select";

const Page = () => {
  const { data: session, status } = useSession();

  const profileImage = session?.user?.profilePicture;
  const defaultImage =
    "https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg";

  const [selectedFlightTypes, setSelectedFlightTypes] = useState<string[]>([]);
  const [totalDuration, setTotalDuration] = useState<string>("");
  const [records, setRecords] = useState<Record[]>();
  const calculateTotalDuration = useCallback(() => {
    let totalDurationMinutes = 0;

    const filteredRecords = records?.filter((record) =>
      selectedFlightTypes.every((type) => record.flightType.includes(type))
    );

    filteredRecords?.forEach((record) => {
      const [hours, minutes] = record.totalDuration.split("h ");
      totalDurationMinutes += parseInt(hours) * 60 + parseInt(minutes);
    });

    const hours = Math.floor(totalDurationMinutes / 60);
    const minutes = totalDurationMinutes % 60;

    return `${hours.toString().padStart(2, "0")}h ${minutes
      .toString()
      .padStart(2, "0")}m`;
  }, [records, selectedFlightTypes]);

  useEffect(() => {
    setTotalDuration(calculateTotalDuration());
  }, [calculateTotalDuration]);

  const queryClient = new QueryClient();

  useEffect(() => {
    const getData = async () => {
      const data = await queryClient.ensureQueryData({
        queryKey: ["records"],
        queryFn: fetchRecords,
      });
      setRecords(data);
    };
    getData();
  }, []);

  return (
    <div className="grow container mx-auto h-full text-center grid place-items-center">
      {status === "loading" ? (
        <Loader />
      ) : (
        <div className="flex flex-col justify-center items-center gap-4">
          <img
            src={profileImage || defaultImage}
            width={100}
            height={100}
            alt="Picture of the author"
            className="rounded-md"
          />
          <div>
            <p className="font-bold">{session?.user.username}</p>
          </div>
          <div>
            <MultiSelectFormField
              options={flightTypeList}
              defaultValue={selectedFlightTypes}
              onValueChange={setSelectedFlightTypes}
              placeholder="Select the type of flights"
              variant="inverted"
            />
          </div>
          <div>
            <p>
              Total Duration:{" "}
              <span className="font-bold border-b-2 border-sky-500">
                {totalDuration}
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;

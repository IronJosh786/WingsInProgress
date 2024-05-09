import { NextRequest } from "next/server";
import dbConnection from "@/utils/dbConnection";
import RecordModel from "@/models/record.model";
import { User, getServerSession } from "next-auth";
import NewRecordSchema from "@/schemas/newRecordSchema";
import { authOptions } from "../../auth/[...nextauth]/authOptions";

export async function PUT(request: NextRequest) {
  await dbConnection();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;
  if (!(session && user)) {
    return Response.json(
      { success: false, message: "Login Required" },
      { status: 401 }
    );
  }

  try {
    const url = request.nextUrl.toString();
    const id = url.substring(url.lastIndexOf("/") + 1);

    const data = await request.json();
    const result = NewRecordSchema.safeParse(data);
    if (!result.success) {
      return Response.json(
        { success: false, message: result.error.errors[0].message },
        { status: 400 }
      );
    }

    let {
      dateOfDeparture,
      dateOfArrival,
      airCraft,
      from,
      to,
      departureTime,
      arrivalTime,
      totalDuration,
      numberOfDayLandings,
      numberOfNightLandings,
      flightType,
      exercises,
      remark,
    } = result.data;

    const dataToSend = {
      dateOfDeparture,
      dateOfArrival,
      airCraft,
      from,
      to,
      departureTime,
      arrivalTime,
      totalDuration,
      numberOfDayLandings,
      numberOfNightLandings,
      flightType,
      exercises,
      remark,
      flownBy: session.user._id,
    };

    const editedRecord = await RecordModel.findByIdAndUpdate(id, dataToSend);
    if (!editedRecord) {
      return Response.json(
        { success: false, message: "Could not edit the record" },
        { status: 404 }
      );
    }
    return Response.json(
      { success: true, message: "Edited the record" },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { success: false, message: "Could not edit the record" },
      { status: 500 }
    );
  }
}

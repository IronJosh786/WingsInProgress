import dbConnection from "@/utils/dbConnection";
import RecordModel from "@/models/record.model";
import { User, getServerSession } from "next-auth";
import NewRecordSchema from "@/schemas/newRecordSchema";
import { authOptions } from "../auth/[...nextauth]/authOptions";

export async function POST(request: Request) {
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
      airCraft,
      from,
      to,
      departureTime,
      arrivalTime,
      totalDuration,
      numberOfDayLandings,
      numberOfNightLandings,
      flightType,
      remark,
    } = result.data;

    const dataToSend = {
      dateOfDeparture,
      airCraft,
      from,
      to,
      departureTime,
      arrivalTime,
      totalDuration,
      numberOfDayLandings,
      numberOfNightLandings,
      flightType,
      remark,
      flownBy: session.user._id,
    };

    const newRecord = await RecordModel.create(dataToSend);

    if (!newRecord) {
      return Response.json(
        { success: false, message: "Could not create the record" },
        { status: 500 }
      );
    }

    return Response.json(
      { success: true, message: "Created the record" },
      { status: 201 }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Something went wrong while creating the record",
      },
      { status: 500 }
    );
  }
}

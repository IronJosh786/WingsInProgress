import dbConnection from "@/utils/dbConnection";
import RecordModel from "@/models/record.model";
import { User, getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/authOptions";

export async function GET(request: Request) {
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
    const records = await RecordModel.find({ flownBy: session.user._id });

    if (!records.length) {
      return Response.json(
        { success: true, message: "No records to show" },
        { status: 200 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Fetched records",
        records: records,
      },
      { status: 201 }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Something went wrong while fetching records",
      },
      { status: 500 }
    );
  }
}

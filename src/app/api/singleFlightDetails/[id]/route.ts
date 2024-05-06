import { User } from "next-auth";
import { getServerSession } from "next-auth";
import dbConnection from "@/utils/dbConnection";
import { authOptions } from "../../auth/[...nextauth]/authOptions";
import RecordModel from "@/models/record.model";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
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
    const details = await RecordModel.findById(id);
    if (!details) {
      return Response.json(
        { success: false, message: "Could not find details" },
        { status: 404 }
      );
    }
    return Response.json(
      { success: true, message: "Fetched details", details: details },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { success: false, message: "Could not fetch flight details" },
      { status: 500 }
    );
  }
}

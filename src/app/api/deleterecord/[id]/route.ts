import { User } from "next-auth";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import dbConnection from "@/utils/dbConnection";
import RecordModel from "@/models/record.model";
import { authOptions } from "../../auth/[...nextauth]/authOptions";

export async function DELETE(request: NextRequest) {
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
    const deletedRecord = await RecordModel.findByIdAndDelete(id);
    if (!deletedRecord) {
      return Response.json(
        { success: false, message: "Could not delete the record" },
        { status: 404 }
      );
    }
    return Response.json(
      { success: true, message: "Deleted the record" },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { success: false, message: "Could not delete the record" },
      { status: 500 }
    );
  }
}

import dbConnection from "@/utils/dbConnection";

export async function GET() {
  await dbConnection();
  return Response.json(
    { success: true, message: "server is working" },
    { status: 200 }
  );
}

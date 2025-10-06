import { getHolidaysFromYear } from "@/services/calendar/fetch-holidays";
import { NextRequest, NextResponse } from "next/server";
import { fetchHolidaysSchema } from "./schema";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const yearParam = searchParams.get("year") ?? undefined;
  const { success, data } = fetchHolidaysSchema.safeParse({ year: yearParam });

  if (success === false) {
    return NextResponse.json(
      {
        message: "Could not calculated holidays from year",
        error: "Invalid params",
      },
      { status: 400 }
    );
  }

  const { holidays, error } = getHolidaysFromYear(data.year);

  if (error) {
    return NextResponse.json(
      {
        message: "Could not calculated holidays from year",
        error: error.message,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    message: `Listing the holidays of ${data.year}`,
    data: holidays,
  });
}

import { NextResponse, NextRequest } from "next/server";
import { isHolidaySchema } from "./schema";
import { isHoliday } from "@/services/calendar/is-holiday";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const dateParam = searchParams.get("date") ?? undefined;

  const { success, data } = isHolidaySchema.safeParse({
    date: dateParam,
  });

  if (success === false) {
    return NextResponse.json(
      {
        message: "Could not calculated business days between dates",
        error: "Invalid params",
      },
      { status: 400 }
    );
  }

  const { date } = data;

  const isDateAHoliday = isHoliday(date);

  return NextResponse.json({
    data: {
      date,
      isHoliday: isDateAHoliday,
    },
  });
}

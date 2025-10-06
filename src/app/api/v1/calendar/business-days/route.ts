import { NextResponse, NextRequest } from "next/server";
import { businessDaysBetweenDatesSchema } from "./schema";
import { calculateBusinessDaysBetween } from "@/services/calendar/business-days";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const startDateParam = searchParams.get("startDate");
  const endDateParam = searchParams.get("endDate");
  const includeSaturdaysParam =
    searchParams.get("includeSaturdays") ?? undefined;

  const { success, data } = businessDaysBetweenDatesSchema.safeParse({
    startDate: startDateParam,
    endDate: endDateParam,
    includeSaturdays:
      includeSaturdaysParam === "true"
        ? true
        : includeSaturdaysParam === "false"
        ? false
        : undefined,
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

  const { startDate, endDate, includeSaturdays } = data;

  const businessDays = calculateBusinessDaysBetween(startDate, endDate, {
    includeSaturdays,
  });

  return NextResponse.json({
    data: {
      businessDays,
    },
  });
}

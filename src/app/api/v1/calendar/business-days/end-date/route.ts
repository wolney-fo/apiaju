import { NextResponse, NextRequest } from "next/server";
import { calculateEndDateWithBusinessDaysSchema } from "./schema";
import { calculateEndDate } from "@/services/calendar/business-days";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const startDateParam = searchParams.get("startDate");
  const workingDaysParam = searchParams.get("workingDays");
  const includeSaturdaysParam =
    searchParams.get("includeSaturdays") ?? undefined;

  const { success, data } = calculateEndDateWithBusinessDaysSchema.safeParse({
    startDate: startDateParam,
    workingDays: workingDaysParam,
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

  const { startDate, workingDays, includeSaturdays } = data;

  const endDate = calculateEndDate(startDate, workingDays, {
    includeSaturdays,
  });

  return NextResponse.json({
    data: {
      endDate,
    },
  });
}

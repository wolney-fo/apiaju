import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { getHolidaysFromYear } from "./fetch-holidays";

dayjs.extend(utc);
dayjs.extend(timezone);

const SP_TIMEZONE = "America/Sao_Paulo";

type BusinessDaysConfig = {
  includeSaturdays: boolean;
};

function isWeekend(date: dayjs.Dayjs, includeSaturdays: boolean): boolean {
  const day = date.day();
  if (day === 0) return true;
  if (day === 6 && !includeSaturdays) return true;
  return false;
}

function isHoliday(date: dayjs.Dayjs, holidays: string[]): boolean {
  const dateStr = date.format("YYYY-MM-DD");
  return holidays.includes(dateStr);
}

export function calculateBusinessDaysBetween(
  startDate: string,
  endDate: string,
  config: BusinessDaysConfig
): number {
  const start = dayjs.tz(startDate, SP_TIMEZONE);
  const end = dayjs.tz(endDate, SP_TIMEZONE);

  const startYear = start.year();
  const endYear = end.year();
  const allHolidays: string[] = [];

  for (let year = startYear; year <= endYear; year++) {
    const result = getHolidaysFromYear(year);
    if (result.error) {
      throw result.error;
    }
    allHolidays.push(...result.holidays.map((h) => h.date));
  }

  let businessDays = 0;
  let current = start;

  while (current.isBefore(end) || current.isSame(end, "day")) {
    if (
      !isWeekend(current, config.includeSaturdays) &&
      !isHoliday(current, allHolidays)
    ) {
      businessDays++;
    }
    current = current.add(1, "day");
  }

  return businessDays;
}

export function calculateEndDate(
  startDate: string,
  businessDaysToAdd: number,
  config: BusinessDaysConfig
): string {
  const start = dayjs.tz(startDate, SP_TIMEZONE);
  const startYear = start.year();

  const allHolidays: string[] = [];
  for (let year = startYear; year <= startYear + 3; year++) {
    const result = getHolidaysFromYear(year);
    if (result.error) {
      throw result.error;
    }
    allHolidays.push(...result.holidays.map((h) => h.date));
  }

  let daysAdded = 0;
  let current = start;

  while (daysAdded < businessDaysToAdd) {
    current = current.add(1, "day");

    if (
      !isWeekend(current, config.includeSaturdays) &&
      !isHoliday(current, allHolidays)
    ) {
      daysAdded++;
    }
  }

  return current.format("YYYY-MM-DD");
}

import { getHolidaysFromYear } from "./fetch-holidays";
import { YearOutsideTheRange } from "@/errors/year-outside-the-range";

export function isHoliday(date: string) {
  const { holidays, error } = getHolidaysFromYear(Number(date.slice(0, 4)));

  if (error) {
    throw new YearOutsideTheRange();
  }

  return holidays.some((holiday) => holiday.date === date);
}

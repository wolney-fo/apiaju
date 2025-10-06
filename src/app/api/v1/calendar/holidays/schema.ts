import { z } from "zod";
import dayjs from "@/lib/dayjs";

export const fetchHolidaysSchema = z.object({
  year: z.coerce.number().int().optional().default(dayjs().year()),
});

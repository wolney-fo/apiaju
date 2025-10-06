import { z } from "zod";

const strictDate =
  /^(?:(?:[0-9]{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12][0-9]|3[01])|(?:0[469]|11)-(?:0[1-9]|[12][0-9]|30)|02-(?:0[1-9]|1[0-9]|2[0-8])))|(?:(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:[02468][048]00|[13579][26]00))-02-29))$/;

export const calculateEndDateWithBusinessDaysSchema = z.object({
  startDate: z.string().refine((value) => value.match(strictDate)),
  workingDays: z.coerce.number().int().min(1),
  includeSaturdays: z.coerce.boolean().optional().default(false),
});

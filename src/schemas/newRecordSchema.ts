import { z } from "zod";
import mongoose from "mongoose";

export const stringSchema = z
  .string()
  .trim()
  .min(1, { message: "Atleast 1 character is required" });

const NewRecordSchema = z.object({
  dateOfDeparture: z.coerce.date(),
  airCraft: z.object({
    name: stringSchema,
    model: stringSchema,
  }),
  from: stringSchema,
  to: stringSchema,
  departureTime: z
    .string()
    .length(4, { message: `Time should adhere to this format: '1230'` }),
  arrivalTime: z
    .string()
    .length(4, { message: `Time should adhere to this format: '2345'` }),
  totalDuration: stringSchema,
  numberOfDayLandings: z.number().nonnegative(),
  numberOfNightLandings: z.number().nonnegative(),
  flightType: stringSchema,
  remark: z.string().optional(),
  flownBy: z.string().refine((val) => {
    return mongoose.Types.ObjectId.isValid(val);
  }),
});

export default NewRecordSchema;

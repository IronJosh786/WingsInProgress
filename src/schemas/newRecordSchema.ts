import { z } from "zod";
import mongoose from "mongoose";

export const stringSchema = z
  .string()
  .trim()
  .min(1, { message: "Atleast 1 character is required" });

const NewRecordSchema = z.object({
  dateOfDeparture: z.string().date(),
  airCraft: z.object({
    name: stringSchema,
    model: stringSchema,
  }),
  from: stringSchema,
  to: stringSchema,
  departureTime: z.string().time(),
  arrivalTime: z.string().time(),
  totalDuration: z.string().time(),
  numberOfDayLandings: z.number().positive(),
  numberOfNightLandings: z.number().positive(),
  flightType: stringSchema,
  remark: z.string().optional(),
  flownBy: z.string().refine((val) => {
    return mongoose.Types.ObjectId.isValid(val);
  }),
});

export default NewRecordSchema;

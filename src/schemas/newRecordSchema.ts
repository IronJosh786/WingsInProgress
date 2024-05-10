import { z } from "zod";
import mongoose from "mongoose";

const VALUES = ["Solo", "Dual", "Night", "GF", "IF", "X-Cty", "CL"] as const;

export const flightTypeList = [
  {
    value: "Solo",
    label: "Solo",
  },
  {
    value: "Dual",
    label: "Dual",
  },
  {
    value: "Night",
    label: "Night",
  },
  {
    value: "GF",
    label: "General Flying",
  },
  {
    value: "IF",
    label: "Instrument Flying",
  },
  {
    value: "X-Cty",
    label: "Cross Country",
  },
  {
    value: "CL",
    label: "Circuit & Landings",
  },
];

export const stringSchema = z
  .string()
  .trim()
  .min(1, { message: "Atleast 1 character is required" });

const NewRecordSchema = z.object({
  dateOfDeparture: z.coerce.date(),
  dateOfArrival: z.coerce.date(),
  airCraft: z.object({
    model: stringSchema,
    registration: stringSchema,
    engine: stringSchema,
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
  flightType: z.array(z.enum(VALUES)),
  exercises: z.string().optional(),
  remark: z.string().optional(),
  flownBy: z.string().refine((val) => {
    return mongoose.Types.ObjectId.isValid(val);
  }),
});

export default NewRecordSchema;

import { z } from "zod";

export const UsernameSchema = z
  .string()
  .trim()
  .min(1, { message: "Atleast 1 character is required" })
  .max(30, { message: "Atmost 30 characters are allowed" });

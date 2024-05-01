import { z } from "zod";
import { UsernameSchema } from "./usernameSchema";

export const SignInSchema = z.object({
  email: z.string().email({ message: "Invalid email format" }),
  name: z.string().trim(),
  profilePicture: z.string().optional(),
  username: UsernameSchema,
});

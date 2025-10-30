import { z } from "zod";

export const signInSchema = z.object({
  user_id: z.string().min(5),
  password: z.string().min(8),
});
export type signInSchemaType = z.infer<typeof signInSchema>;

export const changePasswordSchema = z
  .object({
    current_password: z.string().min(8),
    password: z.string().min(8),
    password_confirmation: z.string().min(8),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords don't match",
    path: ["password_confirmation"],
  });
export type changePasswordSchemaType = z.infer<typeof changePasswordSchema>;
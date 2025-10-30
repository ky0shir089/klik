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

export const moduleSchema = z.object({
  name: z.string().min(1),
  icon: z.string().optional(),
  position: z.number().positive(),
});
export type moduleSchemaType = z.infer<typeof moduleSchema>;

export const menuSchema = z.object({
  name: z.string().min(1),
  url: z.string(),
  position: z.number().positive(),
  is_active: z.boolean(),
  slug: z.string().optional(),
  module_id: z.number().positive(),
});
export type menuSchemaType = z.infer<typeof menuSchema>;

export const roleSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  menus: z.array(z.number()).min(1, "Select at least one menu"),
  permissions: z.array(z.number()).min(1, "Select at least one permission"),
});
export type roleSchemaType = z.infer<typeof roleSchema>;
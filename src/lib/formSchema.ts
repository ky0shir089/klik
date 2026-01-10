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
  permissions: z.array(z.number()),
});
export type roleSchemaType = z.infer<typeof roleSchema>;

export const userSchema = z.object({
  user_id: z.string().min(5),
  name: z.string().min(1),
  change_password: z.boolean(),
  role: z.object({ id: z.number().positive() }).optional(),
  role_id: z.number().positive(),
});
export type userSchemaType = z.infer<typeof userSchema>;

export const coaSchema = z.object({
  code: z.string().min(7),
  description: z.string().min(1),
  type: z.enum(["ASSET", "EQUITY", "EXPENSE", "LIABILITIES", "REVENUE"]),
  parent_id: z.number().nullable().optional(),
});
export type coaSchemaType = z.infer<typeof coaSchema>;

export const typeTrxSchema = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
  in_out: z.enum(["IN", "OUT"]),
  is_active: z.boolean(),
});
export type typeTrxSchemaType = z.infer<typeof typeTrxSchema>;

export const trxDtlSchema = z.object({
  trx_id: z.number().positive(),
  coa_id: z.number().positive(),
  is_active: z.boolean(),
});
export type trxDtlSchemaType = z.infer<typeof trxDtlSchema>;

export const bankSchema = z.object({
  name: z.string().min(3),
  logo: z.union([z.instanceof(File), z.null()]).optional(),
});
export type bankSchemaType = z.infer<typeof bankSchema>;

export const bankAccountSchema = z.object({
  account_number: z.string().min(1),
  account_name: z.string().min(1),
  is_active: z.boolean(),
  bank_id: z.number().positive(),
  coa_id: z.number().positive(),
});
export type bankAccountSchemaType = z.infer<typeof bankAccountSchema>;

export const rvSchema = z.object({
  date: z.iso.date(),
  type_trx_id: z.number().positive(),
  description: z.string().min(1),
  pay_method: z.string().min(1),
  bank_account_id: z.number().positive().nullable(),
  coa_id: z.number().positive(),
  starting_balance: z.number().positive().nullable(),
});
export type rvSchemaType = z.infer<typeof rvSchema>;

export const rvClassificationSchema = z.object({
  rvs: z.array(z.number().positive()).min(1, "Select at least one RV"),
  units: z.array(z.number().positive()).min(1, "Select at least one Unit"),
});
export type rvClassificationSchemaType = z.infer<typeof rvClassificationSchema>;

export const paymentSchema = z.object({
  payment_date: z.iso.date(),
  branch_id: z.string().min(1),
  branch_name: z.string().min(1),
  customer_id: z.number().positive(),
  units: z.array(z.number().positive()).min(1, "Select at least one Unit"),
});
export type paymentSchemaType = z.infer<typeof paymentSchema>;

export const pvSchema = z.object({
  paid_date: z.iso.date(),
  description: z.string().min(1),
  payment_method: z.string().min(1),
  bank_account_id: z.number().positive().nullable(),
  pvs: z.array(z.number().positive()).min(1, "Select at least one PV"),
});
export type pvSchemaType = z.infer<typeof pvSchema>;

export const uploadFileSchema = z.object({
  id: z.number().positive().optional(),
  file: z.union([z.instanceof(File), z.null()]),
});
export type uploadFileSchemaType = z.infer<typeof uploadFileSchema>;

export const invoiceDetailSchema = z.object({
  inv_coa_id: z.number().positive(),
  description: z.string().min(1),
  item_amount: z.number().positive().nullable(),
  pph_id: z.number().positive().nullable(),
  pph_rate: z.number().min(0).max(100),
  pph_amount: z.number().min(0),
  ppn_rate: z.number().min(0).max(100),
  ppn_amount: z.number().min(0),
  rv_id: z.number().positive().nullable(),
  total_amount: z.number().positive(),
});
export type invoiceDetailSchemaType = z.infer<typeof invoiceDetailSchema>;

export const invoiceSchema = z.object({
  date: z.iso.date(),
  trx_id: z.number().positive().nullable(),
  supplier_id: z.number().positive().nullable(),
  payment_method: z.string().min(1),
  supplier_account_id: z.number().positive().nullable(),
  description: z.string().min(1),
  attachment: z.union([z.instanceof(File), z.null()]),
  details: z.array(invoiceDetailSchema).min(1, "Select at least one item"),
});
export type invoiceSchemaType = z.infer<typeof invoiceSchema>;

export const invoiceStatusSchema = z.object({
  status: z.string(),
  signature: z.array(z.array(z.number())).min(1).nullable(),
});
export type invoiceStatusSchemaType = z.infer<typeof invoiceStatusSchema>;

export const supplierSchema = z.object({
  name: z.string().min(1),
  bank_id: z.number().positive(),
  account_number: z.string().min(1),
  account_name: z.string().min(1),
});
export type supplierSchemaType = z.infer<typeof supplierSchema>;

export const memoPaymentSchema = z.object({
  spps: z.array(z.number().positive()).min(1),
});
export type memoPaymentSchemaType = z.infer<typeof memoPaymentSchema>;

export const auctionSchema = z.object({
  auction_date: z.iso.date(),
});
export type auctionSchemaType = z.infer<typeof auctionSchema>;

export const sppSchema = z.object({
  customer_id: z.number().positive(),
  units: z.array(z.number().positive()).min(1, "Select at least one Unit"),
});
export type sppSchemaType = z.infer<typeof sppSchema>;

export const removeRvSchema = z.object({
  status: z.string().min(1),
});
export type removeRvSchemaType = z.infer<typeof removeRvSchema>;

export const pphSchema = z.object({
  name: z.string().min(1),
  rate: z.number().positive().nullable(),
  coa_id: z.number().positive(),
});
export type pphSchemaType = z.infer<typeof pphSchema>;

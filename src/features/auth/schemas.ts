import { z } from 'zod';

// Les messages sont des clés i18n, traduites à l'affichage avec t(message).
const phone = z.string().regex(/^(\+212|0)[5-7]\d{8}$/, 'auth.errors.invalidPhone');
const password = z.string().min(6, 'auth.errors.passwordMin');

export const loginSchema = z.object({ phone, password });
export type LoginForm = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z.string().min(2, 'auth.errors.nameMin'),
  phone,
  password,
});
export type RegisterForm = z.infer<typeof registerSchema>;

export const resetPasswordSchema = z
  .object({ code: z.string().regex(/^\d{6}$/, 'auth.errors.invalidOtp'), password, confirm: z.string() })
  .refine((v) => v.password === v.confirm, { message: 'auth.errors.passwordMismatch', path: ['confirm'] });
export type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export const changePasswordSchema = z
  .object({ current: z.string().min(1, 'auth.errors.required'), password, confirm: z.string() })
  .refine((v) => v.password === v.confirm, { message: 'auth.errors.passwordMismatch', path: ['confirm'] })
  .refine((v) => v.password !== v.current, { message: 'auth.errors.samePassword', path: ['password'] });
export type ChangePasswordForm = z.infer<typeof changePasswordSchema>;

export const phoneSchema = z.object({ phone });
export type PhoneForm = z.infer<typeof phoneSchema>;

export const contactSchema = z.object({ name: z.string().trim().min(2, 'auth.errors.nameMin'), phone });
export type ContactForm = z.infer<typeof contactSchema>;

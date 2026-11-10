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

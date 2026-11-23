import { z } from 'zod';

// Messages = clés i18n, traduites à l'affichage.
const city = z.string().trim().min(2, 'carpool.errors.city');

export const carpoolSearchSchema = z.object({ from: city, to: city });
export type CarpoolSearchForm = z.infer<typeof carpoolSearchSchema>;

export const publishTripSchema = z
  .object({
    from: city,
    to: city,
    time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'carpool.errors.time'),
    price: z.coerce.number<string>().int().min(10, 'carpool.errors.price').max(1000, 'carpool.errors.price'),
  })
  .refine((v) => v.from.toLowerCase() !== v.to.toLowerCase(), { message: 'carpool.errors.sameCity', path: ['to'] });
export type PublishTripForm = z.input<typeof publishTripSchema>;
export type PublishTripValues = z.output<typeof publishTripSchema>;

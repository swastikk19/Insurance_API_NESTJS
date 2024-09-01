import { z } from 'zod';

const alphabeticRegex = /^[a-zA-Z ]+$/;

export const insurerMaster = z.object({
  insurerName: z
    .string()
    .min(1, { message: 'Customer Name cannot be empty' })
    .regex(alphabeticRegex, {
      message: 'Insurer Name must contain only alphabetic characters',
    }),

  addedBy: z.string().min(1, { message: 'Added By cannot be empty' }),
});

export type insurerMasterDTO = z.infer<typeof insurerMaster>;

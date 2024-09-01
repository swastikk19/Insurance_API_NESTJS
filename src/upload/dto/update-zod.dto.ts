import { z } from 'zod';

export const updateRecordInsurance = z.object({
  make: z.string().min(1, { message: 'Make cannot be empty' }),

  model: z.string().min(1, { message: 'Model cannot be empty' }),

  insurer: z.string().min(1, { message: 'insurer cannot be empty' }),
});

export type updateRecordInsuranceDTO = z.infer<typeof updateRecordInsurance>;

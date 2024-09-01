import { z } from 'zod';

export const allInsurance = z.object({
  policyNo: z.string().min(1, { message: 'policyNo is required!' }),
});

export type allInsuranceDTO = z.infer<typeof allInsurance>;

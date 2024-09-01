import { z } from 'zod';

export const GeneratePolicyRequest = z.object({
  CorrelationId: z
    .string()
    .min(1, { message: 'CorrelationId cannot be empty!' }),

  policyNo: z.string().min(1, { message: 'policyNo cannot be empty!' }),

  DealId: z.string().min(1, { message: 'DealId cannot be empty!' }),
});

export type GeneratePolicyDTO = z.infer<typeof GeneratePolicyRequest>;

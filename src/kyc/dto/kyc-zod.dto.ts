import { z } from 'zod';

const alphanumericWithSpecialRegex = /^[a-zA-Z0-9!@#$%^&*(),.?":{}|<>-]*$/;

export const kyc = z.object({
  correlationId: z
    .string()
    .min(1, { message: 'correlationId cannot be empty!' })
    .regex(alphanumericWithSpecialRegex, {
      message: 'correlationId must be in correct format',
    }),
  certificate_type: z.string().default('PAN'),
  pep_flag: z.boolean().default(false),
  pan_details: z.object({
    pan: z.string().min(1, { message: 'pan cannot be empty!' }),
    dob: z.string().min(1, { message: 'dob cannot be empty!' }),
  }),
});

export type kycDTO = z.infer<typeof kyc>;

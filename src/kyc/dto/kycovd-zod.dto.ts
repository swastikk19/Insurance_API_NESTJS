import { z } from 'zod';

const alphabeticRegex = /^[a-zA-Z ]+$/;

export const kycOvd = z.object({
  poiCertificateType: z
    .string()
    .min(1, { message: 'POI Certificate Type cannot be empty!' })
    .regex(alphabeticRegex, {
      message: 'POI Certificate Type must contain only alphabetic characters',
    }),

  correlationId: z
    .string()
    .min(1, { message: 'CorrelationId cannot be empty!' }),
});

export type kycOvdDTO = z.infer<typeof kycOvd>;

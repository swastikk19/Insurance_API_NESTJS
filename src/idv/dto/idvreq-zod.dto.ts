import { z } from 'zod';

const alphanumericWithSpecialRegex = /^[a-zA-Z0-9!@#$%^&*(),.?":{}|<>-]*$/;

export const idvRequest = z.object({
  correlationId: z
    .string()
    .min(1, { message: 'CorrelationId cannot be empty' })
    .regex(alphanumericWithSpecialRegex),

  manufacturercode: z.number().optional(),
  BusinessType: z.string().optional(),
  rtolocationcode: z.number().optional(),
  DeliveryOrRegistrationDate: z.string().optional(),
  PolicyStartDate: z.string().optional(),
  DealID: z.string().optional(),
  vehiclemodelcode: z.number().optional(),
});

export type idvRequestDTO = z.infer<typeof idvRequest>;

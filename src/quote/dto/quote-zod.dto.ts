import { z } from 'zod';

const alphanumericWithSpecialRegex = /^[a-zA-Z0-9!@#$%^&*(),.?":{}|<>-]*$/;
// const alphabeticRegex = /^[a-zA-Z ]+$/;
// const numericRegex = /^\d+$/;
// const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

export const quotationMaster = z.object({
  DealId: z.string().optional(),

  CorrelationId: z
    .string()
    .min(1, { message: 'CorrelationId cannot be empty' })
    .regex(alphanumericWithSpecialRegex),

  PolicyEndDate: z.string().optional(),

  PolicyStartDate: z.string().optional(),

  RTOLocationCode: z.string().optional(),

  VehicleMakeCode: z.string().optional(),

  VehicleModelCode: z.string().optional(),

  ManufacturingYear: z.string().optional(),

  DeliveryOrRegistrationDate: z.string().optional(),

  GSTToState: z.string().optional(),

  BusinessType: z.string().optional(),

  ProductCode: z.string().optional(),

  VehiclebodyPrice: z.string().optional(),
  
  VehiclechasisPrice: z.string().optional(),
});

export type quotationMasterDTO = z.infer<typeof quotationMaster>;

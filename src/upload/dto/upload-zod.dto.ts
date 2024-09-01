import { z } from 'zod';

const alphanumericRegex = /^[a-zA-Z0-9 ]+$/;
const alphabeticRegex = /^[a-zA-Z ]+$/;
const numericRegex = /^[0-9]+$/;
const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;

export const excelUploadSchema = z
  .object({
    loanId: z
      .string()
      .min(1, { message: 'LoanId cannot be empty' })
      .regex(alphanumericRegex, {
        message: 'LoanId must be alphanumeric with no special characters',
      }),

    applicationAge: z
      .number()
      .min(0, { message: 'Application Age must be a non-negative number' }),

    partnerPriority: z
      .string()
      .min(1, { message: 'Partner Priority cannot be empty' })
      .transform((val) => val.toLowerCase())
      .refine((val) => ['green', 'amber', 'red'].includes(val), {
        message: 'Partner Priority must be one of "Green", "Amber", "Red"',
      }),

    partnerCode: z
      .string()
      .min(1, { message: 'Partner Code cannot be empty' })
      .regex(alphanumericRegex, {
        message: 'Partner Code must be alphanumeric with no special characters',
      }),

    customerName: z
      .string()
      .min(1, { message: 'Customer Name cannot be empty' })
      .regex(alphabeticRegex, {
        message: 'Customer Name must contain only alphabetic characters',
      }),

    make: z.string().min(1, { message: 'Make cannot be empty' }),

    model: z.string().min(1, { message: 'Model cannot be empty' }),

    motorNumber: z
      .string()
      .length(17, { message: 'Motor Number must be 17 characters long' })
      .regex(alphanumericRegex, {
        message: 'Motor Number must be alphanumeric',
      }),

    chassisNumber: z
      .string()
      .length(17, { message: 'Chassis Number must be 17 characters long' })
      .regex(alphanumericRegex, {
        message: 'Chassis Number must be alphanumeric',
      }),

    idv: z.number().min(1, { message: 'IDV cannot be empty' }),

    address: z.string().min(1, { message: 'Address cannot be empty' }),

    state: z
      .string()
      .min(1, { message: 'State cannot be empty' })
      .regex(alphabeticRegex, {
        message: 'State must contain only alphabetic characters',
      }),

    city: z
      .string()
      .min(1, { message: 'City cannot be empty' })
      .regex(alphabeticRegex, {
        message: 'City must contain only alphabetic characters',
      }),
    pincode: z.number().min(1, { message: 'Pincode cannot be empty' }),

    rtoCode: z
      .string()
      .min(1, { message: 'RTO Code cannot be empty' })
      .regex(alphanumericRegex, {
        message: 'RTO Code must be alphanumeric with no special characters',
      }),

    manufaturingYear: z
      .string()
      .min(1, { message: 'Manufacturing Year cannot be empty' })
      .regex(numericRegex, { message: 'Manufacturing Year must be numeric' }),

    vehicleUsageType: z
      .string()
      .min(1, { message: 'Vehicle Usage Type cannot be empty' })
      .regex(alphabeticRegex, {
        message: 'Vehicle Usage Type must contain only alphabetic characters',
      }),

    panNumber: z
      .string()
      .min(1, { message: 'Pan Number cannot be empty' })
      .regex(alphanumericRegex, {
        message: 'Pan Number must be alphanumeric with no special characters',
      }),

    dob: z
      .string()
      .min(1, { message: 'DOB cannot be empty' })
      .regex(dateRegex, { message: 'DOB must be in the format DD/MM/YYYY' }),

    insurer: z
      .string()
      .min(1, { message: 'Preferred Insurer cannot be empty' })
      .regex(alphabeticRegex, {
        message:
          'Preferred Insurer must be alphbetic with no special characters',
      }),
    priorityCode: z.number().optional(),
  })
  .superRefine((data, context) => {
    switch (data.partnerPriority) {
      case 'green':
        data.priorityCode = 1;
        break;
      case 'amber':
        data.priorityCode = 2;
        break;
      case 'red':
        data.priorityCode = 3;
        break;
      default:
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Invalid partnerPriority value',
          path: ['partnerPriority'],
        });
    }
  });

export const excelUploadArraySchema = z.array(excelUploadSchema);

export type excelUploadDTO = z.infer<typeof excelUploadSchema>;
export type excelUploadDTOArray = z.infer<typeof excelUploadArraySchema>;

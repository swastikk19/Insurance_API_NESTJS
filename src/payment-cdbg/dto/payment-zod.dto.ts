import { z } from 'zod';

export const PaymentRequest = z.object({
  DealId: z.string().min(1, { message: 'DealId cannot be empty!' }),
  CorrelationId: z
    .string()
    .min(1, { message: 'CorrelationId cannot be empty!' }),

  PaymentEntry: z.object({
    cdbgTagging: z.object({
      CDBGPayerID: z
        .string()
        .min(1, { message: 'CDBGPayerID cannot be empty' }),
      CDBGNo: z.string().min(1, { message: 'CDBGPayerID cannot be empty' }),
      CDBGType: z.string().default('CD'),
      ProposalNo: z
        .array(z.string())
        .nonempty({ message: 'ProposalNo cannot be empty!' }),
    }),
  }),
});

export type PaymentRequestDTO = z.infer<typeof PaymentRequest>;

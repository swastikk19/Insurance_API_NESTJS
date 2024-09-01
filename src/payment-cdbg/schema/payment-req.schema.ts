import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type PaymentRequestDocument = PaymentRequest & Document;

export class cdbgTaggingClass {
  CDBGPayerID: string;
  CDBGNo: string;
  CDBGType: string;
  ProposalNo: string[];
}

export class paymentEntryClass {
  cdbgTagging: cdbgTaggingClass;
}

@Schema({
  timestamps: true,
})
export class PaymentRequest {
  @Prop({ required: true })
  DealId: string;

  @Prop({ required: true })
  CorrelationId: string;

  @Prop()
  PaymentEntry: paymentEntryClass;
}

export const PaymentRequestSchema =
  SchemaFactory.createForClass(PaymentRequest);

import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Prop } from '@nestjs/mongoose';

export type PaymentResponseDocument = PaymentResponse & Document;

@Schema()
export class cdbgResponseListClass {
  CoverNoteNo: string;
  PolicyNo: string;
  TransStatus: string;
  Error_ID: string;
  ErrorText: string;
  Status: string;
}

@Schema({
  timestamps: true,
})
export class PaymentResponse {
  @Prop()
  paymentEntryResponse: string;

  @Prop()
  paymentMappingResponse: string;

  @Prop()
  paymentTagResponse: string;

  @Prop()
  cdbgResponse: cdbgResponseListClass[];

  @Prop()
  Message: string;

  @Prop()
  Status: string;

  @Prop()
  StatusMessage: string;

  @Prop()
  CorrelationId: string;
}

export const PaymentResponseSchema =
  SchemaFactory.createForClass(PaymentResponse);

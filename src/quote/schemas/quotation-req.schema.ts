import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type QuoteRequestDocument = InsuranceQuoteRequest & Document;

@Schema({
  timestamps: true,
})
export class InsuranceQuoteRequest {
  @Prop()
  DealId: string;

  @Prop()
  CorrelationId: string;

  @Prop()
  PolicyEndDate: string;

  @Prop()
  PolicyStartDate: string;

  @Prop()
  RTOLocationCode: string;

  @Prop()
  VehicleMakeCode: string;

  @Prop()
  VehicleModelCode: string;

  @Prop()
  ManufacturingYear: string;

  @Prop()
  DeliveryOrRegistrationDate: string;

  @Prop()
  GSTToState: string;

  @Prop()
  BusinessType: string;

  @Prop()
  ProductCode: string;

  @Prop()
  VehiclebodyPrice: string;

  @Prop()
  VehiclechasisPrice: string;

  @Prop()
  loanId: string;
}

export const QuoteRequestSchema = SchemaFactory.createForClass(
  InsuranceQuoteRequest,
);

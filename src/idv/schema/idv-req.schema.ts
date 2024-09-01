import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type IdvRequestDocument = IdvRequest & Document;

@Schema({
  timestamps: true,
})
export class IdvRequest {
  @Prop()
  manufacturercode: number;

  @Prop()
  BusinessType: string;

  @Prop()
  rtolocationcode: number;

  @Prop()
  DeliveryOrRegistrationDate: string;

  @Prop()
  PolicyStartDate: string;

  @Prop()
  DealID: string;

  @Prop()
  vehiclemodelcode: number;

  @Prop()
  correlationId: string;
}

export const IdvRequestSchema = SchemaFactory.createForClass(IdvRequest);

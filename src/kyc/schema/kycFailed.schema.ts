import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type KycFailedDocument = KycFailed & Document;

@Schema()
export class KycFailed {
  @Prop()
  correlationId: string;
  @Prop()
  status: boolean;
  @Prop()
  statusMessage: string;
  @Prop()
  message: string;
}

export const KycFailedSchema = SchemaFactory.createForClass(KycFailed);

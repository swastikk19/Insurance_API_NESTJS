import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type KycRequestDocument = KycRequest & Document;

@Schema()
export class panDetailsReq {
  pan: string;
  dob: string;
}

@Schema({
  timestamps: true,
})
export class KycRequest {
  @Prop()
  correlationId: string;

  @Prop()
  pan_details: panDetailsReq;
}

export const KycRequestSchema = SchemaFactory.createForClass(KycRequest);

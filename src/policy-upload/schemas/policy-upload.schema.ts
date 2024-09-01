import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PolicyUploadDocument = PolicyUpload & Document;

@Schema({
  timestamps: true,
})
export class PolicyUpload {
  @Prop({
    required: true,
  })
  originalname: string;

  @Prop({
    required: true,
  })
  filename: string;

  @Prop({
    required: true,
  })
  path: string;

  @Prop({
    required: true,
  })
  size: number;

  @Prop()
  loanId: string;
}

export const policyUploadSchema = SchemaFactory.createForClass(PolicyUpload);

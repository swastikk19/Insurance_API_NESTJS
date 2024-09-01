import { Schema, SchemaFactory } from '@nestjs/mongoose';

export type GeneratePolicyDocument = GeneratePolicy & Document;

@Schema({
  timestamps: true,
})
export class GeneratePolicy {
  CorrelationId: string;
  policyNo: string;
  DealId: string;
}

export const GeneratePolicySchema =
  SchemaFactory.createForClass(GeneratePolicy);

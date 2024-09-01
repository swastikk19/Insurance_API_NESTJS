import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IsNumber } from 'class-validator';

export type uploadDocument = InsuranceApplication & Document;

@Schema({
  timestamps: true,
})
export class InsuranceApplication {
  @Prop()
  correlationId: string;

  @Prop({
    required: true,
  })
  loanId: string;

  @IsNumber()
  @Prop({
    required: true,
  })
  applicationAge: number;

  @Prop({
    required: true,
  })
  partnerPriority: string;

  @Prop({
    required: true,
  })
  partnerCode: string;

  @Prop({
    required: true,
  })
  customerName: string;

  @Prop({
    required: true,
  })
  make: string;

  @Prop({
    required: true,
  })
  model: string;

  @Prop()
  makeOld: string;

  @Prop()
  modelOld: string;

  @Prop({
    required: true,
  })
  motorNumber: string;

  @Prop({
    required: true,
  })
  chassisNumber: string;

  @Prop({
    required: true,
  })
  idv: number;

  @Prop({
    required: true,
  })
  address: string;

  @Prop({
    required: true,
  })
  state: string;

  @Prop({
    required: true,
  })
  city: string;

  @Prop({
    required: true,
  })
  pincode: number;

  @Prop({
    required: true,
  })
  rtoCode: string;

  @Prop({
    required: true,
  })
  manufaturingYear: string;

  @Prop({
    required: true,
  })
  vehicleUsageType: string;

  @Prop({
    required: true,
  })
  panNumber: string;

  @Prop({
    required: true,
  })
  dob: string;

  @Prop({
    default: 'ICICI Lombard',
  })
  insurer: string;

  @Prop({
    default: 0,
  })
  isPolicyCompleted: number;

  @Prop()
  policyGenerationDate: Date;

  @Prop()
  priorityCode: number;

  @Prop()
  quotationPremium: number;

  @Prop()
  il_kyc_ref_no: string;

  @Prop()
  ckyc_number: string;

  @Prop()
  proposalNumber: string;

  @Prop()
  policyNo: string;

  @Prop()
  policyPdfUrl: string;

  @Prop({
    default: 0,
  })
  processErrorId: number;

  @Prop()
  processErrorMessage: string;

  @Prop()
  policyEndDate: string;

  @Prop()
  policyStartDate: string;

  @Prop()
  VehiclechasisPrice: string;

  @Prop({
    default: 0,
  })
  isUploaded: number;
}

export const insuranceApplicationSchema =
  SchemaFactory.createForClass(InsuranceApplication);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type KycLogsDocument = KycLogs & Document;

@Schema()
export class permanentAddress {
  address_line_1: string;
  address_line_2: string;
  address_line_3: string;
  pin_code: string;
  city: string;
  district: string;
  state: string;
}

@Schema()
export class alternateAddress {
  address_line_1: string;
  address_line_2: string;
  address_line_3: string;
  pin_code: string;
  city: string;
  district: string;
  state: string;
}

@Schema()
export class kycDetails {
  il_kyc_ref_no: string;
  certificate_type: string;
  certificate_number: string;
  first_name: string;
  last_name: string;
  full_name: string;
  gender: string;
  dob: string;
  mobile_number: string;
  ckyc_number: string;
  permanent_address: permanentAddress;
  alternate_address: alternateAddress;
  customer_type: string;
}

@Schema({
  timestamps: true,
})
export class KycLogs {
  @Prop()
  kyc_details: kycDetails;
  @Prop()
  message: string;
  @Prop()
  status: string;
  @Prop()
  statusMessage: string;
  @Prop()
  correlationId: string;
}

export const KycLogsSchema = SchemaFactory.createForClass(KycLogs);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type IdvResponseDocument = IdvResponse & Document;

@Schema({
  timestamps: true,
})
export class IdvResponse {
  @Prop()
  vehiclemodelstatus: string;

  @Prop()
  vehicleage: number;

  @Prop()
  idvdepreciationpercent: number;

  @Prop()
  minexshowroomdeviationlimit: number;

  @Prop()
  maxexshowroomdeviationlimit: number;

  @Prop()
  maximumprice: number;

  @Prop()
  minimumprice: number;

  @Prop()
  maxidv: number;

  @Prop()
  minidv: number;

  @Prop()
  vehiclesellingprice: number;

  @Prop()
  status: boolean;

  @Prop()
  statusmessage: string;

  @Prop()
  errorMessage: string;

  @Prop()
  correlationId: string;
}

export const IdvResponseSchema = SchemaFactory.createForClass(IdvResponse);

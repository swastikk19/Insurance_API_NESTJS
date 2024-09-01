import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type makeModelDocument = rtomaster & Document;

@Schema({
  timestamps: true,
})
export class rtomaster {
  @Prop()
  CountryCode: number;

  @Prop()
  ILStateCode: number;

  @Prop()
  ILState: string;

  @Prop()
  GSTStateID: number;

  @Prop()
  CityDistrictCode: number;

  @Prop()
  RTOLocationCode: number;

  @Prop()
  RTOLocationDesciption: string;

  @Prop()
  VehicleClassCode: number;

  @Prop()
  Status: string;

  @Prop()
  ActiveFlag: string;
}

export const rtoMasterSchema = SchemaFactory.createForClass(rtomaster);

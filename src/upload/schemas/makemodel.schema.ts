import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type makeModelDocument = makemodelmaster & Document;

@Schema({
  timestamps: true,
})
export class makemodelmaster {
  @Prop()
  VehicleClassCode: number;

  @Prop()
  VehicleSubClassDesc: string;

  @Prop()
  VehicleManufactureCode: number;

  @Prop()
  Manufacture: string;

  @Prop()
  VehicleModelCode: number;

  @Prop()
  VehicleModel: string;

  @Prop()
  CubicCapacity: number;

  @Prop()
  SeatingCapacity: number;

  @Prop()
  CarringCapacity: number;

  @Prop()
  VehicleModelStatus: string;

  @Prop()
  ActiveFlag: string;

  @Prop()
  ModelBuild: string;

  @Prop()
  CarCategory: string;

  @Prop()
  FuelType: string;

  @Prop()
  Segment: string;

  @Prop()
  GVW: number;

  @Prop()
  NumberOfWheels: number;

  @Prop()
  ExShowroomSlab: string;

  @Prop()
  VehicleSubClassCode: number;
}

export const makeModelMasterSchema =
  SchemaFactory.createForClass(makemodelmaster);

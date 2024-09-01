import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type insurerMasterDocument = insurerMaster & Document;

@Schema({
  timestamps: true,
})
export class insurerMaster {
  @Prop({
    required: true,
  })
  insurerName: string;

  @Prop({
    required: true,
  })
  addedBy: string;

  @Prop({
    required: true,
    default: 1,
  })
  isActive: number;

  @Prop({
    default: 0,
  })
  isDeleted: number;

  @Prop({})
  deletedBy: string;
}

export const insurerMasterSchema = SchemaFactory.createForClass(insurerMaster);

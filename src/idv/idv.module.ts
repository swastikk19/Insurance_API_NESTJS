import { Module } from '@nestjs/common';
import { IdvController } from './idv.controller';
import { IdvService } from './idv.service';
import { makeModelMasterSchema } from 'src/upload/schemas/makemodel.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { insuranceApplicationSchema } from 'src/upload/schemas/upload.schema';
import { rtoMasterSchema } from 'src/upload/schemas/rtomasters.schema';
import { IdvRequestSchema } from './schema/idv-req.schema';
import { IdvResponseSchema } from './schema/idv-res.schema';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      {
        name: 'makemodelmaster',
        schema: makeModelMasterSchema,
      },
      {
        name: 'InsuranceApplication',
        schema: insuranceApplicationSchema,
      },
      {
        name: 'rtomaster',
        schema: rtoMasterSchema,
      },
      {
        name: 'IdvRequest',
        schema: IdvRequestSchema,
      },
      {
        name: 'IdvResponse',
        schema: IdvResponseSchema,
      },
    ]),
  ],
  controllers: [IdvController],
  providers: [IdvService],
  exports: [IdvService],
})
export class IdvModule {}

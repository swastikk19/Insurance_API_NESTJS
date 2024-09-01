import { Module, ValidationPipe } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { MongooseModule } from '@nestjs/mongoose';
import { insuranceApplicationSchema } from './schemas/upload.schema';
import { makeModelMasterSchema } from './schemas/makemodel.schema';
import { rtoMasterSchema } from './schemas/rtomasters.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'InsuranceApplication',
        schema: insuranceApplicationSchema,
      },
      {
        name: 'makemodelmaster',
        schema: makeModelMasterSchema,
      },
      {
        name: 'rtomaster',
        schema: rtoMasterSchema,
      },
    ]),
  ],
  controllers: [UploadController],
  providers: [UploadService, ValidationPipe],
  exports: [UploadService],
})
export class UploadModule {}

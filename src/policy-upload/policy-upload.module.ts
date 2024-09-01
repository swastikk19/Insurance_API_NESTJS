import { Module } from '@nestjs/common';
import { PolicyUploadController } from './policy-upload.controller';
import { PolicyUploadService } from './policy-upload.service';
import { MongooseModule } from '@nestjs/mongoose';
import { policyUploadSchema } from './schemas/policy-upload.schema';
import { insuranceApplicationSchema } from 'src/upload/schemas/upload.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'PolicyUpload',
        schema: policyUploadSchema,
      },
      {
        name: 'InsuranceApplication',
        schema: insuranceApplicationSchema,
      },
    ]),
  ],
  controllers: [PolicyUploadController],
  providers: [PolicyUploadService],
})
export class PolicyUploadModule {}

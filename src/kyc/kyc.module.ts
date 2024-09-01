import { Module } from '@nestjs/common';
import { KycController } from './kyc.controller';
import { KycService } from './kyc.service';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { KycFailedSchema } from './schema/kycFailed.schema';
import { KycRequestSchema } from './schema/kyc-req.schema';
import { insuranceApplicationSchema } from 'src/upload/schemas/upload.schema';
import { KycLogsSchema } from './schema/kyc.schema';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      {
        name: 'KycLogs',
        schema: KycLogsSchema,
      },
      {
        name: 'KycFailed',
        schema: KycFailedSchema,
      },
      {
        name: 'KycRequest',
        schema: KycRequestSchema,
      },
      {
        name: 'InsuranceApplication',
        schema: insuranceApplicationSchema,
      },
    ]),
  ],
  controllers: [KycController],
  providers: [KycService],
  exports: [MongooseModule, KycService],
})
export class KycModule {}

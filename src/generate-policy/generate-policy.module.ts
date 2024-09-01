import { Module } from '@nestjs/common';
import { GeneratePolicyController } from './generate-policy.controller';
import { GeneratePolicyService } from './generate-policy.service';
import { MongooseModule } from '@nestjs/mongoose';
import { GeneratePolicySchema } from './schema/generatePolicy-req.schema';
import { HttpModule } from '@nestjs/axios';
import { insuranceApplicationSchema } from 'src/upload/schemas/upload.schema';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      {
        name: 'GeneratePolicy',
        schema: GeneratePolicySchema,
      },
      {
        name: 'InsuranceApplication',
        schema: insuranceApplicationSchema,
      },
    ]),
  ],
  controllers: [GeneratePolicyController],
  providers: [GeneratePolicyService],
  exports: [GeneratePolicyService],
})
export class GeneratePolicyModule {}

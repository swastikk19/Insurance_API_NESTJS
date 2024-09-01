import { Module } from '@nestjs/common';
import { AllInsuranceController } from './all-insurance.controller';
import { AllInsuranceService } from './all-insurance.service';
import { insuranceApplicationSchema } from 'src/upload/schemas/upload.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'InsuranceApplication',
        schema: insuranceApplicationSchema,
      },
    ]),
  ],
  controllers: [AllInsuranceController],
  providers: [AllInsuranceService],
})
export class AllInsuranceModule {}

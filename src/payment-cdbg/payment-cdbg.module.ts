import { Module } from '@nestjs/common';
import { PaymentCdbgController } from './payment-cdbg.controller';
import { PaymentCdbgService } from './payment-cdbg.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentRequestSchema } from './schema/payment-req.schema';
import { PaymentResponseSchema } from './schema/payment-res.schema';
import { HttpModule } from '@nestjs/axios';
import { insuranceApplicationSchema } from 'src/upload/schemas/upload.schema';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: 'PaymentRequest', schema: PaymentRequestSchema },
      { name: 'PaymentResponse', schema: PaymentResponseSchema },
      {
        name: 'InsuranceApplication',
        schema: insuranceApplicationSchema,
      },
    ]),
  ],
  controllers: [PaymentCdbgController],
  providers: [PaymentCdbgService],
  exports: [PaymentCdbgService],
})
export class PaymentCdbgModule {}

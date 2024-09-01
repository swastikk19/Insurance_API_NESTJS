import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UploadModule } from './upload/upload.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PolicyUploadModule } from './policy-upload/policy-upload.module';
import { IciciLombardModule } from './icici-lombard/icici-lombard.module';
import { QuoteModule } from './quote/quote.module';
import { APP_PIPE } from '@nestjs/core';
import { AllInsuranceModule } from './all-insurance/all-insurance.module';
import { InsurermasterModule } from './insurermaster/insurermaster.module';
import { KycModule } from './kyc/kyc.module';
import { ProposalModule } from './proposal/proposal.module';
import { PaymentCdbgModule } from './payment-cdbg/payment-cdbg.module';
import { GeneratePolicyModule } from './generate-policy/generate-policy.module';
import { IdvModule } from './idv/idv.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        '.env.main',
        '.env.quote',
        '.env.kyc',
        '.env.proposal',
        '.env.payment',
        '.env.gpolicy',
        '.env.idv',
      ],
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DB_URI),
    UploadModule,
    PolicyUploadModule,
    IciciLombardModule,
    QuoteModule,
    AllInsuranceModule,
    InsurermasterModule,
    KycModule,
    ProposalModule,
    PaymentCdbgModule,
    GeneratePolicyModule,
    IdvModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}

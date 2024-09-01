import { Module } from '@nestjs/common';
import { IciciLombardController } from './icici-lombard.controller';
import { IciciLombardService } from './icici-lombard.service';
import { HttpModule } from '@nestjs/axios';
import { QuoteModule } from 'src/quote/quote.module';
import { KycModule } from 'src/kyc/kyc.module';
import { ProposalModule } from 'src/proposal/proposal.module';
import { PaymentCdbgModule } from 'src/payment-cdbg/payment-cdbg.module';
import { GeneratePolicyModule } from 'src/generate-policy/generate-policy.module';
import { UploadModule } from 'src/upload/upload.module';
import { IdvModule } from 'src/idv/idv.module';

@Module({
  imports: [
    HttpModule,
    QuoteModule,
    KycModule,
    ProposalModule,
    PaymentCdbgModule,
    GeneratePolicyModule,
    UploadModule,
    IdvModule,
  ],
  controllers: [IciciLombardController],
  providers: [IciciLombardService],
})
export class IciciLombardModule {}

import { Module } from '@nestjs/common';
import { QuoteController } from './quote.controller';
import { QuoteService } from './quote.service';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { InsuranceQuoteSchema } from 'src/quote/schemas/quotation.schema';
import { QuoteRequestSchema } from './schemas/quotation-req.schema';
import { insuranceApplicationSchema } from 'src/upload/schemas/upload.schema';
import { makeModelMasterSchema } from 'src/upload/schemas/makemodel.schema';
import { rtoMasterSchema } from 'src/upload/schemas/rtomasters.schema';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      {
        name: 'InsuranceQuote',
        schema: InsuranceQuoteSchema,
      },
      {
        name: 'InsuranceQuoteRequest',
        schema: QuoteRequestSchema,
      },
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
  controllers: [QuoteController],
  providers: [QuoteService],
  exports: [MongooseModule, QuoteService],
})
export class QuoteModule {}

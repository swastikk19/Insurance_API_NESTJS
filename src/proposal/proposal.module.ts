import { Module } from '@nestjs/common';
import { ProposalController } from './proposal.controller';
import { ProposalService } from './proposal.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProposalRequestSchema } from './schema/proposal-req.schema';
import { HttpModule } from '@nestjs/axios';
import { ProposalResponseSchema } from './schema/proposal-res.schema';
import { insuranceApplicationSchema } from 'src/upload/schemas/upload.schema';
import { makeModelMasterSchema } from 'src/upload/schemas/makemodel.schema';
import { rtoMasterSchema } from 'src/upload/schemas/rtomasters.schema';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      {
        name: 'ProposalRequest',
        schema: ProposalRequestSchema,
      },
      {
        name: 'ProposalResponse',
        schema: ProposalResponseSchema,
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
  controllers: [ProposalController],
  providers: [ProposalService],
  exports: [ProposalService],
})
export class ProposalModule {}

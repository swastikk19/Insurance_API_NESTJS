import { Module } from '@nestjs/common';
import { InsurermasterController } from './insurermaster.controller';
import { InsurermasterService } from './insurermaster.service';
import { MongooseModule } from '@nestjs/mongoose';
import { insurerMasterSchema } from './schemas/insurermaster.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'insurerMaster',
        schema: insurerMasterSchema,
      },
    ]),
  ],
  controllers: [InsurermasterController],
  providers: [InsurermasterService],
})
export class InsurermasterModule {}

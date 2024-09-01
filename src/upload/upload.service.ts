import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UploadService {
  constructor(
    @InjectModel('InsuranceApplication')
    private insuranceApplicationSchema: any,
    @InjectModel('makemodelmaster')
    private makeModelMasterSchema: any,
  ) {}

  async excelUploadService(validatedData: any) {
    try {
      if (!Array.isArray(validatedData)) {
        throw new Error('Excel Data should be in array.');
      }

      const existingRecords = await this.insuranceApplicationSchema.find({
        loanId: {
          $in: validatedData.map((entry) => entry.loanId),
        },
        isPolicyCompleted: 0,
      });

      if (existingRecords.length > 0) {
        const duplicateLoanId = existingRecords.map((data: any) => data.loanId);
        throw new ConflictException(
          `Insurance already exists for LoanId's: ${duplicateLoanId}`,
        );
      } else {
        return await this.insuranceApplicationSchema.insertMany(validatedData);
      }
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async getRecordsService() {
    try {
      return await this.insuranceApplicationSchema
        .find({ isPolicyCompleted: 0 })
        .sort({ priorityCode: 1, createdAt: -1 });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async getOneRecordService(loanId: any) {
    try {
      return await this.insuranceApplicationSchema.findOne({
        loanId: loanId,
        isPolicyCompleted: 0,
      });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async updateRecordService(loanId: string, updateRecordInsuranceDTO: any) {
    try {
      const checkRecord = await this.insuranceApplicationSchema.find({
        loanId: loanId,
        isPolicyCompleted: 0,
      });

      if (checkRecord.length > 0) {
        const data = await this.insuranceApplicationSchema.findOneAndUpdate(
          { loanId: loanId, isPolicyCompleted: 0 },
          {
            $set: {
              makeOld: checkRecord[0].make,
              modelOld: checkRecord[0].model,
              make: updateRecordInsuranceDTO.make,
              model: updateRecordInsuranceDTO.model,
              insurer: updateRecordInsuranceDTO.insurer,
            },
          },
          {
            returnDocument: 'after',
          },
        );
        return data;
      } else {
        throw new NotFoundException({
          message: `${loanId} not found!`,
        });
      }
    } catch (err) {
      throw new Error(err.message);
    }
  }
}

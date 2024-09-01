import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AllInsuranceService {
  constructor(
    @InjectModel('InsuranceApplication') private bulkUploadSchema: any,
  ) {}
  async getRecords() {
    try {
      const record = await this.bulkUploadSchema
        .find({ isPolicyCompleted: 1 })
        .sort({ policyGenerationDate: -1 })
        .exec();
      return record;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async updatePolicyService(validateData: any, id: string) {
    try {
      const updateRecords = await this.bulkUploadSchema.updateOne(
        { _id: id },
        {
          $set: {
            policyNo: validateData.policyNo,
          },
        },
      );
      if (updateRecords) {
        return { flagId: 1, message: 'Data updated successfully!' };
      } else {
        return { flagId: 0, message: 'Not updated!' };
      }
    } catch (err) {
      return { flagId: 0, message: err.message };
    }
  }
}

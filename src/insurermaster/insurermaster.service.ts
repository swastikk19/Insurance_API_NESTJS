import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class InsurermasterService {
  constructor(
    @InjectModel('insurerMaster') private readonly insurerMasterSchema: any,
  ) {}

  async addDataService(insurerMasterDTO: any) {
    try {
      const existingInsurer = await this.insurerMasterSchema
        .findOne({
          insurerName: insurerMasterDTO.insurerName,
          isDeleted: 0,
        })
        .exec();

      if (existingInsurer) {
        throw new ConflictException(
          `${insurerMasterDTO.insurerName} already exists!`,
        );
      }
      const data = new this.insurerMasterSchema(insurerMasterDTO);
      return await data.save();
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async getAllService() {
    try {
      const data = await this.insurerMasterSchema.find({
        isDeleted: 0,
      });
      return data;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async deleteRecordService(id: string, deletedBy: string) {
    try {
      const checkRecord = await this.insurerMasterSchema.find({
        _id: id,
        isDeleted: 0,
        isActive: 1,
      });

      if (checkRecord.length > 0) {
        const record = await this.insurerMasterSchema.findOneAndUpdate(
          { _id: id },
          {
            $set: {
              isDeleted: 1,
              deletedBy: deletedBy,
            },
          },
        );
        return record;
      } else {
        throw new Error(`${id} does not exist!`);
      }
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async inActiveMasterService(id: string) {
    try {
      const checkRecord = await this.insurerMasterSchema.find({
        _id: id,
        isDeleted: 0,
        isActive: 1,
      });

      if (checkRecord.length > 0) {
        const record = await this.insurerMasterSchema.findOneAndUpdate(
          { _id: id },
          {
            $set: {
              isActive: 0,
            },
          },
        );
        return record;
      } else {
        throw new Error(`${id} does not exists!`);
      }
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async bindDropdownService() {
    try {
      const data = await this.insurerMasterSchema.find({
        isDeleted: 0,
        isActive: 1,
      });
      return data;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async activeMasterService(id: string) {
    try {
      const checkRecord = await this.insurerMasterSchema.find({
        _id: id,
        isDeleted: 0,
      });
      if (checkRecord.length > 0) {
        const data = await this.insurerMasterSchema.findOneAndUpdate(
          { _id: id },
          {
            $set: {
              isActive: 1,
            },
          },
        );

        return data;
      } else {
        throw new Error(`${id} does not exist!`);
      }
    } catch (err) {
      throw new Error(err.message);
    }
  }
}

import { HttpStatus, Injectable, Res } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PolicyUploadDTO } from './dto/policy-upload.dto';
import { Response } from 'express';
import { Model } from 'mongoose';
import { ExcelUploadDTO } from 'src/upload/dto/upload.dto';

@Injectable()
export class PolicyUploadService {
  constructor(
    @InjectModel('PolicyUpload')
    private policyUploadSchema: Model<PolicyUploadDTO>,
    @InjectModel('InsuranceApplication')
    private bulkUploadSchema: Model<ExcelUploadDTO>,
  ) {}

  async PolicyUploadExcelService(
    file: Express.Multer.File,
    policyUploadDTORequest: PolicyUploadDTO,
    @Res() res: Response,
  ) {
    const newPath = file.path.replace('D:', process.env.test_drive);
    const createdPolicy = new this.policyUploadSchema({
      originalname: file.originalname,
      filename: file.filename,
      path: newPath,
      size: file.size,
      loanId: policyUploadDTORequest.loanId,
    });

    const dateStart = new Date();
    const formattedDateStart = dateStart.toISOString().slice(0, 10);

    const dateEnd = new Date();
    dateEnd.setFullYear(dateEnd.getFullYear() + 1);
    dateEnd.setDate(dateEnd.getDate() - 1);
    const formattedDateEnd = dateEnd.toISOString().slice(0, 10);
    try {
      await this.bulkUploadSchema.updateOne(
        { loanId: policyUploadDTORequest.loanId, isPolicyCompleted: 0 },
        {
          $set: {
            isPolicyCompleted: 1,
            isUploaded: 1,
            insurer: policyUploadDTORequest.insurer,
            policyStartDate: formattedDateStart,
            policyEndDate: formattedDateEnd,
            policyPdfUrl: newPath,
          },
          $currentDate: { policyGenerationDate: true },
        },
      );
      return createdPolicy.save();
    } catch (err) {
      return res.status(HttpStatus.BAD_GATEWAY).json({
        success: false,
        message: 'Error! While Uploading Policy',
      });
    }
  }

  async GetAllPoliciesService() {
    try {
      return await this.policyUploadSchema.find();
    } catch (err) {
      throw new Error(err.message);
    }
  }
}

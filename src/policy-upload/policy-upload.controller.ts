import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { PolicyUploadService } from './policy-upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/config/multer.config';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { PolicyUploadDTO } from './dto/policy-upload.dto';

@Controller('policy-upload')
@ApiTags('PolicyUpload')
export class PolicyUploadController {
  constructor(private readonly policyUploadService: PolicyUploadService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async uploadPolicy(
    @UploadedFile() file: Express.Multer.File,
    @Body() PolicyUploadDTORequest: PolicyUploadDTO,
    @Res() res: Response,
  ) {
    try {
      if (!file) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'File is required',
        });
      }
      const result = await this.policyUploadService.PolicyUploadExcelService(
        file,
        PolicyUploadDTORequest,
        res,
      );
      if (result) {
        return res.status(HttpStatus.OK).json({
          success: true,
          message: 'File Uploaded Successfully',
          data: {
            originalname: file.originalname,
            filename: file.filename,
            path: file.path.replace('D:', process.env.test_drive),
            size: file.size,
          },
        });
      } else {
        return res.status(HttpStatus.BAD_GATEWAY).json({
          success: false,
          message: 'File was not uploaded',
        });
      }
    } catch (err) {
      throw new Error(err.message);
    }
  }

  @Get('getPolicy')
  async getPolicies(@Res() res: Response) {
    try {
      const result = await this.policyUploadService.GetAllPoliciesService();
      if (result) {
        return res.status(HttpStatus.OK).json({
          status: true,
          message: 'Record Found',
          data: result,
        });
      } else {
        return res.status(HttpStatus.OK).json({
          status: false,
          message: 'Record not found',
        });
      }
    } catch (err) {
      throw new Error(err.message);
    }
  }
}

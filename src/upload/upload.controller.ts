import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  HttpStatus,
  Res,
  HttpException,
  Put,
  BadRequestException,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { Response } from 'express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  excelUploadArraySchema,
  excelUploadDTOArray,
} from './dto/upload-zod.dto';
import { z } from 'zod';
import {
  updateRecordInsurance,
  updateRecordInsuranceDTO,
} from './dto/update-zod.dto';

@Controller('upload')
@ApiTags('BulkUpload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('uploadExcel')
  @ApiOperation({ summary: 'Bulk Upload Excel' })
  async uploadExcel(@Body() excelUploadDTORequest: any, @Res() res: Response) {
    try {
      const validatedData: excelUploadDTOArray = excelUploadArraySchema.parse(
        excelUploadDTORequest,
      );

      const record = await this.uploadService.excelUploadService(validatedData);
      if (record) {
        return res.status(HttpStatus.CREATED).json({
          success: true,
          message: 'The record has been successfully created.',
          data: record,
        });
      } else {
        return res.status(HttpStatus.BAD_REQUEST).json({
          status: false,
          message: 'Unable to upload data',
          data: [],
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'Validation failed',
          errors: error.errors,
        });
      }
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('getExcel')
  async getExcel(@Res() res: Response) {
    try {
      const records = await this.uploadService.getRecordsService();
      if (records) {
        return res.status(HttpStatus.OK).json({
          success: true,
          message: 'Record Found!',
          data: records,
        });
      } else {
        return res.status(HttpStatus.OK).json({
          success: false,
          message: 'Record Not Found!',
          data: [],
        });
      }
    } catch (err) {
      throw new Error(err.message);
    }
  }

  @Get('getExcel/:loanId')
  async getRecord(@Param('loanId') loanId: string, @Res() res: Response) {
    try {
      const record = await this.uploadService.getOneRecordService(loanId);
      if (record) {
        return res.status(HttpStatus.OK).json({
          success: true,
          message: 'Record Found!',
          data: record,
        });
      } else {
        return res.status(HttpStatus.OK).json({
          success: false,
          message: `${loanId} Not Found!`,
          data: [],
        });
      }
    } catch (err) {
      throw new Error(err.message);
    }
  }

  @Put('update/:loanId')
  async updateMake(
    @Param('loanId') loanId: string,
    @Body() updateRecordInsuranceDTORequest: updateRecordInsuranceDTO,
    @Res() res: Response,
  ) {
    try {
      if (!loanId) {
        throw new BadRequestException('Please input loanId');
      }
      const updateRecordInsuranceDTO: updateRecordInsuranceDTO =
        updateRecordInsurance.parse(updateRecordInsuranceDTORequest);

      const record = await this.uploadService.updateRecordService(
        loanId,
        updateRecordInsuranceDTO,
      );

      if (record) {
        return res.status(HttpStatus.OK).json({
          success: true,
          make: record.make,
          model: record.model,
          message: 'Data updated successfully',
        });
      } else {
        return res.status(HttpStatus.BAD_GATEWAY).json({
          success: false,
          message: 'Unable to update the data!',
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'Validation failed',
          errors: error.errors,
        });
      }
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}

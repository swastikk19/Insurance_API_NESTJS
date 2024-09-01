import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Put,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AllInsuranceService } from './all-insurance.service';
import { Response } from 'express';
import { allInsurance, allInsuranceDTO } from './dto/allInsurance.dto';
import { z } from 'zod';

@Controller('all-insurance')
@ApiTags('All Insurances')
export class AllInsuranceController {
  constructor(private readonly allInsuranceService: AllInsuranceService) {}

  @Get('getAll')
  async getAllRecords(@Res() res: Response) {
    try {
      const records = await this.allInsuranceService.getRecords();
      if (records.length > 0) {
        return res.status(HttpStatus.OK).json({
          success: true,
          message: 'Data Found!',
          data: records,
        });
      } else {
        return res.status(HttpStatus.OK).json({
          success: false,
          message: 'Data Not Found!',
          data: records,
        });
      }
    } catch (err) {
      throw new Error(err.message);
    }
  }

  @Put('policyNumber/:correlationId')
  async updatePolicyNumber(
    @Res() res: Response,
    @Param('correlationId') id: string,
    @Body() allInsurnaceRequest: allInsuranceDTO,
  ) {
    try {
      const validateData = allInsurance.parse(allInsurnaceRequest);
      const updateRecord = await this.allInsuranceService.updatePolicyService(
        validateData,
        id,
      );

      if (updateRecord.flagId == 1) {
        return res.status(HttpStatus.OK).json({
          success: true,
          message: updateRecord.message,
        });
      } else {
        return res.status(HttpStatus.OK).json({
          success: false,
          message: updateRecord.message,
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
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: error.message,
      });
    }
  }
}

import { Response } from 'express';
import { InsurermasterService } from './insurermaster.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { insurerMaster, insurerMasterDTO } from './dto/insurermaster.dto';
import { z } from 'zod';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Insurer Master')
@Controller('insurermaster')
export class InsurermasterController {
  constructor(private readonly insurerMasterService: InsurermasterService) {}

  @Post('addMaster')
  async addRecord(
    @Body() insurerMasterDtoRequest: insurerMasterDTO,
    @Res() res: Response,
  ) {
    try {
      const insurerMasterDTO: insurerMasterDTO = insurerMaster.parse(
        insurerMasterDtoRequest,
      );
      const result =
        await this.insurerMasterService.addDataService(insurerMasterDTO);
      if (result) {
        return res.status(HttpStatus.CREATED).json({
          success: true,
          message: 'Data updated successfully!',
          data: result,
        });
      } else {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'Unable to update data!',
          data: {},
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

  @Get('getMaster')
  async getRecords(@Res() res: Response) {
    try {
      const records = await this.insurerMasterService.getAllService();

      if (records.length > 0) {
        return res.status(HttpStatus.OK).json({
          success: true,
          message: 'Data Found!',
          data: records,
        });
      } else {
        return res.status(HttpStatus.OK).json({
          success: true,
          message: 'No Data Found!',
          data: [],
        });
      }
    } catch (err) {
      throw new Error(err.message);
    }
  }

  @Get('bindDropdown')
  async bindDropdown(@Res() res: Response) {
    try {
      const result = await this.insurerMasterService.bindDropdownService();
      if (result) {
        return res.status(HttpStatus.OK).json({
          success: true,
          message: 'Data Found!',
          data: result,
        });
      } else {
        return res.status(HttpStatus.OK).json({
          success: false,
          message: 'Data not found!',
          data: [],
        });
      }
    } catch (err) {
      throw new Error(err.message);
    }
  }

  @Delete('deleteMaster/:id')
  async deleteRecord(
    @Param('id') id: string,
    @Body('deletedBy') deletedBy: string,
    @Res() res: Response,
  ) {
    try {
      const record = await this.insurerMasterService.deleteRecordService(
        id,
        deletedBy,
      );
      if (record) {
        return res.status(HttpStatus.OK).json({
          success: true,
          message: `${id} deleted successfully`,
        });
      } else {
        return res.status(HttpStatus.BAD_GATEWAY).json({
          success: false,
          message: 'Unable to delete!',
        });
      }
    } catch (err) {
      throw new Error(err.message);
    }
  }

  @Put('inActiveMaster/:id')
  async inActiveMaster(@Param('id') id: string, @Res() res: Response) {
    try {
      const record = await this.insurerMasterService.inActiveMasterService(id);
      if (record) {
        return res.status(HttpStatus.OK).json({
          sucess: true,
          message: `${id} deactivated successfully`,
        });
      } else {
        return res.status(HttpStatus.BAD_GATEWAY).json({
          success: false,
          message: `Unable to deactivate!`,
        });
      }
    } catch (err) {
      throw new Error(err.message);
    }
  }

  @Put('activeMaster/:id')
  async activeMaster(@Param('id') id: string, @Res() res: Response) {
    try {
      const result = await this.insurerMasterService.activeMasterService(id);

      if (result) {
        return res.status(HttpStatus.OK).json({
          success: true,
          message: 'Data updated successfully',
          data: result,
        });
      } else {
        return res.status(HttpStatus.OK).json({
          success: false,
          message: 'Unable to update!',
        });
      }
    } catch (err) {
      throw new Error(err.message);
    }
  }
}

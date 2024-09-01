import { z } from 'zod';
import { kycOvd, kycOvdDTO } from './dto/kycovd-zod.dto';
import { KycService } from './kyc.service';
import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { ovdMulterOptions } from './config/ovdMulter.config';
import { ApiTags } from '@nestjs/swagger';

@Controller('kyc')
export class KycController {
  constructor(private readonly kycService: KycService) {}

  @Post('initiateKyc/ovd')
  @ApiTags('KYC using OVD')
  @UseInterceptors(AnyFilesInterceptor(ovdMulterOptions))
  async kycUsingDocument(
    @Body() kycOvdDTORequest: kycOvdDTO,
    @Res() res: Response,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    try {
      const kycOvdValidator = kycOvd.parse(kycOvdDTORequest);
      if (!files || files.length !== 2) {
        throw new Error('Two files are required!');
      }
      const poiDocument = files.find(
        (file) => file.fieldname === 'poiDocument',
      );
      const poaDocument = files.find(
        (file) => file.fieldname === 'poaDocument',
      );
      if (!poiDocument || !poaDocument) {
        throw new Error('Both document1 and document2 are required!');
      }

      const kycAuth = await this.kycService.authKycService(res);
      const kycResponse = await this.kycService.kycUsingOvd(
        kycAuth.access_token,
        kycOvdValidator,
        poiDocument,
        poaDocument,
      );

      if (kycResponse.flagId == 1) {
        return res.status(HttpStatus.OK).json({
          success: true,
          il_kyc_ref_no: kycResponse.il_kyc_ref_no,
          correlationId: kycResponse.correlationId,
        });
      } else {
        return res.status(HttpStatus.OK).json({
          success: false,
          message: kycResponse.message,
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

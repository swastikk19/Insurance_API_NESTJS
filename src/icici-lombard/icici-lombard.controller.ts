import {
  GeneratePolicyDTO,
  GeneratePolicyRequest,
} from './../generate-policy/dto/generatePolicy-zod.dto';
import { QuoteService } from './../quote/quote.service';
import { KycService } from './../kyc/kyc.service';
import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import {
  quotationMasterDTO,
  quotationMaster,
} from 'src/quote/dto/quote-zod.dto';
import { z } from 'zod';
import { kyc, kycDTO } from 'src/kyc/dto/kyc-zod.dto';
import { ApiTags } from '@nestjs/swagger';
import { ProposalService } from 'src/proposal/proposal.service';
import {
  ProposalRequest,
  ProposalRequestDto,
} from 'src/proposal/dto/proposal-zod.dto';
import { PaymentCdbgService } from 'src/payment-cdbg/payment-cdbg.service';
import {
  PaymentRequest,
  PaymentRequestDTO,
} from 'src/payment-cdbg/dto/payment-zod.dto';
import { GeneratePolicyService } from 'src/generate-policy/generate-policy.service';
import { UploadService } from 'src/upload/upload.service';
import { IdvService } from 'src/idv/idv.service';
import { idvRequest, idvRequestDTO } from 'src/idv/dto/idvreq-zod.dto';

@Controller('icici-lombard')
export class IciciLombardController {
  constructor(
    private readonly insuranceApplicationService: UploadService,
    private readonly quoteService: QuoteService,
    private readonly kycService: KycService,
    private readonly proposalService: ProposalService,
    private readonly paymentCdbgService: PaymentCdbgService,
    private readonly generatePolicyService: GeneratePolicyService,
    private readonly idvService: IdvService,
  ) {}

  @ApiTags('Get IDV API')
  @Post('generatePolicy/getIDV/:LoanId')
  async getIDV(
    @Param('LoanId') loanId: string,
    @Res() res: Response,
    @Body() idvDTORequest: idvRequestDTO,
    @Query() query: any,
  ) {
    try {
      if (!loanId) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'LoanId is required!',
        });
      }

      if (!query.insurer) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'insurer is required!',
        });
      }

      const validateData: idvRequestDTO = idvRequest.parse(idvDTORequest);
      const loanIdRecord =
        await this.insuranceApplicationService.getOneRecordService(loanId);

      const rtoLocDesc = `${loanIdRecord.state}-${loanIdRecord.city}`;
      const rtoRecords = await this.idvService.getRtoDetails(
        rtoLocDesc,
        loanId,
      );

      if (rtoRecords.flagId == 0) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'Please enter correct State and City!',
        });
      }

      const vehicleData = await this.idvService.getVehicleDetails(loanIdRecord);
      if (vehicleData.flagId == 0) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: vehicleData.message,
        });
      }

      const idvAuth = await this.idvService.authIDVService(
        res,
        loanId,
        query.insurer,
      );

      if (idvAuth) {
        const idvDetails = await this.idvService.getIdvDetails(
          idvAuth.access_token,
          validateData,
          rtoRecords,
          vehicleData,
          loanIdRecord,
        );

        if (idvDetails.flagId == 1) {
          return res.status(HttpStatus.OK).json({
            success: true,
            message: 'Price fetched successfully!',
            data: idvDetails.data,
          });
        } else {
          return res.status(HttpStatus.BAD_REQUEST).json({
            success: false,
            message: idvDetails.message,
          });
        }
      } else {
        return {
          success: false,
          message: 'User Unauthorized for IDV!',
        };
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'Validation failed',
          errors: error.errors,
        });
      }
      throw new Error(`${error.message}: Unable to generate IDV!`);
    }
  }

  @ApiTags('Get Quotation API')
  @Post('generatePolicy/getQuote/:LoanId')
  async getQuotation(
    @Param('LoanId') loanId: string,
    @Body() QuotationDTORequest: quotationMasterDTO,
    @Res() res: Response,
    @Query() query: any,
  ) {
    try {
      if (!loanId) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'LoanId is required!',
        });
      }

      if (!query.insurer) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'LoanId is required!',
        });
      }

      const loanIdRecords =
        await this.insuranceApplicationService.getOneRecordService(loanId);

      const rtoLocDesc = `${loanIdRecords.state}-${loanIdRecords.city}`;
      const rtoRecords =
        await this.quoteService.getRtoLocationCodeService(rtoLocDesc);

      if (rtoRecords.flagId == 1) {
        const quotationMasterDTO: quotationMasterDTO =
          quotationMaster.parse(QuotationDTORequest);
        const quoteAuth = await this.quoteService.authQuoteService(
          res,
          loanId,
          query.insurer,
        );

        if (quoteAuth) {
          const quotation = await this.quoteService.generateQuoteService(
            quoteAuth.access_token,
            quotationMasterDTO,
            loanId,
            loanIdRecords,
            rtoRecords,
          );

          if (quotation.flagId == 1) {
            return res.status(HttpStatus.OK).json({
              success: true,
              message: 'Quotation Generated!',
              data: {
                finalPremium: quotation.premiumDetails,
                correlationId: quotation.correlationId,
              },
            });
          } else {
            return res.status(HttpStatus.BAD_GATEWAY).json({
              success: false,
              message: quotation.data.message || quotation.data.Message,
              description: 'Erorr! While Quote Generation',
            });
          }
        } else {
          return res.status(HttpStatus.BAD_REQUEST).json({
            success: false,
            message: 'Token Not Found For Quotation!',
          });
        }
      } else {
        throw new Error('Please enter correct State and City!');
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

  @ApiTags('Initiate KYC API')
  @Post('generatePolicy/initiateKyc')
  async initiateKYC(@Body() kycDTOReqest: kycDTO, @Res() res: Response) {
    try {
      const validateData: kycDTO = kyc.parse(kycDTOReqest);
      const kycAuth = await this.kycService.authKycService(res);
      const initiateKyc = await this.kycService.initiateKycService(
        kycAuth.access_token,
        validateData,
      );

      if (initiateKyc.flagId == 1) {
        return res.status(HttpStatus.OK).json({
          success: true,
          message: 'Data updated successfully!',
          data: {
            il_kyc_ref_no: initiateKyc.il_kyc_ref_no,
            ckyc_number: initiateKyc.ckyc_number,
            correlationId: initiateKyc.correlationId,
          },
        });
      } else {
        return res.status(HttpStatus.OK).json({
          success: false,
          description: 'Unable to generate CKYC Number',
          message: initiateKyc.data.message,
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

  @ApiTags('Get Proposal API')
  @Post('generatePolicy/proposal/:LoanId')
  async generatePorposal(
    @Body() proposalDTORequest: ProposalRequestDto,
    @Res() res: Response,
    @Param('LoanId') loanId: string,
  ) {
    try {
      if (!loanId) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'LoanId is required!',
        });
      }

      const validateData: ProposalRequestDto =
        ProposalRequest.parse(proposalDTORequest);
      const authProposal = await this.proposalService.authProposalService(res);

      if (!authProposal) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'User unauthorized for Auth!',
        });
      }
      const proposalRes = await this.proposalService.getProposalService(
        validateData,
        authProposal.access_token,
        loanId,
      );

      if (proposalRes) {
        if (proposalRes.flagId == 1) {
          return res.status(HttpStatus.OK).json({
            success: true,
            message: 'Data updated successfully!',
            data: {
              proposalNumber: proposalRes.proposalNumber,
              correlationId: proposalRes.correlationId,
            },
          });
        } else {
          return res.status(HttpStatus.OK).json({
            success: false,
            message: proposalRes.message,
          });
        }
      } else {
        return res.status(HttpStatus.OK).json({
          success: false,
          message: proposalRes.message,
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

  @ApiTags('Payment API')
  @Post('generatePolicy/payment')
  async proceedPayment(
    @Res() res: Response,
    @Body() paymentDTORequest: PaymentRequestDTO,
  ) {
    try {
      const validateData: PaymentRequestDTO =
        PaymentRequest.parse(paymentDTORequest);
      const access_token =
        await this.paymentCdbgService.authPaymentService(res);

      const paymentRes = await this.paymentCdbgService.proceedPaymentService(
        access_token,
        validateData,
      );

      if (paymentRes) {
        if (paymentRes.flagId == 1 && paymentRes.policyNo != null) {
          return res.status(HttpStatus.OK).json({
            success: true,
            message: 'Data updated successfully!',
            policyNo: paymentRes.policyNo,
          });
        } else {
          return res.status(HttpStatus.OK).json({
            success: false,
            message: paymentRes.errorText || 'Policy No not generated!',
          });
        }
      } else {
        return res.status(HttpStatus.OK).json({
          success: true,
          message: 'Some Error Occured at Payment!',
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

  @ApiTags('Generate Policy API')
  @Post('generatePolicy/generate')
  async generatePolicy(
    @Body() generatePolicyDTO: GeneratePolicyDTO,
    @Res() res: Response,
  ) {
    try {
      const validateData: GeneratePolicyDTO =
        GeneratePolicyRequest.parse(generatePolicyDTO);

      const access_token =
        await this.generatePolicyService.authGenerationService(res);
      const generatePDFRes =
        await this.generatePolicyService.generatePolicyService(
          access_token,
          validateData,
        );
      if (generatePDFRes) {
        return res.status(HttpStatus.OK).json({
          success: true,
          message: 'PDF Generated Successfully!',
          path: generatePDFRes.message,
        });
      } else {
        return res.status(HttpStatus.BAD_GATEWAY).json({
          success: false,
          message: 'Error at generating PDF!',
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

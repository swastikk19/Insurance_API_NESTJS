import { HttpService } from '@nestjs/axios';
import { HttpStatus, Injectable, Res } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Response } from 'express';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import * as qs from 'qs';
import { InjectModel } from '@nestjs/mongoose';
import { quotationMasterDTO } from 'src/quote/dto/quote-zod.dto';

@Injectable()
export class QuoteService {
  constructor(
    private readonly httpService: HttpService,
    @InjectModel('InsuranceQuote') private insuranceQuoteSchema: any,
    @InjectModel('InsuranceQuoteRequest')
    private readonly quoteRequestSchema: any,
    @InjectModel('InsuranceApplication')
    private insuranceApplicationSchema: any,
    @InjectModel('makemodelmaster')
    private makeModelMasterSchema: any,
    @InjectModel('rtomaster')
    private rtoMasterSchema: any,
  ) {}

  async authQuoteService(
    @Res() res: Response,
    loanId: string,
    insurer: string,
  ) {
    try {
      await this.insuranceApplicationSchema.updateOne(
        {
          loanId: loanId,
          isPolicyCompleted: 0,
        },
        {
          $set: {
            insurer: insurer,
          },
        },
      );

      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
      };

      const url = process.env.quote_auth;

      const data = qs.stringify({
        grant_type: process.env.grant_type_quote,
        username: process.env.username_quote,
        password: process.env.password_quote,
        scope: process.env.scope_quote,
        client_id: process.env.client_id_quote,
        client_secret: process.env.client_secret_quote,
      });

      try {
        const response: AxiosResponse<any> = await lastValueFrom(
          this.httpService.post(url, data, { headers }),
        );
        return response.data;
      } catch (error: any) {
        await this.insuranceApplicationSchema.updateOne(
          {
            loanId: loanId,
            isPolicyCompleted: 0
          },
          {
            $set: {
              processErrorId: 1,
              processErrorMessage: 'User Unauthorized for Quotation!',
            },
          },
        );
        return res.status(HttpStatus.BAD_GATEWAY).json({
          success: false,
          message: 'User Unauthorized for Quotation!',
        });
      }
    } catch (err) {
      await this.insuranceApplicationSchema.updateOne(
        {
          loanId: loanId,
          isPolicyCompleted: 0
        },
        {
          $set: {
            processErrorId: 1,
            processErrorMessage: err.message,
          },
        },
      );
      throw new Error(`${err.message}: At Authorizing Quotation`);
    }
  }

  async generateQuoteService(
    token: any,
    QuotationDTORequest: quotationMasterDTO,
    loanId: string,
    loanIdRecords: any,
    rtoRecords: any,
  ) {
    try {
      const vehicleData = await this.makeModelMasterSchema.find({
        VehicleModel: loanIdRecords.model,
      });

      if (vehicleData.length > 0) {
        if (loanIdRecords.vehicleUsageType.toLowerCase() == 'gcv') {
          QuotationDTORequest.DealId = process.env.dealIdGCV;
          QuotationDTORequest.ProductCode = process.env.productCodeGCV;
        }

        QuotationDTORequest.BusinessType = 'New Business';
        QuotationDTORequest.RTOLocationCode = `${rtoRecords.data}`;
        QuotationDTORequest.VehicleMakeCode = `${vehicleData[0].VehicleManufactureCode}`;
        QuotationDTORequest.VehicleModelCode = `${vehicleData[0].VehicleModelCode}`;
        QuotationDTORequest.ManufacturingYear = `${loanIdRecords.manufaturingYear}`;
        QuotationDTORequest.GSTToState = `${loanIdRecords.state}`;

        const dateStart = new Date();
        const formattedDateStart = dateStart.toISOString().slice(0, 10);
        QuotationDTORequest.PolicyStartDate = `${formattedDateStart}`;
        QuotationDTORequest.DeliveryOrRegistrationDate = `${formattedDateStart}`;

        const dateEnd = new Date();
        dateEnd.setFullYear(dateEnd.getFullYear() + 1);
        dateEnd.setDate(dateEnd.getDate() - 1);
        const formattedDateEnd = dateEnd.toISOString().slice(0, 10);
        QuotationDTORequest.PolicyEndDate = `${formattedDateEnd}`;
        QuotationDTORequest.VehiclebodyPrice = '0';

        const reqData = new this.quoteRequestSchema(QuotationDTORequest);
        reqData.loanId = loanId;
        await reqData.save();

        const headers = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        };
        const response = await firstValueFrom(
          this.httpService.post(
            process.env.quotation_url,
            QuotationDTORequest,
            {
              headers,
            },
          ),
        );
        if (response.data.status || response.data.Status) {
          const quoteData = new this.insuranceQuoteSchema(response.data);
          await quoteData.save();
          const premiumDetails = response.data.premiumDetails.finalPremium;
          const correlationId = response.data.correlationId;

          await this.insuranceApplicationSchema.updateOne(
            {
              loanId: loanId,
              isPolicyCompleted: 0,
            },
            {
              $set: {
                quotationPremium: premiumDetails,
                correlationId: correlationId,
                processErrorId: 0,
                processErrorMessage: null,
                policyEndDate: QuotationDTORequest.PolicyEndDate,
                policyStartDate: QuotationDTORequest.PolicyStartDate,
                VehiclechasisPrice: QuotationDTORequest.VehiclechasisPrice,
              },
            },
          );
          return { premiumDetails, correlationId, flagId: 1 };
        } else {
          const quoteData = new this.insuranceQuoteSchema(response.data);
          await quoteData.save();

          await this.insuranceApplicationSchema.updateOne(
            {
              loanId: loanId,
              isPolicyCompleted: 0,
            },
            {
              $set: {
                processErrorId: 1,
                processErrorMessage:
                  response.data.message || response.data.Message,
              },
            },
          );
          return { data: response.data, flagId: 0 };
        }
      } else {
        await this.insuranceApplicationSchema.updateOne(
          { loanId: loanId, isPolicyCompleted: 0 },
          {
            $set: {
              processErrorId: 1,
              processErrorMessage: `${loanIdRecords.model} should be a part of ${loanIdRecords.make}!`,
            },
          },
        );

        throw new Error(
          `${loanIdRecords.model} should be a part of ${loanIdRecords.make}!`,
        );
      }
    } catch (err) {
      await this.insuranceApplicationSchema.updateOne(
        {
          loanId: loanId,
          isPolicyCompleted: 0,
        },
        {
          $set: {
            processErrorId: 1,
            processErrorMessage: err.message,
          },
        },
      );
      throw new Error(`${err.message}: At Generating Quote`);
    }
  }

  async getRtoLocationCodeService(rtoLocDesc: string) {
    try {
      const record = await this.rtoMasterSchema.find({
        RTOLocationDesciption: rtoLocDesc,
      });

      if (record.length > 0) {
        return {
          flagId: 1,
          data: record[0].RTOLocationCode,
        };
      } else {
        return {
          flagId: 0,
        };
      }
    } catch (err) {
      throw new Error(`${err.message}: Unable to fetch RTO Location Code!`);
    }
  }
}

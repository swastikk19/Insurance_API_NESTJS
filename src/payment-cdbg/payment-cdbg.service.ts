import { HttpService } from '@nestjs/axios';
import { HttpStatus, Injectable, Res } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AxiosResponse } from 'axios';
import { Response } from 'express';
import * as qs from 'qs';
import { firstValueFrom, lastValueFrom } from 'rxjs';

@Injectable()
export class PaymentCdbgService {
  constructor(
    @InjectModel('PaymentRequest') private readonly paymentRequestSchema: any,
    @InjectModel('PaymentResponse') private readonly paymentResponseSchema: any,
    private readonly httpService: HttpService,
    @InjectModel('InsuranceApplication')
    private insuranceApplicationSchema: any,
  ) {}

  async authPaymentService(@Res() res: Response) {
    try {
      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
      };
      const url = process.env.payment_auth;
      const data = qs.stringify({
        grant_type: process.env.grant_type_payment,
        username: process.env.username_payment,
        password: process.env.password_payment,
        scope: process.env.scope_payment,
        client_id: process.env.client_id_payment,
        client_secret: process.env.client_secret_payment,
      });

      try {
        const response: AxiosResponse<any> = await lastValueFrom(
          this.httpService.post(url, data, { headers }),
        );
        return response.data.access_token;
      } catch (error: any) {
        return res.status(HttpStatus.BAD_GATEWAY).json({
          success: false,
          message: 'User Unauthorized for Payment!',
        });
      }
    } catch (err) {
      throw new Error(`${err.message}: At Payment Authorizing`);
    }
  }

  async proceedPaymentService(token: string, paymentDTORequest: any) {
    try {
      const saveData = await this.paymentRequestSchema(paymentDTORequest);
      await saveData.save();

      try {
        const headers = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        };
        const response = await firstValueFrom(
          this.httpService.post(process.env.payment_url, paymentDTORequest, {
            headers,
          }),
        );

        if (
          response.data.cdbgResponse.cdbgResponseList[0].status == null ||
          response.data.cdbgResponse.cdbgResponseList[0].status.toLowerCase() ==
            'failed'
        ) {
          const paymentData = new this.paymentResponseSchema(response.data);
          const saveSchemaData = await paymentData.save();
          await this.insuranceApplicationSchema.updateOne(
            {
              correlationId: paymentDTORequest.CorrelationId,
            },
            {
              $set: {
                processErrorId: 4,
                processErrorMessage:
                  saveSchemaData.cdbgResponse[0].cdbgResponseList[0].errorText,
              },
            },
          );
          return {
            errorText:
              saveSchemaData.cdbgResponse[0].cdbgResponseList[0].errorText,
            flagId: 0,
          };
        } else {
          const paymentData = new this.paymentResponseSchema(response.data);
          const saveSchemaData = await paymentData.save();
          await this.insuranceApplicationSchema.updateOne(
            {
              correlationId: response.data.correlationId,
            },
            {
              $set: {
                policyNo:
                  saveSchemaData.cdbgResponse[0].cdbgResponseList[0].policyNo,
                processErrorId: 0,
                processErrorMessage: null,
              },
            },
          );

          return {
            policyNo:
              saveSchemaData.cdbgResponse[0].cdbgResponseList[0].policyNo,
            flagId: 1,
          };
        }
      } catch (err) {
        throw new Error(`${err.message}: Error at Payment API`);
      }
    } catch (err) {
      throw new Error(err.message);
    }
  }
}

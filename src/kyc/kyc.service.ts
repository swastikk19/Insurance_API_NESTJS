import { HttpService } from '@nestjs/axios';
import { HttpStatus, Injectable, Res } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import * as qs from 'qs';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { Response } from 'express';
import { kycDTO } from './dto/kyc-zod.dto';
import { decode, JwtPayload } from 'jsonwebtoken';
import { InjectModel } from '@nestjs/mongoose';
import * as crypto from 'crypto';
import { kycOvdDTO } from './dto/kycovd-zod.dto';
import * as fs from 'fs';
import * as FormData from 'form-data';

@Injectable()
export class KycService {
  constructor(
    private readonly httpService: HttpService,
    @InjectModel('KycLogs')
    private kycLogsSchema: any,
    @InjectModel('KycRequest')
    private kycRequestSchema: any,
    @InjectModel('InsuranceApplication')
    private insuranceApplicationSchema: any,
  ) {}

  async authKycService(@Res() res: Response) {
    try {
      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
      };
      const url = process.env.kyc_auth;
      const data = qs.stringify({
        grant_type: process.env.grant_type_kyc,
        username: process.env.username_kyc,
        password: process.env.password_kyc,
        scope: process.env.scope_kyc,
        client_id: process.env.client_id_kyc,
        client_secret: process.env.client_secret_kyc,
      });

      try {
        const response: AxiosResponse<any> = await lastValueFrom(
          this.httpService.post(url, data, { headers }),
        );
        return response.data;
      } catch (error: any) {
        return res.status(HttpStatus.BAD_GATEWAY).json({
          success: false,
          message: 'User Unauthorized for KYC!',
        });
      }
    } catch (err) {
      throw new Error(`${err.message}: At Authorizing KYC`);
    }
  }

  async initiateKycService(token: string, kycDTORequest: kycDTO) {
    let decodedToken: string | JwtPayload;
    try {
      decodedToken = decode(token);
      if (!decodedToken || typeof decodedToken === 'string') {
        throw new Error('Invalid token structure');
      }
      const kycReqData = await this.kycRequestSchema(kycDTORequest);
      kycReqData.save();

      const publicKey = (decodedToken as JwtPayload).pbk;
      const data = this.generatePanAndDOB(publicKey, kycDTORequest);

      kycDTORequest.pan_details.pan = data.pan;
      kycDTORequest.pan_details.dob = data.dob;
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      };
      const response = await firstValueFrom(
        this.httpService.post(process.env.kyc_url, kycDTORequest, {
          headers,
        }),
      );

      if (response.data.status) {
        if (response.data.statusMessage.toLowerCase() == 'success') {
          const kycData = new this.kycLogsSchema(response.data);
          const saveData = await kycData.save();
          await this.insuranceApplicationSchema.updateOne(
            { correlationId: saveData.correlationId, isPolicyCompleted: 0 },
            {
              $set: {
                il_kyc_ref_no: saveData.kyc_details.il_kyc_ref_no,
                ckyc_number: saveData.kyc_details.ckyc_number,
                processErrorId: 0,
                processErrorMessage: null,
              },
            },
          );

          return {
            il_kyc_ref_no: saveData.kyc_details.il_kyc_ref_no,
            ckyc_number: saveData.kyc_details.ckyc_number,
            correlationId: saveData.correlationId,
            flagId: 1,
          };
        } else {
          const kycFailedData = new this.kycLogsSchema(response.data);
          const saveFailedData = await kycFailedData.save();
          await this.insuranceApplicationSchema.updateOne(
            {
              correlationId: saveFailedData.correlationId,
              isPolicyCompleted: 0,
            },
            {
              $set: {
                processErrorId: 2,
                processErrorMessage: saveFailedData.message,
              },
            },
          );
          return { data: saveFailedData, flagId: 0 };
        }
      } else {
        throw new Error('Status Unsuccessfull at KYC!');
      }
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async kycUsingOvd(
    token: string,
    kycOvdRequest: kycOvdDTO,
    poiDocument: Express.Multer.File,
    poaDocument: Express.Multer.File,
  ) {
    try {
      const form = new FormData();
      form.append('is_poa_poi_same', 'false');
      form.append('poi[0].certificate_type', kycOvdRequest.poiCertificateType);
      form.append('poi[0].document', fs.createReadStream(poiDocument.path));
      form.append('poa[0].certificate_type', 'AADHAAR');
      form.append('poa[0].document', fs.createReadStream(poaDocument.path));
      form.append('CorrelationId', kycOvdRequest.correlationId);
      form.append('customer_type', 'I');

      const formHeaders = form.getHeaders();
      const headers = {
        ...formHeaders,
        Authorization: `Bearer ${token}`,
      };

      const response = await firstValueFrom(
        this.httpService.post(
          'https://ilesbsanity.insurancearticlez.com/ilservices/customer/v1/kyc/ovd',
          form,
          {
            headers,
          },
        ),
      );

      if (
        response.data.status &&
        response.data.statusMessage.toLowerCase() == 'success'
      ) {
        const kycData = await this.kycLogsSchema(response.data);
        await kycData.save();

        await this.insuranceApplicationSchema.updateOne(
          {
            correlationId: response.data.correlationId,
          },
          {
            $set: {
              policyErrorId: 0,
              poliycErrorMessage: null,
            },
          },
        );
        return {
          flagId: 1,
          il_kyc_ref_no: response.data.kyc_details.il_kyc_ref_no,
          correlationId: response.data.correlationId,
        };
      } else {
        await this.insuranceApplicationSchema.updateOne(
          {
            correlationId: response.data.correlationId,
          },
          {
            $set: {
              policyErrorId: 2,
              poliycErrorMessage: response.data.message,
            },
          },
        );
        return {
          flagId: 0,
          message: response.data.message,
        };
      }
    } catch (error) {
      console.error(
        'Error:',
        error.response ? error.response.data : error.message,
      );
      throw new Error('Failed to send data to external API');
    }
  }

  async convertFileToBase64(filePath: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      fs.readFile(filePath, (err: any, data: any) => {
        if (err) {
          reject(err);
        } else {
          const base64Data = data.toString('base64');
          resolve(base64Data);
        }
      });
    });
  }

  private generatePanAndDOB(publicKey: string, kycDTORequest: any): any {
    const encryptedDOB = crypto.publicEncrypt(
      {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_PADDING,
      },
      Buffer.from(kycDTORequest.pan_details.dob, 'utf8'),
    );

    const encryptedPAN = crypto.publicEncrypt(
      {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_PADDING,
      },
      Buffer.from(kycDTORequest.pan_details.pan, 'utf8'),
    );
    return {
      dob: encryptedDOB.toString('base64'),
      pan: encryptedPAN.toString('base64'),
    };
  }
}

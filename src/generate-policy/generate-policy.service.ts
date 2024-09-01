import * as fs from 'fs';
import { HttpService } from '@nestjs/axios';
import { HttpStatus, Injectable, Res } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AxiosResponse } from 'axios';
import { Response } from 'express';
import * as qs from 'qs';
import { firstValueFrom, lastValueFrom } from 'rxjs';

@Injectable()
export class GeneratePolicyService {
  constructor(
    @InjectModel('GeneratePolicy') private readonly generatePolicySchema: any,
    private readonly httpService: HttpService,
    @InjectModel('InsuranceApplication')
    private insuranceApplicationSchema: any,
  ) {}

  async authGenerationService(@Res() res: Response) {
    try {
      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
      };
      const url = process.env.policy_auth;
      const data = qs.stringify({
        grant_type: process.env.grant_type_policy,
        username: process.env.username_policy,
        password: process.env.password_policy,
        scope: process.env.scope_policy,
        client_id: process.env.client_id_policy,
        client_secret: process.env.client_secret_policy,
      });

      try {
        const response: AxiosResponse<any> = await lastValueFrom(
          this.httpService.post(url, data, { headers }),
        );
        return response.data.access_token;
      } catch (error: any) {
        return res.status(HttpStatus.BAD_GATEWAY).json({
          success: false,
          message: 'User Unauthorized for Policy Generation!',
        });
      }
    } catch (err) {
      throw new Error(`${err.message}: At Generate Policy Authorization`);
    }
  }

  async generatePolicyService(token: string, generatePolicyDTORequest: any) {
    try {
      const saveData = await this.generatePolicySchema(
        generatePolicyDTORequest,
      );
      await saveData.save();

      try {
        const headers = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        };
        const response = await firstValueFrom(
          this.httpService.post(
            process.env.policy_url,
            generatePolicyDTORequest,
            {
              headers,
              responseType: 'arraybuffer',
            },
          ),
        );

        const pdfBuffer = Buffer.from(response.data);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const filePath = `D://RevFin//GeneratedPolicy//${uniqueSuffix}.pdf`;

        fs.writeFileSync(filePath, pdfBuffer);
        const dataPDF = {
          flagId: 1,
          message: filePath.replaceAll('D:', process.env.test_drive),
        };

        await this.insuranceApplicationSchema.updateOne(
          {
            correlationId: generatePolicyDTORequest.CorrelationId,
          },
          {
            $set: {
              policyPdfUrl: dataPDF.message,
              isPolicyCompleted: 1,
              processErrorId: 0,
              processErrorMessage: null,
            },
            $currentDate: { policyGenerationDate: true },
          },
        );

        return dataPDF;
      } catch (err) {
        await this.insuranceApplicationSchema.updateOne(
          { correlationId: generatePolicyDTORequest.CorrelationId },
          {
            $set: {
              processErrorId: 5,
              processErrorMessage: 'Error at Policy Generating API!',
            },
          },
        );
        throw new Error(`${err.message}: Error at Policy Generating API`);
      }
    } catch (err) {
      throw new Error(err.message);
    }
  }
}

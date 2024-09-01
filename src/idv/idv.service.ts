import { HttpService } from '@nestjs/axios';
import { HttpStatus, Injectable, Res } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AxiosResponse } from 'axios';
import { Response } from 'express';
import * as qs from 'qs';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { idvRequestDTO } from './dto/idvreq-zod.dto';

@Injectable()
export class IdvService {
  constructor(
    @InjectModel('makemodelmaster')
    private makeModelMasterSchema: any,
    @InjectModel('InsuranceApplication')
    private insuranceApplicationSchema: any,
    private readonly httpService: HttpService,
    @InjectModel('rtomaster')
    private rtoMasterSchema: any,
    @InjectModel('IdvRequest')
    private idvRequestSchema: any,
    @InjectModel('IdvResponse')
    private idvResponseSchema: any,
  ) {}

  async getVehicleDetails(loanIdRecord: any) {
    try {
      const vehicleData = await this.makeModelMasterSchema.find({
        VehicleModel: loanIdRecord.model,
        Manufacture: loanIdRecord.make,
      });

      if (vehicleData.length > 0) {
        return {
          flagId: 1,
          data: vehicleData[0],
        };
      } else {
        await this.insuranceApplicationSchema.updateOne(
          {
            loanId: loanIdRecord.loanId,
            isPolicyCompleted: 0,
          },
          {
            $set: {
              processErrorId: 6,
              processErrorMessage: `${loanIdRecord.model} should be a part of ${loanIdRecord.make}`,
            },
          },
        );

        return {
          flagId: 0,
          message: `${loanIdRecord.model} should be a part of ${loanIdRecord.make}`,
        };
      }
    } catch (err) {
      return {
        flagId: 0,
        message: err.message,
      };
    }
  }

  async getRtoDetails(rtoLocDesc: string, loanId: string) {
    try {
      const records = await this.rtoMasterSchema.find({
        RTOLocationDesciption: rtoLocDesc,
      });

      if (records.length > 0) {
        await this.insuranceApplicationSchema.updateOne(
          { loanId: loanId, isPolicyCompleted: 0 },
          {
            $set: {
              processErrorId: 0,
              processErrorMessage: null,
            },
          },
        );
        return {
          flagId: 1,
          data: records[0].RTOLocationCode,
        };
      } else {
        await this.insuranceApplicationSchema.updateOne(
          { loanId: loanId, isPolicyCompleted: 0 },
          {
            $set: {
              processErrorId: 6,
              processErrorMessage: 'Incorrect State and City!',
            },
          },
        );

        return {
          flagId: 0,
          message: 'Please enter correct State and City!',
        };
      }
    } catch (err) {
      await this.insuranceApplicationSchema.updateOne(
        { loanId: loanId, isPolicyCompleted: 0 },
        {
          $set: {
            processErrorId: 6,
            processErrorMessage: err.message,
          },
        },
      );
      return {
        flagId: 0,
        message: err.message,
      };
    }
  }

  async authIDVService(@Res() res: Response, loanId: string, insurer: string) {
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

      const url = process.env.idv_auth;

      const data = qs.stringify({
        grant_type: process.env.grant_type_idv,
        username: process.env.username_idv,
        password: process.env.password_idv,
        scope: process.env.scope_idv,
        client_id: process.env.client_id_idv,
        client_secret: process.env.client_secret_idv,
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
            isPolicyCompleted: 0,
          },
          {
            $set: {
              processErrorId: 6,
              processErrorMessage: 'User Unauthorized for IDV!',
            },
          },
        );
        return res.status(HttpStatus.BAD_GATEWAY).json({
          success: false,
          message: 'User Unauthorized for IDV!',
        });
      }
    } catch (err) {
      await this.insuranceApplicationSchema.updateOne(
        {
          loanId: loanId,
          isPolicyCompleted: 0,
        },
        {
          $set: {
            processErrorId: 6,
            processErrorMessage: err.message,
          },
        },
      );
      throw new Error(`${err.message}: At Authorizing IDV`);
    }
  }

  async getIdvDetails(
    token: string,
    idvDtoRequest: idvRequestDTO,
    rtoRecords: any,
    vehicleData: any,
    loanIdRecord: any,
  ) {
    try {
      idvDtoRequest.manufacturercode = vehicleData.data.VehicleManufactureCode;
      idvDtoRequest.BusinessType = 'New Business';
      idvDtoRequest.rtolocationcode = rtoRecords.data;

      const dateStart = new Date();
      const formattedDateStart = dateStart.toISOString().slice(0, 10);
      idvDtoRequest.DeliveryOrRegistrationDate = `${formattedDateStart}`;
      idvDtoRequest.PolicyStartDate = `${formattedDateStart}`;

      if (loanIdRecord.vehicleUsageType.toLowerCase() == 'gcv') {
        idvDtoRequest.DealID = `${process.env.dealIdGCV}`;
      }
      idvDtoRequest.vehiclemodelcode = vehicleData.data.VehicleModelCode;

      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      };

      const saveRequest = await this.idvRequestSchema(idvDtoRequest);
      await saveRequest.save();

      const response = await firstValueFrom(
        this.httpService.post(process.env.idv_url, idvDtoRequest, {
          headers,
        }),
      );

      if (response.data.status) {
        const saveResponse = await this.idvResponseSchema(response.data);
        await saveResponse.save();

        await this.insuranceApplicationSchema.updateOne(
          { loanId: loanIdRecord.loanId, isPolicyCompleted: 0 },
          {
            $set: {
              processErrorId: 0,
              processErrorMessage: null,
              correlationId: response.data.correlationId,
            },
          },
        );

        return {
          flagId: 1,
          data: {
            correlationId: response.data.correlationId,
            maximumprice: response.data.maximumprice,
            minimumprice: response.data.minimumprice,
          },
        };
      } else {
        const saveResponse = await this.idvResponseSchema(response.data);
        await saveResponse.save();

        await this.insuranceApplicationSchema.updateOne(
          { loanId: loanIdRecord.loanId, isPolicyCompleted: 0 },
          {
            $set: {
              processErrorId: 6,
              processErrorMessage: null,
            },
          },
        );

        return {
          flagId: 0,
          message: response.data.errorMessage,
        };
      }
    } catch (err) {
      return {
        flagId: 0,
        message: err.message,
      };
    }
  }
}

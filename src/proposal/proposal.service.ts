import { HttpService } from '@nestjs/axios';
import { HttpStatus, Injectable, Res } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AxiosResponse } from 'axios';
import { Response } from 'express';
import * as qs from 'qs';
import { firstValueFrom, lastValueFrom } from 'rxjs';

@Injectable()
export class ProposalService {
  constructor(
    @InjectModel('ProposalRequest') private propsalReqestSchema: any,
    @InjectModel('ProposalResponse') private proposalResponseSchema: any,
    private readonly httpService: HttpService,
    @InjectModel('InsuranceApplication')
    private insuranceApplicationSchema: any,
    @InjectModel('makemodelmaster')
    private makeModelMasterSchema: any,
    @InjectModel('rtomaster')
    private rtoMasterSchema: any,
  ) {}

  async authProposalService(@Res() res: Response) {
    try {
      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
      };
      const url = process.env.proposal_auth;
      const data = qs.stringify({
        grant_type: process.env.grant_type_proposal,
        username: process.env.username_proposal,
        password: process.env.password_proposal,
        scope: process.env.scope_proposal,
        client_id: process.env.client_id_proposal,
        client_secret: process.env.client_secret_proposal,
      });

      try {
        const response: AxiosResponse<any> = await lastValueFrom(
          this.httpService.post(url, data, { headers }),
        );
        return response.data;
      } catch (error: any) {
        return res.status(HttpStatus.BAD_GATEWAY).json({
          success: false,
          message: 'User Unauthorized for Proposal!',
        });
      }
    } catch (err) {
      throw new Error(`${err.message}: At Authorizing KYC`);
    }
  }

  async getProposalService(proposalReqDTO: any, token: string, loanId: string) {
    try {
      const loanIdRecord = await this.insuranceApplicationSchema.find({
        loanId: loanId,
        isPolicyCompleted: 0
      });

      const rtoLocDesc = `${loanIdRecord[0].state}-${loanIdRecord[0].city}`;
      const rtoData = await this.rtoMasterSchema.find({
        RTOLocationDesciption: rtoLocDesc,
      });

      if (rtoData.length == 0) {
        await this.insuranceApplicationSchema.updateOne(
          {
            correlationId: proposalReqDTO.CorrelationId,
          },
          {
            $set: {
              processErrorId: 3,
              processErrorMessage:
                'Please enter valid State and City! : At Proposal',
            },
          },
        );
        return {
          success: false,
          message: 'Please enter valid State and City! : At Proposal',
          flagId: 0,
        };
      }

      const vehicleData = await this.makeModelMasterSchema.find({
        VehicleModel: loanIdRecord[0].model,
      });

      if (vehicleData.length == 0) {
        await this.insuranceApplicationSchema.updateOne(
          {
            correlationId: proposalReqDTO.CorrelationId,
          },
          {
            $set: {
              processErrorId: 3,
              processErrorMessage:
                'Please enter valid Make and Model! : At Proposal',
            },
          },
        );
        return {
          success: false,
          message: 'Please enter valid Make and Model! : At Proposal',
          flagId: 0,
        };
      }

      proposalReqDTO.VehiclechasisPrice = loanIdRecord[0].VehiclechasisPrice;
      proposalReqDTO.VehicleMakeCode = vehicleData[0].VehicleManufactureCode;
      proposalReqDTO.BusinessType = 'New Business';
      proposalReqDTO.VehicleModelCode = vehicleData[0].VehicleModelCode;
      proposalReqDTO.RTOLocationCode = rtoData[0].RTOLocationCode;
      proposalReqDTO.RegistrationNumber = 'NEW';
      proposalReqDTO.ChassisNumber = loanIdRecord[0].chassisNumber;
      proposalReqDTO.EngineNumber = loanIdRecord[0].motorNumber;
      proposalReqDTO.GSTToState = loanIdRecord[0].state;
      proposalReqDTO.PolicyEndDate = loanIdRecord[0].policyEndDate;
      proposalReqDTO.PolicyStartDate = loanIdRecord[0].policyStartDate;
      proposalReqDTO.ManufacturingYear = parseInt(
        loanIdRecord[0].manufaturingYear,
      );
      proposalReqDTO.customerDetails.CityCode = rtoData[0].CityDistrictCode;
      proposalReqDTO.customerDetails.StateCode = rtoData[0].ILStateCode;
      proposalReqDTO.customerDetails.CountryCode = 100;
      proposalReqDTO.customerDetails.AddressLine1 = loanIdRecord[0].address;
      proposalReqDTO.customerDetails.MobileNumber = '9999999999';
      proposalReqDTO.customerDetails.PinCode = loanIdRecord[0].pincode;
      proposalReqDTO.customerDetails.CustomerType = 'INDIVIDUAL';
      proposalReqDTO.customerDetails.CustomerName =
        loanIdRecord[0].customerName;
      proposalReqDTO.DeliveryOrRegistrationDate =
        loanIdRecord[0].policyStartDate;
      if (loanIdRecord[0].vehicleUsageType.toLowerCase() == 'gcv') {
        proposalReqDTO.DealId = process.env.dealIdGCV;
        proposalReqDTO.productCode = parseInt(process.env.productCodeGCV);
      }

      const saveData = await this.propsalReqestSchema(proposalReqDTO);
      await saveData.save();

      try {
        const headers = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        };
        const response = await firstValueFrom(
          this.httpService.post(process.env.proposal_url, proposalReqDTO, {
            headers,
          }),
        );

        if (response.data.status || response.data.Status) {
          if (response.data.statusMessage.toLowerCase() == 'success') {
            const proposalData = new this.proposalResponseSchema(response.data);
            const saveSchemaData = await proposalData.save();

            await this.insuranceApplicationSchema.updateOne(
              {
                correlationId: saveSchemaData.correlationId,
                isPolicyCompleted: 0,
              },
              {
                $set: {
                  proposalNumber:
                    saveSchemaData.generalInformation.proposalNumber,
                  processErrorId: 0,
                  processErrorMessage: null,
                },
              },
            );
            return {
              proposalNumber: saveSchemaData.generalInformation.proposalNumber,
              correlationId: saveSchemaData.correlationId,
              flagId: 1,
            };
          } else {
            const proposalData = new this.proposalResponseSchema(response.data);
            await proposalData.save();

            await this.insuranceApplicationSchema.updateOne(
              {
                correlationId: proposalReqDTO.correlationId,
              },
              {
                $set: {
                  processErrorId: 3,
                  processErrorMessage: response.data.message,
                },
              },
            );

            return {
              message: response.data.message,
              flagId: 0,
            };
          }
        } else {
          const proposalData = new this.proposalResponseSchema(response.data);
          await proposalData.save();

          await this.insuranceApplicationSchema.updateOne(
            {
              correlationId: proposalReqDTO.CorrelationId,
            },
            {
              $set: {
                processErrorId: 3,
                processErrorMessage:
                  response.data.message || response.data.Message,
              },
            },
          );
          return {
            success: false,
            message: response.data.message || response.data.Message,
            flagId: 0,
          };
        }
      } catch (err) {
        await this.insuranceApplicationSchema.updateOne(
          { correlationId: proposalReqDTO.CorrelationId },
          {
            $set: {
              processErrorId: 3,
              processErrorMessage: err.message,
            },
          },
        );
        throw new Error(`${err.message}: Error at Proposal API`);
      }
    } catch (err) {
      await this.insuranceApplicationSchema.updateOne(
        { loanId: loanId, isPolicyCompleted: 0 },
        {
          $set: {
            processErrorId: 3,
            processErrorMessage: 'Something went wrong at Proposal API!',
          },
        },
      );
      throw new Error(err.message);
    }
  }
}

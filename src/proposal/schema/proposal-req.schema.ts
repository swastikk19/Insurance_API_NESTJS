import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ProposalRequestDocument = ProposalRequest & Document;

@Schema()
export class customerDetailsClass {
  @Prop({
    required: true,
  })
  CustomerType: string;

  @Prop({
    required: true,
  })
  CustomerName: string;
  DateOfBirth: string;

  @Prop({
    required: true,
  })
  PinCode: string;
  PANCardNo: string;
  Email: string;

  @Prop({
    required: true,
  })
  MobileNumber: string;

  @Prop({
    required: true,
  })
  AddressLine1: string;

  @Prop({
    required: true,
  })
  CountryCode: string;

  @Prop({
    required: true,
  })
  StateCode: string;

  @Prop({
    required: true,
  })
  CityCode: string;
  Gender: string;
  MobileISD: string;
  AadharNumber: string;
  GSTDetails: string;
  CKYCID: string;
  EKYCid: string;
  pepFlag: string;
  ilkycReferenceNumber: string;
}

@Schema({
  timestamps: true,
})
export class ProposalRequest {
  @Prop({
    required: true,
  })
  CorrelationId: string;

  @Prop()
  vehiclebodyPrice: string;

  @Prop({
    required: true,
  })
  productCode: string;

  @Prop()
  IsPrivateUse: string;

  @Prop()
  BusinessType: string;

  @Prop({
    required: true,
  })
  DealId: string;

  @Prop({
    required: true,
  })
  VehicleMakeCode: string;

  @Prop({
    required: true,
  })
  VehicleModelCode: string;

  @Prop({
    required: true,
  })
  RTOLocationCode: string;

  @Prop()
  ExShowRoomPrice: string;

  @Prop()
  IsNoPrevInsurance: string;

  @Prop()
  ManufacturingYear: string;

  @Prop({
    required: true,
  })
  DeliveryOrRegistrationDate: string;

  @Prop()
  FirstRegistrationDate: string;

  @Prop()
  IsTransferOfNCB: string;

  @Prop()
  TransferOfNCBPercent: string;

  @Prop()
  PreviousPolicyDetails: string;

  @Prop()
  IsVehicleHaveCNG: string;

  @Prop()
  SIVehicleHaveLPG_CNG: string;

  @Prop()
  IsFiberGlassFuelTank: string;

  @Prop({
    required: true,
  })
  PolicyStartDate: string;

  @Prop({
    required: true,
  })
  PolicyEndDate: string;

  @Prop()
  CustomerType: string;

  @Prop()
  ISHaveElectricalAccessories: string;

  @Prop()
  ISHaveNonElectricalAccessories: string;

  @Prop()
  SIHaveElectricalAccessories: string;

  @Prop()
  SIVeSIHaveNonElectricalAccessorieshicleHaveLPG_CNG: string;

  @Prop()
  TPPDLimit: string;

  @Prop()
  IsLegalLiabilityToPaidDriver: string;

  @Prop()
  IsLegalLiabilityToPaidEmployee: string;

  @Prop()
  NoOfEmployee: string;

  @Prop()
  IsPACoverUnnamedPassenger: string;

  @Prop()
  SIPACoverUnnamedPassenger: string;

  @Prop()
  IsValidDrivingLicense: string;

  @Prop()
  IsMoreThanOneVehicle: string;

  @Prop()
  IsPACoverOwnerDriver: string;

  @Prop()
  IsVoluntaryDeductible: string;

  @Prop()
  VoluntaryDeductiblePlanName: string;

  @Prop()
  IsAutomobileAssocnFlag: string;

  @Prop()
  AutomobileAssociationNumber: string;

  @Prop()
  IsAntiTheftDisc: string;

  @Prop()
  IsHandicapDisc: string;

  @Prop()
  IsExtensionCountry: string;

  @Prop()
  IsGarageCash: string;

  @Prop()
  GarageCashPlanName: string;

  @Prop()
  ZeroDepPlanName: string;

  @Prop()
  IsRTIApplicableflag: string;

  @Prop()
  IsConsumables: string;

  @Prop()
  IsTyreProtect: string;

  @Prop()
  InclusionOfIMT: string;

  @Prop()
  IsEngineProtectPlus: string;

  @Prop()
  RSAPlanName: string;

  @Prop()
  KeyProtectPlan: string;

  @Prop()
  LossOfPersonalBelongingPlanName: string;

  @Prop()
  OtherLoading: string;

  @Prop({
    required: true,
  })
  GSTToState: string;

  @Prop()
  customerDetails: customerDetailsClass;

  @Prop({
    required: true,
  })
  EngineNumber: string;

  @Prop({
    required: true,
  })
  ChassisNumber: string;

  @Prop({
    required: true,
  })
  RegistrationNumber: string;

  @Prop()
  nomineeDetails: string;

  @Prop()
  financierDetails: string;

  @Prop()
  isNCBProtect: string;

  @Prop()
  ncbProtectPlanName: string;

  @Prop()
  bodyType: string;

  @Prop()
  noOfDriver: string;

  @Prop()
  extensionCountryName: string;

  @Prop()
  isHaveElectricalAccessories: string;

  @Prop()
  SPDetails: string;

  @Prop()
  Tenure: string;

  @Prop()
  TPTenure: string;

  @Prop()
  PACoverTenure: string;

  @Prop()
  IsPACoverWaiver: string;

  @Prop()
  IsPACoverPaidDriver: string;

  @Prop()
  SIPACoverPaidDriver: string;

  @Prop()
  TPStartDate: string;

  @Prop()
  TPEndDate: string;

  @Prop()
  TPPolicyNo: string;

  @Prop()
  TPInsurerName: string;

  @Prop()
  IsRegisteredCustomer: string;

  @Prop()
  IsEMIProtect: string;

  @Prop()
  EMIAmount: string;

  @Prop()
  NoOfEMI: string;

  @Prop()
  TimeExcessInIays: string;

  @Prop()
  SoftCopyFlag: string;
}

export const ProposalRequestSchema =
  SchemaFactory.createForClass(ProposalRequest);

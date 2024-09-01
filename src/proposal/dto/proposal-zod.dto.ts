import { z } from 'zod';

// Define the Zod schema for customerDetailsClass with validations
const customerDetailsClassSchema = z.object({
  CustomerType: z.string().optional(),
  CustomerName: z.string().optional(),
  DateOfBirth: z.string().optional(),
  PinCode: z.string().optional(),
  PANCardNo: z.string().optional(),
  Email: z.string().email({ message: 'Invalid email address' }).optional(),
  MobileNumber: z.string().optional(),
  AddressLine1: z.string().optional(),
  CountryCode: z.number().optional(),
  StateCode: z.number().optional(),
  CityCode: z.number().optional(),
  Gender: z.string().optional(),
  MobileISD: z.string().optional(),
  AadharNumber: z.string().optional(),
  GSTDetails: z.string().optional(),
  CKYCID: z.string().optional().nullable(),
  EKYCid: z.string().optional(),
  pepFlag: z.boolean().optional(),
  ilkycReferenceNumber: z.string().optional(),
});

// Define the Zod schema for ProposalRequest with validations
export const ProposalRequest = z.object({
  CorrelationId: z.string().min(1, { message: 'CorrelationId is required' }),
  vehiclebodyPrice: z.number().optional(),
  productCode: z.number().optional(),
  IsPrivateUse: z.boolean().optional(),
  BusinessType: z.string().optional(),
  DealId: z.string().optional(),
  VehicleMakeCode: z.string().optional(),
  VehicleModelCode: z.string().optional(),
  RTOLocationCode: z.number().optional(),
  ExShowRoomPrice: z.number().optional(),
  IsNoPrevInsurance: z.boolean().optional(),
  ManufacturingYear: z.number().optional(),
  DeliveryOrRegistrationDate: z.string().optional(),
  FirstRegistrationDate: z.string().optional(),
  IsTransferOfNCB: z.boolean().optional(),
  TransferOfNCBPercent: z.number().optional(),
  PreviousPolicyDetails: z.string().optional(),
  IsVehicleHaveCNG: z.boolean().optional(),
  SIVehicleHaveLPG_CNG: z.number().optional(),
  IsFiberGlassFuelTank: z.boolean().optional(),
  PolicyStartDate: z.string().optional(),
  PolicyEndDate: z.string().optional(),
  CustomerType: z.string().optional(),
  ISHaveElectricalAccessories: z.boolean().optional(),
  ISHaveNonElectricalAccessories: z.boolean().optional(),
  SIHaveElectricalAccessories: z.number().optional(),
  SIVeSIHaveNonElectricalAccessorieshicleHaveLPG_CNG: z.number().optional(),
  TPPDLimit: z.number().optional(),
  IsLegalLiabilityToPaidDriver: z.boolean().optional(),
  IsLegalLiabilityToPaidEmployee: z.boolean().optional(),
  NoOfEmployee: z.number().optional(),
  IsPACoverUnnamedPassenger: z.boolean().optional(),
  SIPACoverUnnamedPassenger: z.number().optional(),
  IsValidDrivingLicense: z.boolean().optional(),
  IsMoreThanOneVehicle: z.boolean().optional(),
  IsPACoverOwnerDriver: z.boolean().optional(),
  IsVoluntaryDeductible: z.boolean().optional(),
  VoluntaryDeductiblePlanName: z.string().optional(),
  IsAutomobileAssocnFlag: z.boolean().optional(),
  AutomobileAssociationNumber: z.string().optional(),
  IsAntiTheftDisc: z.boolean().optional(),
  IsHandicapDisc: z.boolean().optional(),
  IsExtensionCountry: z.boolean().optional(),
  IsGarageCash: z.boolean().optional(),
  GarageCashPlanName: z.string().optional(),
  ZeroDepPlanName: z.string().optional(),
  IsRTIApplicableflag: z.boolean().optional(),
  IsConsumables: z.boolean().optional(),
  IsTyreProtect: z.boolean().optional(),
  InclusionOfIMT: z.boolean().optional(),
  IsEngineProtectPlus: z.boolean().optional(),
  RSAPlanName: z.string().optional(),
  KeyProtectPlan: z.string().optional(),
  LossOfPersonalBelongingPlanName: z.string().optional(),
  OtherLoading: z.number().optional(),
  OtherDiscount: z.number().optional(),
  GSTToState: z.string().optional(),
  customerDetails: customerDetailsClassSchema,
  EngineNumber: z.string().optional(),
  ChassisNumber: z.string().optional(),
  RegistrationNumber: z.string().optional(),
  nomineeDetails: z.string().optional(),
  financierDetails: z.string().optional(),
  isNCBProtect: z.boolean().optional(),
  ncbProtectPlanName: z.string().optional(),
  bodyType: z.string().optional(),
  noOfDriver: z.number().optional(),
  extensionCountryName: z.string().optional(),
  isHaveElectricalAccessories: z.boolean().optional(),
  SPDetails: z.string().optional(),
  Tenure: z
    .number()
    .positive({ message: 'Tenure should be a positive number' })
    .optional(),
  TPTenure: z
    .number()
    .positive({ message: 'TPTenure should be a positive number' })
    .optional(),
  PACoverTenure: z.number().optional(),
  IsPACoverWaiver: z.boolean().optional(),
  IsPACoverPaidDriver: z.boolean().optional(),
  SIPACoverPaidDriver: z.string().optional(),
  TPStartDate: z.string().optional(),
  TPEndDate: z.string().optional(),
  TPPolicyNo: z.string().optional(),
  TPInsurerName: z.string().optional(),
  IsRegisteredCustomer: z.boolean().optional(),
  IsEMIProtect: z.boolean().optional(),
  EMIAmount: z.number().optional(),
  NoOfEMI: z.number().optional(),
  TimeExcessInIays: z.number().optional(),
  SoftCopyFlag: z.string().optional(),
});

export type ProposalRequestDto = z.infer<typeof ProposalRequest>;

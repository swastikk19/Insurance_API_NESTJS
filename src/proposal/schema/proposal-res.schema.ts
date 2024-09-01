import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ProposalRequestDocument = ProposalResponse & Document;

@Schema()
export class riskDetailsClass {
  ncbProtect: number;
  imT23OD: number;
  legalLiabilityforNonFarePass: number;
  overTurningLoading: number;
  privateUseOD: number;
  privateUseTP: number;
  breakinLoadingAmount: number;
  garageCash: number;
  biFuelKitOD: number;
  biFuelKitTP: number;
  tyreProtect: number;
  fibreGlassFuelTank: number;
  trailersLiability: number;
  paCoverCleanersAndConductors: number;
  trailorOD: number;
  legalLiabilityforCCC: number;
  basicOD: number;
  geographicalExtensionOD: number;
  electricalAccessories: number;
  nonElectricalAccessories: number;
  consumables: number;
  zeroDepreciation: number;
  returnToInvoice: number;
  roadSideAssistance: number;
  engineProtect: number;
  keyProtect: number;
  lossOfPersonalBelongings: number;
  voluntaryDiscount: number;
  antiTheftDiscount: number;
  automobileAssociationDiscount: number;
  handicappedDiscount: number;
  emeCover: number;
  drivingTuitionOD: number;
  drivingTuitionTP: number;
  basicTP: number;
  paidDriver: number;
  employeesOfInsured: number;
  geographicalExtensionTP: number;
  paCoverForUnNamedPassenger: number;
  paCoverForOwnerDriver: number;
  paCoverForPaidDriver: number;
  tppD_Discount: number;
  bonusDiscount: number;
  paCoverWaiver: number;
  ncbPercentage: number;
  batteryProtect: number;
  drivingAccessories: number;
}

@Schema()
export class generalInformationClass {
  vehicleModel: string;
  manufacturerName: string;
  manufacturingYear: string;
  vehicleDescription: string;
  rtoLocation: string;
  showRoomPrice: number;
  chassisPrice: number;
  bodyPrice: number;
  seatingCapacity: number;
  carryingCapacity: number;
  policyInceptionDate: string;
  policyEndDate: string;
  transactionType: string;
  cubicCapacity: string;
  proposalDate: string;
  referenceProposalDate: string;
  depriciatedIDV: number;
  tenure: string;
  tpTenure: string;
  registrationDate: string;
  percentageOfDepriciation: string;
  proposalNumber: string;
  referenceProposalNo: string;
  customerId: string;
  customerType: string;
  rtoLocationCode: string;
  discountType: string;
  discountLoadName: string;
  imtDiscountOrLoadingValue: number;
  bodyTypeDescription: string;
  quoteId: string;
}

@Schema()
export class premiumDetailsClass {
  totalOwnDamagePremium: number;
  totalLiabilityPremium: number;
  packagePremium: number;
  specialDiscount: number;
  totalTax: number;
  finalPremium: number;
  bonusDiscount: number;
}

@Schema()
export class taxDetailsClass {
  igstRate: number;
  igstAmount: number;
  sgstRate: number;
  sgstAmount: number;
  cgstRate: number;
  cgstAmount: number;
  utgstRate: number;
  utgstAmount: number;
}

@Schema({
  timestamps: true,
})
export class ProposalResponse {
  @Prop()
  riskDetails: riskDetailsClass;

  @Prop()
  generalInformation: generalInformationClass;

  @Prop()
  premiumDetails: premiumDetailsClass;

  @Prop()
  deviationMessage: string;

  @Prop()
  isQuoteDeviation: boolean;

  @Prop()
  breakingFlag: boolean;

  @Prop()
  isApprovalRequired: boolean;

  @Prop()
  proposalStatus: string;

  @Prop()
  garageCashDetails: string;

  @Prop()
  earlyPayRate: number;

  @Prop()
  systemDiscount: number;

  @Prop()
  taxDetails: taxDetailsClass;

  @Prop()
  riskCoverRates: string;

  @Prop()
  dealId: string;

  @Prop()
  message: string;

  @Prop()
  status: string;

  @Prop()
  statusMessage: string;

  @Prop()
  correlationId: string;
}

export const ProposalResponseSchema =
  SchemaFactory.createForClass(ProposalResponse);

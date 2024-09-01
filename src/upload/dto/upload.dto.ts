import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ExcelUploadDTO {
  @IsNotEmpty({ message: 'LoanId cannot be empty' })
  @IsString()
  readonly LoanId: string;

  @IsNumber()
  @IsNotEmpty({ message: 'Application Age cannot be empty' })
  readonly ApplicationAge: number;

  @IsNotEmpty({ message: 'Partner Priority cannot be empty' })
  @IsString()
  readonly PartnerPriority: string;

  @IsNotEmpty({ message: 'Partner Code cannot be empty' })
  @IsString()
  readonly PartnerCode: string;

  @IsNotEmpty({ message: 'Customer Name cannot be empty' })
  @IsString()
  readonly CustomerName: string;

  @IsNotEmpty({ message: 'Make cannot be empty' })
  @IsString()
  readonly Make: string;

  @IsNotEmpty({ message: 'Model cannot be empty' })
  @IsString()
  readonly Model: string;

  @IsNotEmpty({ message: 'Motor Number cannot be empty' })
  @IsString()
  readonly MotorNumber: string;

  @IsNotEmpty({ message: 'Chasis Number cannot be empty' })
  @IsString()
  readonly ChassisNumber: string;

  @IsNotEmpty({ message: 'IDV cannot be empty' })
  @IsNumber()
  readonly IDV: number;

  @IsNotEmpty({ message: 'Address cannot be empty' })
  @IsString()
  readonly Address: string;

  @IsNotEmpty({ message: 'State cannot be empty' })
  @IsString()
  readonly State: string;

  @IsNotEmpty({ message: 'City cannot be empty' })
  @IsString()
  readonly City: string;

  @IsNotEmpty({ message: 'Pincode cannot be empty' })
  @IsString()
  readonly Pincode: number;

  @IsNotEmpty({ message: 'RTO Number cannot be empty' })
  @IsString()
  readonly RTOCode: number;

  @IsNotEmpty({ message: 'Manufacturing Year cannot be empty' })
  @IsString()
  readonly ManufaturingYear: string;

  @IsNotEmpty({ message: 'Vehicle Usage Type cannot be empty' })
  @IsString()
  readonly VehicleUsageType: string;

  @IsNotEmpty({ message: 'Pan Number cannot be empty' })
  @IsString()
  readonly PanNumber: string;

  @IsNotEmpty({ message: 'DOB cannot be empty' })
  @IsString()
  readonly DOB: string;
}

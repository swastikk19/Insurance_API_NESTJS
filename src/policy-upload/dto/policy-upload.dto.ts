import { IsNotEmpty } from 'class-validator';

export class PolicyUploadDTO {
  @IsNotEmpty({ message: 'loanId is required' })
  readonly loanId: string;

  @IsNotEmpty({ message: 'insurer is required' })
  readonly insurer: string;
}

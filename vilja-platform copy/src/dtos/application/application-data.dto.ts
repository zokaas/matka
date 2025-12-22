import { IsBoolean, IsNumber, IsString, ValidateNested } from "class-validator";
import { CreateApplicationDynamicFieldsDto } from "./create-application-dynamic-fields.dto";
import { PreconditionsDto } from "./preconditions.dto";
import { Type } from "class-transformer";

export class ApplicationDataDto extends CreateApplicationDynamicFieldsDto {
  @IsString()
  id: string;

  @IsString()
  reference: string;

  @IsString()
  applicationState: string;

  @IsString()
  createDate: string;

  @IsString()
  updateDate: string;

  @IsString()
  loanReason: string;

  @IsBoolean()
  downgradeAccepted: boolean;

  @IsNumber()
  manualDeltaInterestRate: number;

  @IsNumber()
  startupFee: number;

  @IsString()
  statementChannel: string;

  @IsString()
  statusUpdateDate: string;

  @IsNumber()
  systemDeltaInterestRate: number;

  @IsString()
  actualDecision: string;

  @IsString()
  suggestion: string;

  @IsString()
  rejectReasonCode: string;

  @IsString()
  rejectReasonText: string;

  @ValidateNested()
  @Type(() => PreconditionsDto)
  preconditions: PreconditionsDto;

  @IsString()
  applicationCategory: string;

  @IsBoolean()
  residualAmountNotAllowToBeOverwrittenByRule: boolean;

  @IsNumber()
  productInterestRate: number;

  @IsNumber()
  referenceInterestRate: number;

  @IsNumber()
  totalInterestRate: number;
}

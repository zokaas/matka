import { Type } from "class-transformer";
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { ApplicationGuarantorDto } from "./application-guarantor.dto";

export class GuaranteesDto {
  @IsNumber()
  guaranteeAmount: number;

  @IsOptional()
  @IsString()
  id: string;

  @IsOptional()
  @IsString()
  hasAgreed: string;

  @IsOptional()
  @IsString()
  agreementDate: string;

  @IsOptional()
  @IsString()
  createTime: string;

  @IsOptional()
  @IsString()
  updateTime: string;

  @ValidateNested()
  @Type(() => ApplicationGuarantorDto)
  guarantor: ApplicationGuarantorDto;
}

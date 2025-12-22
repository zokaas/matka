import { Type } from "class-transformer";
import { IsIn, IsString, ValidateNested } from "class-validator";
import { SmeDto } from "./sme";
import { GuarantorDto } from "./guarantor";
import { ApplicationDto } from "./application/application.dto";
import { FLOW_EXISTING, FLOW_NEW } from "../constants";

export class ApplicationPayloadDto {
  @IsString()
  @IsIn([FLOW_NEW, FLOW_EXISTING])
  flow: string;

  @IsString()
  reference: string;

  @IsString()
  guarantorId: string;

  @ValidateNested()
  @Type(() => SmeDto)
  sme: SmeDto;

  @ValidateNested()
  @Type(() => GuarantorDto)
  guarantor: GuarantorDto;

  @ValidateNested()
  @Type(() => ApplicationDto)
  application: ApplicationDto;
}

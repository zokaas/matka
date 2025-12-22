import { Type } from "class-transformer";
import { IsInt, ValidateNested } from "class-validator";
import { IndividualGuarantorDto } from "./individual-guarantor.dto";

export class GuaranteeDto {
  @IsInt()
  guaranteeAmount: number;

  @ValidateNested()
  @Type(() => IndividualGuarantorDto)
  guarantor: IndividualGuarantorDto;
}

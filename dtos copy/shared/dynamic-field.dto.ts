import { IsString } from "class-validator";
import { DependentQuestionDto } from "./dependent-question.dto";
import { InfoDto } from "./info.dto";
import { BeneficialOwnerDto } from "./beneficial-owner.dto";
import { CountryOptionsDto } from "./country-options.dto";

export class DynamicFieldDto {
  @IsString()
  id: string;

  @IsString()
  __component: string;
}

export type DynamicFieldUnion =
  | DependentQuestionDto
  | InfoDto
  | BeneficialOwnerDto
  | CountryOptionsDto;

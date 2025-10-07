import { Type } from "class-transformer";
import { IsString, ValidateNested } from "class-validator";
import { ButtonDto, CompanyBlockDto, FooterDto, StepsDto } from "../shared";

export class ApiProductDto {
  @IsString()
  product: string;

  @ValidateNested()
  @Type(() => StepsDto)
  steps: StepsDto;

  @ValidateNested()
  @Type(() => ButtonDto)
  button: ButtonDto;

  @ValidateNested()
  @Type(() => FooterDto)
  footer: FooterDto;

  @ValidateNested()
  @Type(() => CompanyBlockDto)
  companyBlock: CompanyBlockDto;
}

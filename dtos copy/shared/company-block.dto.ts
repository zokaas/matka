import { IsString } from "class-validator";

export class CompanyBlockDto {
  @IsString()
  companyName: string;

  @IsString()
  orgNumber: string;
}

import { IsNumber, IsOptional, IsString } from "class-validator";

export class CompanyBlockDto {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsString()
  companyName: string;

  @IsString()
  orgNumber: string;
}

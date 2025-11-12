import { IsNumber, IsString } from "class-validator";

export class CompanyBlockDto {
  @IsNumber()
  id: number;

  @IsString()
  companyName: string;

  @IsString()
  orgNumber: string;
}

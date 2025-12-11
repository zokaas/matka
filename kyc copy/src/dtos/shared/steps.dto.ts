import { IsNumber, IsOptional, IsString } from "class-validator";

export class StepsDto {
  @IsNumber()
  @IsOptional()
  id?: number;

  @IsString()
  step1: string;

  @IsString()
  step2: string;

  @IsString()
  step3: string;
}

import { IsNumber, IsString } from "class-validator";

export class StepsDto {
  @IsNumber()
  id: number;

  @IsString()
  step1: string;

  @IsString()
  step2: string;

  @IsString()
  step3: string;
}

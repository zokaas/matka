import { IsString } from "class-validator";

export class StepsDto {
  @IsString()
  step1: string;

  @IsString()
  step2: string;

  @IsString()
  step3: string;
}

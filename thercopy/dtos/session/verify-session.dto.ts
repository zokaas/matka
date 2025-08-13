import { IsBoolean, IsNumber } from "class-validator";

export class VerifySessionDto {
  @IsBoolean()
  status: boolean;

  @IsNumber()
  ttl: number;
}

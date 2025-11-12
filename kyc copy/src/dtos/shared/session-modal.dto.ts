import { IsNumber, IsString } from "class-validator";

export class SessionModalDto {
  @IsNumber()
  id: number;

  @IsString()
  companyName: string;

  @IsString()
  orgNumber: string;

  @IsString()
  refreshTitle: string;

  @IsString()
  refreshDescription: string;

  @IsString()
  continueSessionButton: string;

  @IsString()
  expiredTitle: string;

  @IsString()
  expiredDescription: string;

  @IsString()
  loginButton: string;

  @IsString()
  logoutButton: string;
}

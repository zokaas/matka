import { IsNumber, IsOptional, IsString } from "class-validator";

export class SessionModalDto {
  @IsNumber()
  @IsOptional()
  id?: number;

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

import { IsNumber, IsOptional, IsString } from "class-validator";

export class RefreshSessionDto {
  @IsString()
  @IsOptional()
  sessionId?: string;

  @IsNumber()
  @IsOptional()
  exp?: number;

  @IsNumber()
  @IsOptional()
  sessionRefreshCount?: number;
}

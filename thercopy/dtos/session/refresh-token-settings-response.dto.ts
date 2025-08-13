import { IsBoolean, IsNumber } from "class-validator";

export class RefreshTokenSettingsResponseDto {
  @IsBoolean()
  revokeRefreshToken: boolean;

  @IsNumber()
  refreshTokenMaxReuse: number;
}

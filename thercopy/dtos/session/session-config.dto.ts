import { IsBoolean, IsNumber } from "class-validator";
import { RefreshTokenSettingsResponseDto } from "./refresh-token-settings-response.dto";

export class SessionConfigDto extends RefreshTokenSettingsResponseDto {
  @IsBoolean()
  revokeRefreshToken: boolean;

  @IsNumber()
  refreshTokenMaxReuse: number;

  @IsNumber()
  sessionRefreshCount: number;
}

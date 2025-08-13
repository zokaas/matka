import { IsString } from "class-validator";

export class RefreshSessionRequestDto {
  @IsString()
  grant_type: string;

  @IsString()
  client_id: string;

  @IsString()
  client_secret: string;

  @IsString()
  refresh_token: string;
}

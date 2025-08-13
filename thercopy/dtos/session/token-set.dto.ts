import { IsNumber, IsOptional, IsString } from "class-validator";

export class TokenSetDto {
  @IsString()
  id_token: string;

  @IsString()
  access_token: string;

  @IsString()
  refresh_token: string;

  @IsNumber()
  @IsOptional()
  expires_in?: number;

  @IsNumber()
  @IsOptional()
  expires_at?: number;

  @IsString()
  token_type: string;

  @IsString()
  session_state: string;

  @IsString()
  scope: string;

  /*  Missing from openid tokenSet need to extend? 
    @IsNumber()
    refresh_expires_in: number; 
    @IsNumber()
    "not-before-policy": number;
  */
}

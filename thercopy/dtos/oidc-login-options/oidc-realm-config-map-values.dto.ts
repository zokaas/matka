import { IsOptional, IsString } from "class-validator";

export class OidcRealmConfigMapValuesDto {
  @IsString()
  @IsOptional()
  kc_idp_hint?: string;

  @IsString()
  @IsOptional()
  acr_values?: string;
}

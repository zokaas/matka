import { IsBoolean, IsString, ValidateIf } from "class-validator";
import { OidcRealmConfigMapValuesDto } from "./oidc-realm-config-map-values.dto";

export class OidcLoginOptionsDto extends OidcRealmConfigMapValuesDto {
  @IsBoolean()
  session: boolean;

  @IsBoolean()
  profile: boolean;

  @IsString({ each: true })
  scope: Array<string>;

  @IsString()
  nonce: string;

  @IsString()
  state: string;

  @IsString()
  @ValidateIf((object, value) => value !== null)
  provider: string | null;

  @IsString()
  response_type: string;

  @IsString()
  lang: string;
}

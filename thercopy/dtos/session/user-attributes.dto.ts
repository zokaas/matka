import { IsOptional, IsString } from "class-validator";
import { KeycloakUserAttributesDto } from "./keycloak-user-attributes.dto";

export class UserAttributesDto extends KeycloakUserAttributesDto {
  @IsString()
  @IsOptional()
  bank?: string;

  @IsString()
  @IsOptional()
  firstname?: string;

  @IsString()
  @IsOptional()
  birthdate?: string;

  @IsString()
  @IsOptional()
  refType?: string;

  @IsString()
  @IsOptional()
  fullname?: string;

  @IsString()
  @IsOptional()
  lastname?: string;

  @IsString()
  @IsOptional()
  ref?: string;
}

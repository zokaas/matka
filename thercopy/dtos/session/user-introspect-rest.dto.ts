import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { RolesDto } from "./roles.dto";
import { Type } from "class-transformer";
import { ResourceAccessDto } from "./resource-access.dto";

export class UserIntrospectRestDto {
  @IsNumber()
  exp: number;

  @IsNumber()
  iat: number;

  @IsNumber()
  auth_time: number;

  @IsString()
  jti: string;

  @IsString()
  iss: string;

  @IsArray()
  aud: Array<string>;

  @IsString()
  typ: string;

  @IsString()
  azp: string;

  @IsString()
  sid: string;

  @IsString()
  acr: string;

  @IsArray()
  @IsOptional()
  "allowed-origins": Array<string>;

  @ValidateNested()
  @Type(() => RolesDto)
  realm_access: RolesDto;

  @ValidateNested()
  @Type(() => ResourceAccessDto)
  resource_access: ResourceAccessDto;

  @IsString()
  client_id: string;

  @IsString()
  username: string;

  @IsString()
  token_type: string;

  @IsBoolean()
  active: boolean;
}

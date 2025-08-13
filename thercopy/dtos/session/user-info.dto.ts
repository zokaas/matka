import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { UserAttributesDto } from "./user-attributes.dto";
import { Type } from "class-transformer";

export class UserInfoDto {
  @IsString()
  sub: string;

  @IsBoolean()
  email_verified: boolean;

  @IsString()
  name: string;

  @IsString()
  preferred_username: string;

  @IsOptional()
  @IsArray()
  user_roles?: Array<string>;

  @IsString()
  given_name: string;

  @IsString()
  family_name: string;

  @ValidateNested()
  @Type(() => UserAttributesDto)
  attrs: UserAttributesDto;
}

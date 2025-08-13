import { IsOptional, IsString } from "class-validator";

export class KeycloakUserAttributesDto {
  @IsString()
  @IsOptional()
  ssn?: string;

  @IsString()
  @IsOptional()
  reference?: string;
}

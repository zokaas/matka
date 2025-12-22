import { IsOptional, IsString } from "class-validator";

export class SignatoryPersonDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  reference?: string;
}

import { IsString } from "class-validator";

export class ErrorMessageAttributesDto {
  @IsString()
  error: string;

  @IsString()
  message: string;
}

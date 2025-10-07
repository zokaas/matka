import { IsString } from "class-validator";

export class ErrorMessageDto {
  @IsString()
  error: string;

  @IsString()
  message: string;
}

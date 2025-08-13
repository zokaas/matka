import { HttpStatus } from "@nestjs/common";
import { IsEnum, IsString } from "class-validator";

export class EndSessionResponseDto {
  @IsEnum(HttpStatus)
  status: HttpStatus;

  @IsString()
  message: string;
}

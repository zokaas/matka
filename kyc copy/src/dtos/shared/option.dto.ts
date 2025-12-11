import { IsNumber, IsOptional, IsString } from "class-validator";

export class OptionDto {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsString()
  value: string | number;

  @IsString()
  text: string;
}

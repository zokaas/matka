import { IsNumber, IsString } from "class-validator";

export class OptionDto {
  @IsNumber()
  id: number;

  @IsString()
  value: string;

  @IsString()
  text: string;
}

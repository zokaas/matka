import { IsString } from "class-validator";

export class OptionDto {
  @IsString()
  value: string;

  @IsString()
  text: string;
}

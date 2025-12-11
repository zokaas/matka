import { IsNumber, IsString } from "class-validator";

export class ButtonDto {
  @IsNumber()
  id: number;

  @IsString()
  next: string;

  @IsString()
  back: string;

  @IsString()
  submit: string;
}

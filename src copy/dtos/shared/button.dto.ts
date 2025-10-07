import { IsString } from "class-validator";

export class ButtonDto {
  @IsString()
  next: string;

  @IsString()
  back: string;

  @IsString()
  submit: string;
}

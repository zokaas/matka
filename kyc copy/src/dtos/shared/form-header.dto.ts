import { IsNumber, IsString } from "class-validator";

export class FormHeaderDto {
  @IsNumber()
  id: number;

  @IsString()
  title: string;

  @IsString()
  subtitle: string;
}

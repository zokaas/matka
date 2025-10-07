import { IsString } from "class-validator";

export class FormHeaderDto {
  @IsString()
  title: string;

  @IsString()
  subtitle: string;
}

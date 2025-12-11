import { IsNumber, IsOptional, IsString } from "class-validator";

export class FormHeaderDto {
  @IsNumber()
  @IsOptional()
  id?: number;

  @IsString()
  title: string;

  @IsString()
  subtitle: string;
}

import { IsString } from "class-validator";
import { ApplicationDto } from "./application.dto";

export class ApplicationCreatedViljaResponseDto extends ApplicationDto {
  @IsString()
  id: string;
}

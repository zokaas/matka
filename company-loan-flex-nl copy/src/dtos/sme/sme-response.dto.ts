import { IsString } from "class-validator";
import { SmeDto } from "./sme.dto";

export class SmeResponseDto extends SmeDto {
  @IsString()
  id: string;
}

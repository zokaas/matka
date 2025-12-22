import { IsString } from "class-validator";
import { AdminDto } from "./admin.dto";

export class BoardMemberDto extends AdminDto {
  @IsString()
  boardMemberRole: string;
}

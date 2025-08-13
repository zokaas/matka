import { Type } from "class-transformer";
import { IsNumber, ValidateNested } from "class-validator";
import { UserInfoDto } from "./user-info.dto";

export class SessionInfoResponseDto {
  @ValidateNested()
  @Type(() => UserInfoDto)
  userInfo: UserInfoDto;

  @IsNumber()
  exp: number;

  @IsNumber()
  sessionRefreshCount: number;

  @IsNumber()
  maxSessionRefresh: number;
}

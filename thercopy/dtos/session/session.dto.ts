import { ValidateNested } from "class-validator";
import { UserInfoDto } from "./user-info.dto";
import { UserIntrospectDto } from "./user-introspect.dto";
import { Type } from "class-transformer";
import { TokenSetDto } from "./token-set.dto";
import { SessionConfigDto } from "./session-config.dto";

export class SessionDto {
  @ValidateNested()
  @Type(() => TokenSetDto)
  tokenSet: TokenSetDto;

  @ValidateNested()
  @Type(() => UserInfoDto)
  userInfo: UserInfoDto;

  @ValidateNested()
  @Type(() => UserIntrospectDto)
  userIntrospect: UserIntrospectDto;

  @ValidateNested()
  @Type(() => SessionConfigDto)
  sessionConfig: SessionConfigDto;
}

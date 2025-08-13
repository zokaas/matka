import { UserInfoDto } from "./user-info.dto";
import { UserIntrospectRestDto } from "./user-introspect-rest.dto";
import { IntersectionType } from "@nestjs/swagger";

export class UserIntrospectDto extends IntersectionType(
  UserInfoDto,
  UserIntrospectRestDto
) {}

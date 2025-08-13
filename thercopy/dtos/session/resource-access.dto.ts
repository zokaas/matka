import { ValidateNested } from "class-validator";
import { RolesDto } from "./roles.dto";
import { Type } from "class-transformer";

export class ResourceAccessDto {
  @ValidateNested()
  @Type(() => RolesDto)
  broker: RolesDto;

  @ValidateNested()
  @Type(() => RolesDto)
  account: RolesDto;
}

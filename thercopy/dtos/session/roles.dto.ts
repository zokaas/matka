import { IsArray } from "class-validator";

export class RolesDto {
  @IsArray()
  roles: Array<string>;
}

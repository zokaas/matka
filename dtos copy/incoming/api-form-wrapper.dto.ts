import { Type } from "class-transformer";
import { IsInt, IsObject, ValidateNested } from "class-validator";
import { ApiFormDto } from "./api-form-attributes.dto";

export class ApiFormWrapperDto {
  @IsInt()
  id: number;

  @IsObject()
  @ValidateNested()
  @Type(() => ApiFormDto)
  attributes: ApiFormDto;
}

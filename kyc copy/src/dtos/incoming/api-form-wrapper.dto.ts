import { Type } from "class-transformer";
import { IsObject, ValidateNested } from "class-validator";
import { ApiFormDto } from "./api-form-attributes.dto";

export class ApiFormWrapperDto {
  @ValidateNested()
  @Type(() => ApiFormDto)
  data: ApiFormDto;

  @IsObject()
  meta: Record<string, unknown>;
}

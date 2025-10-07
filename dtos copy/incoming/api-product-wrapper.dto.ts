import { Type } from "class-transformer";
import { IsObject, ValidateNested } from "class-validator";
import { ApiProductDto } from "./api-product.dto";

export class ApiProductWrapperDto {
  @ValidateNested()
  @Type(() => ApiProductDataDto)
  data: ApiProductDataDto;
}

export class ApiProductDataDto {
  @IsObject()
  @ValidateNested()
  @Type(() => ApiProductDto)
  attributes: ApiProductDto;
}

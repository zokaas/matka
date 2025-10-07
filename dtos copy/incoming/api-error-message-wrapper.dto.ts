import { Type } from "class-transformer";
import { IsArray, IsNumber, ValidateNested } from "class-validator";
import { ErrorMessageDto } from "../shared";

export class ApiErrorMessageWrapperDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ApiErrorMessageDataDto)
  data: ApiErrorMessageDataDto[];
}

export class ApiErrorMessageDataDto {
  @IsNumber()
  id: number;

  @ValidateNested()
  @Type(() => ErrorMessageDto)
  attributes: ErrorMessageDto;
}

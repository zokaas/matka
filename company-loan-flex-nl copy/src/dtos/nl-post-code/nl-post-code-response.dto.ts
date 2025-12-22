import {
  IsNumber,
  IsString,
  ValidateIf,
  ValidateNested,
} from "class-validator";
import { NlPostCodeLocationDto } from "./nl-post-code-location.dto";
import { Type } from "class-transformer";

export class NlPostCodeResponseDto {
  @IsString()
  postcode: string;

  @IsNumber()
  number: number;

  @IsString()
  street: string;

  @IsString()
  city: string;

  @IsString()
  municipality: string;

  @IsString()
  province: string;

  @ValidateNested()
  @ValidateIf((object, value) => value !== null)
  @Type(() => NlPostCodeLocationDto)
  location: NlPostCodeLocationDto | null;
}

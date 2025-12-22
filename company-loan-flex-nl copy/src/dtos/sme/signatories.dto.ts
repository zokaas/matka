import { IsArray } from "class-validator";
import { SignatoryPersonsDto } from "./signatory-persons.dto";

export class SignatoriesDto {
  @IsArray()
  combinations: Array<SignatoryPersonsDto>;
}

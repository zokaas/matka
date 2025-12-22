import { IsArray } from "class-validator";
import { SignatoryPersonDto } from "./signatory-person.dto";

export class SignatoryPersonsDto {
  @IsArray()
  signatoryPersons: Array<SignatoryPersonDto>;
}

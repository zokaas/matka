import { IsString } from "class-validator";

export class ReferenceDto {
  @IsString()
  referenceType: string;

  @IsString()
  reference: string;
}

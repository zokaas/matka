import { IsString } from "class-validator";

export class BeneficialOwnerAnswerDto {
  @IsString()
  boName: string;

  @IsString()
  boSsn: string;

  @IsString()
  boOwnership: string;

  @IsString()
  boCountry: string;

  @IsString()
  boPep: string;
}

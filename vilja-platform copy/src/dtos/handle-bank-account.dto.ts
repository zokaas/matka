import { IsIn, IsString } from "class-validator";

export class HandleBankAccountDto {
  @IsIn(["IBAN", "SE-CLEARING"])
  type: string;

  @IsString()
  number: string;
}

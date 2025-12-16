import { IsString } from "class-validator";

export class BankIdAuthDto {
  @IsString()
  givenName: string;

  @IsString()
  familyName: string;

  @IsString()
  ssn: string;

  @IsString()
  iat: string;
}

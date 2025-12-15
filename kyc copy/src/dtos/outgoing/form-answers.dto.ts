import { Type } from "class-transformer";
import { IsArray, IsString, ValidateNested } from "class-validator";
import { AnswerDto } from "./answer.dto";
import { BankIdAuthDto } from "./bankid-auth.dto";

export class FormAnswersDto {
  @IsString()
  userId: string;

  @IsString()
  applicationId: string;

  @IsString()
  productId: string;

  @IsString()
  questionSetId: string;

  @IsString()
  organizationName: string;

  @IsString()
  organizationNumber: string;

  @Type(() => BankIdAuthDto)
  bankIdAuth: BankIdAuthDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnswerDto)
  answers: Array<AnswerDto>;
}

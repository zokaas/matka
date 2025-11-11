import { IsDefined, IsString } from "class-validator";
import { BeneficialOwnerAnswerDto } from "./beneficial-owner-answer.dto";

export class AnswerDto {
  @IsString()
  questionId: string;

  @IsString()
  question: string;

  @IsDefined()
  answer: string | Array<string> | Array<BeneficialOwnerAnswerDto>;
}

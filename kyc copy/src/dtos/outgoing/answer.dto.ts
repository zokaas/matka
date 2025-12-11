import { IsBoolean, IsDefined, IsString } from "class-validator";
import { BeneficialOwnerAnswerDto } from "./beneficial-owner-answer.dto";

export class AnswerDto {
  @IsString()
  questionId: string;

  @IsString()
  question: string;

  @IsBoolean()
  automaticAnalysis: boolean;

  @IsString()
  type: string | null;

  @IsDefined()
  answer: string | Array<number> | Array<string> | Array<BeneficialOwnerAnswerDto>;
}

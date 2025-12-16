import { IsBoolean, IsDefined, IsOptional, IsString } from "class-validator";
import { BeneficialOwnerAnswerDto } from "./beneficial-owner-answer.dto";

export class AnswerDto {
  @IsString()
  questionId: string;

  @IsString()
  question: string;

  @IsBoolean()
  automaticAnalysis: boolean;

  @IsOptional()
  @IsString()
  type?: string;

  @IsDefined()
  answer:
    | string
    | number
    | Array<number | string>
    | Array<BeneficialOwnerAnswerDto>
    | boolean;
}

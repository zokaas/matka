import {
  IsInt,
  IsOptional,
  IsString,
  IsObject,
  IsArray,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { QuestionDto } from "./question.dto";

export class KycFormDto {
  @IsInt()
  id: number;

  @IsString()
  product: string;

  @IsString()
  formType: string;

  @IsObject()
  steps: {
    step1: string;
    step2: string;
    step3: string;
  };

  @IsObject()
  button: {
    next: string;
    back: string;
    submit: string;
  };

  @IsObject()
  footer: {
    customerServiceLabel: string;
    customerServiceText: string;
    contactInfoLabel: string;
    contactInfoText: string;
    addressLabel: string;
    addressText: string;
  };

  @IsOptional()
  @IsObject()
  formHeader?: {
    title: string;
    subtitle: string;
  };

  @IsObject()
  companyBlock: {
    companyName: string;
    orgNumber: string;
  };

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  questions: Array<QuestionDto>;
}

import {
  IsString,
  IsOptional,
  IsArray,
  IsNumber,
  ValidateNested,
} from "class-validator";
import {
  BeneficialOwnerDto,
  CountryOptionsDto,
  DependentQuestionDto,
  DynamicFieldDto,
  DynamicFieldUnion,
  InfoDto,
  OptionDto,
} from "../shared";
import { Type } from "class-transformer";
import { ErrorMessageAttributesDto } from "./error-message-attributes.dto";

export class QuestionAttributesDto {
  @IsString()
  questionLabel: string;

  @IsString()
  componentType: string;

  @IsNumber()
  step: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OptionDto)
  options?: Array<OptionDto>;

  @IsOptional()
  @IsString()
  placeholder?: string;

  @IsString()
  questionParameter: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ErrorMessageAttributesDto)
  errorMessages: Array<ErrorMessageAttributesDto>;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DynamicFieldDto, {
    discriminator: {
      property: "__component",
      subTypes: [
        { value: DependentQuestionDto, name: "kyc.dependent-question" },
        { value: InfoDto, name: "kyc.info" },
        { value: BeneficialOwnerDto, name: "kyc.beneficial-owner" },
        { value: CountryOptionsDto, name: "kyc.country-options" },
      ],
    },
    keepDiscriminatorProperty: true,
  })
  dynamicField: Array<DynamicFieldUnion>;
}

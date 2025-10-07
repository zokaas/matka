import { Injectable, Logger } from "@nestjs/common";
import {
  ApiFormWrapperDto,
  KycFormDto,
  ApiQuestionComponentDto,
  QuestionDto,
  DynamicFieldUnion,
  ErrorMessageDto,
  OptionDto,
  CountrylistAttributesDto,
} from "../dtos";

@Injectable()
export class KycFormParser {
  private readonly logger = new Logger(KycFormParser.name);

  private static readonly productIdToLang: Record<string, "fi" | "se" | "nl"> =
    {
      "sweden-b2b-application": "se",
      "finland-b2b-application": "fi",
      "netherlands-b2b-application": "nl",
    };

  parseCountryList(
    response: Array<string>,
    productId: string
  ): Array<OptionDto> {
    const lang = KycFormParser.productIdToLang[productId] ?? "en";

    const parsedCountries: Array<OptionDto> = response.map((entry) => {
      try {
        const country: CountrylistAttributesDto = JSON.parse(entry);
        return {
          value: country.attributes.en,
          text: country.attributes[lang] || country.attributes.en,
        };
      } catch (error) {
        this.logger.error("Critical parsing error:", error);
        return {
          value: "[Invalid Country]",
          text: "[Invalid Country]",
        };
      }
    });

    return parsedCountries.sort((a, b) => a.text.localeCompare(b.text, lang));
  }
  //TODO: Transform data with NestJs Pipes
  parseProductData(
    apiResponse: ApiFormWrapperDto,
    productId: string
  ): KycFormDto {
    try {
      const attributes = apiResponse?.attributes;
      const productAttributes = attributes?.product?.data?.attributes;

      if (!attributes || !productAttributes) {
        throw new Error("Missing required attributes from api kyc response");
      }

      return {
        id: apiResponse.id,
        product: productAttributes?.product,
        formType: attributes?.formType,
        steps: {
          step1: productAttributes?.steps?.step1,
          step2: productAttributes?.steps?.step2,
          step3: productAttributes?.steps?.step3,
        },
        button: {
          next: productAttributes?.button?.next,
          back: productAttributes?.button?.back,
          submit: productAttributes?.button?.submit,
        },
        footer: {
          customerServiceLabel: productAttributes?.footer?.customerServiceLabel,
          customerServiceText: productAttributes?.footer?.customerServiceText,
          contactInfoLabel: productAttributes?.footer?.contactInfoLabel,
          contactInfoText: productAttributes?.footer?.contactInfoText,
          addressLabel: productAttributes?.footer?.addressLabel,
          addressText: productAttributes?.footer?.addressText,
        },
        companyBlock: {
          companyName: productAttributes?.companyBlock?.companyName,
          orgNumber: productAttributes?.companyBlock?.orgNumber,
        },
        formHeader: {
          title: attributes.formHeader.title,
          subtitle: attributes.formHeader.subtitle,
        },
        questions: this.parseQuestions(attributes?.setOfQuestions, productId),
      };
    } catch (error) {
      this.logger.error(`Failed to parse product data for ${productId}`, error);
      throw new Error(`Invalid product data structure: ${error.message}`);
    }
  }

  private parseQuestions(
    setOfQuestions: Array<ApiQuestionComponentDto> | undefined,
    productId: string
  ): Array<QuestionDto> {
    if (!Array.isArray(setOfQuestions)) {
      this.logger.warn(`No questions found for product ${productId}`);
      return [];
    }

    const lang = KycFormParser.productIdToLang[productId];
    const questions: Array<QuestionDto> = [];

    for (const questionComponent of setOfQuestions) {
      try {
        const questionAttributes = this.getQuestionAttributes(
          questionComponent,
          lang
        );

        if (!questionAttributes) {
          this.logger.warn(
            `No attributes found for question ${questionComponent.id} in language ${lang}`
          );
          continue;
        }

        const errorMessages: ErrorMessageDto[] =
          questionAttributes.errorMessages?.data?.map(
            (errorData: ApiErrorMessageDataDto) => ({
              error: errorData.attributes.error,
              message: errorData.attributes.message,
            })
          ) ?? [];

        questions.push({
          id: questionComponent.id,
          question: {
            questionLabel: questionAttributes.questionLabel,
            componentType: questionAttributes.componentType,
            step: questionComponent.step,
            options: questionAttributes.options,
            placeholder: questionAttributes.placeholder,
            questionParameter: questionAttributes.questionParameter,
            errorMessages: errorMessages.length > 0 ? errorMessages : undefined,
            dynamicField: (questionAttributes.dynamicField ??
              []) as DynamicFieldUnion[],
          },
        });
      } catch (error) {
        this.logger.error(
          `Failed to parse question ${questionComponent.id}`,
          error
        );
      }
    }
    return questions;
  }

  private getQuestionAttributes(
    questionComponent: ApiQuestionComponentDto,
    lang: "fi" | "se" | "nl"
  ) {
    const languageMap = {
      se: questionComponent.questions_se?.data?.attributes,
      fi: questionComponent.questions_fi?.data?.attributes,
      nl: questionComponent.questions_nl?.data?.attributes,
    };
    return languageMap[lang];
  }
}

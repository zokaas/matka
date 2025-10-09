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
          value: country.en,
          text: country[lang] || country.en,
        } as OptionDto;
      } catch (error) {
        this.logger.error("Critical parsing error:", error);
        return {
          value: "[Invalid Country]",
          text: "[Invalid Country]",
        } as OptionDto;
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
      const formData = apiResponse.data;
      const productData = formData.product;

      if (!formData || !productData) {
        throw new Error("Missing required attributes from api kyc response");
      }

      return {
        id: formData.id,
        product: productData.product,
        formType: formData.formType,
        steps: {
          step1: productData.steps.step1,
          step2: productData.steps.step2,
          step3: productData.steps.step3,
        },
        button: {
          next: productData.button.next,
          back: productData.button.back,
          submit: productData.button.submit,
        },
        footer: {
          customerServiceLabel: productData.footer.customerServiceLabel,
          customerServiceText: productData.footer.customerServiceText,
          contactInfoLabel: productData.footer.contactInfoLabel,
          contactInfoText: productData.footer.contactInfoText,
          addressLabel: productData.footer.addressLabel,
          addressText: productData.footer.addressText,
        },
        companyBlock: {
          companyName: productData.companyBlock.companyName,
          orgNumber: productData.companyBlock.orgNumber,
        },
        formHeader: {
          title: formData.formHeader.title,
          subtitle: formData.formHeader.subtitle,
        },
        questions: this.parseQuestions(formData.setOfQuestions, productId),
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

        const errorMessages: ErrorMessageDto[] = Array.isArray(
          questionAttributes.errorMessages
        )
          ? questionAttributes.errorMessages
          : [];

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
      se: questionComponent.questions_se,
      fi: questionComponent.questions_fi,
      nl: questionComponent.questions_nl,
    };
    return languageMap[lang];
  }
}

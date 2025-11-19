import { Injectable, Logger } from "@nestjs/common";
import {
  KycFormDto,
  ApiQuestionComponentDto,
  QuestionDto,
  DynamicFieldUnion,
  OptionDto,
  CountrylistAttributesDto,
  ApiFormDto,
  ErrorMessageDto,
} from "../dtos";

@Injectable()
export class KycFormParser {
  private readonly logger = new Logger(KycFormParser.name);

  private getLang(productId: string): "fi" | "se" {
    const PRODUCT_LANG: Record<string, "fi" | "se"> = {
      "sweden-b2b-application": "se",
      "finland-b2b-application": "fi",
    };

    return PRODUCT_LANG[productId];
  }

  parseCountryList(
    response: Array<string>,
    productId: string
  ): Array<OptionDto> {
    const lang = this.getLang(productId);

    const parsedCountries: Array<OptionDto> = response.map((entry) => {
      try {
        const country: CountrylistAttributesDto = JSON.parse(entry);
        return {
          value: country.en,
          text: country[lang] || country.en,
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

  parseProductData(apiResponse: ApiFormDto, productId: string): KycFormDto {
    try {
      const formData = apiResponse;
      const productData = formData.product;

      if (!formData || !productData) {
        throw new Error("Missing required attributes from api kyc response");
      }

      return {
        id: formData.id,
        product: productData.product,
        formType: formData.formType,
        redirectUrl: productData.redirectUrl,
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
        sessionModal: {
          refreshTitle: productData.sessionModal.refreshTitle,
          refreshDescription: productData.sessionModal.refreshDescription,
          continueSessionButton: productData.sessionModal.continueSessionButton,
          expiredTitle: productData.sessionModal.expiredTitle,
          expiredDescription: productData.sessionModal.expiredDescription,
          loginButton: productData.sessionModal.loginButton,
          logoutButton: productData.sessionModal.logoutButton,
        },
        setOfQuestions: this.parseQuestions(formData.setOfQuestions, productId),
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

    const lang = this.getLang(productId);
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

        questions.push({
          id: questionComponent.id,
          question: {
            questionLabel: questionAttributes.questionLabel,
            componentType: questionAttributes.componentType,
            step: questionComponent.step,
            options: questionAttributes.options,
            placeholder: questionAttributes.placeholder,
            questionParameter: questionAttributes.questionParameter,
            errorMessages: this.cleanErrorMessages(
              questionAttributes.errorMessages
            ),
            dynamicField: this.cleanDynamicFields(
              questionAttributes.dynamicField
            ),
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

  private getQuestionAttributes(q: ApiQuestionComponentDto, lang: "fi" | "se") {
    return {
      se: q.questions_se,
      fi: q.questions_fi,
    }[lang];
  }

private cleanDynamicFields(
  fields?: DynamicFieldUnion[]
): DynamicFieldUnion[] {
  if (!Array.isArray(fields)) return [];

  return fields.map((field): DynamicFieldUnion => {
    if (!field || typeof field !== "object") return field;

    const hasErrorMessages =
      "errorMessages" in field && Array.isArray(field.errorMessages);

    return {
      ...field,
      __component: this.cleanComponentName(field.__component),
      ...(hasErrorMessages && {
        errorMessages: this.cleanErrorMessages(field.errorMessages),
      }),
    };
  });
}


  private cleanErrorMessages(
    messages?: Array<ErrorMessageDto>
  ): Array<ErrorMessageDto> {
    if (!Array.isArray(messages) || messages.length === 0) return undefined;

    return messages.map(({ error, message }) => ({
      error,
      message,
    }));
  }
}

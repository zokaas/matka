import { Injectable, Logger } from "@nestjs/common";
import {
  KycFormDto,
  ApiQuestionComponentDto,
  QuestionDto,
  DynamicFieldUnion,
  OptionDto,
  ApiFormDto,
  ErrorMessageDto,
  DynamicFieldDto,
  DependentQuestionDto,
} from "../dtos";
import { LanguageConfig } from "./language-config";

@Injectable()
export class KycFormParser {
  private readonly logger = new Logger(KycFormParser.name);

  parseCountryList(
    response: Array<OptionDto | string>,
    productId: string
  ): Array<OptionDto> {
    const lang = LanguageConfig.getCountryLocale(productId);

    const countries = response.map((item) =>
      typeof item === "string" ? (JSON.parse(item) as OptionDto) : item
    );

    return countries.sort((a, b) => a.text.localeCompare(b.text, lang));
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
        loginUrl: productData.loginUrl,
        kycDoneUrl: productData.kycDoneUrl,
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

    const lang = LanguageConfig.getQuestionLang(productId);
    const questions: Array<QuestionDto> = [];

    for (const questionComponent of setOfQuestions) {
      try {
        const questionAttributes =
          lang === "se"
            ? questionComponent.questions_se
            : questionComponent.questions_fi;

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
            calculateAnswer: questionAttributes.calculateAnswer,
            automaticAnalysis: questionAttributes.automaticAnalysis,
            automaticAnalysisType: this.convertAnalysisType(
              questionAttributes.automaticAnalysisType
            ),
            options: questionAttributes.options,
            placeholder: questionAttributes.placeholder,
            questionParameter:
              questionAttributes.questionParameter ||
              questionAttributes.hiddenInputQuestionParameter,
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

  private cleanDynamicFields(
    fields?: Array<DynamicFieldDto>
  ): Array<DynamicFieldUnion> {
    if (!Array.isArray(fields)) return [];

    return fields.map((field) => {
      const cleaned = {
        ...field,
        __component: this.cleanComponentName(field.__component),
      };
      const isDependentQuestion =
        field.__component.includes("dependent-question");

      if (isDependentQuestion) {
        const depQuestion = field as unknown as DependentQuestionDto;
        return {
          ...cleaned,
          errorMessages: this.cleanErrorMessages(depQuestion.errorMessages),
          automaticAnalysisType: this.convertAnalysisType(
            depQuestion.automaticAnalysisType
          ),
        } as DynamicFieldUnion;
      }

      return cleaned as DynamicFieldUnion;
    });
  }

  // clean out kyc.xxx-se or kyc.xxx-fi to kyc.xxx
  private cleanComponentName(component?: string): string {
    if (!component || typeof component !== "string") return "";
    return component.replace(/-(se|fi)$/i, "");
  }

  // clean out metadata for error messages
  private cleanErrorMessages(
    messages?: Array<ErrorMessageDto>
  ): Array<ErrorMessageDto> {
    if (!Array.isArray(messages) || messages.length === 0) return [];

    return messages.map(({ error, message }) => ({
      error,
      message,
    }));
  }

  // convert analysis type to match risk analysis tool (cm1)
  private convertAnalysisType(analysisType: string | undefined): string {
    if (!analysisType || typeof analysisType !== "string") {
      return analysisType;
    }

    const normalized = analysisType.trim();

    switch (normalized) {
      case "True/False":
        return "Boolean";
      case "Number":
        return "Int";
      case "String":
        return "String";
      default:
        return analysisType;
    }
  }
}

import { Injectable, Logger } from "@nestjs/common";
import {
    ApiQuestionComponentDto,
    CountrylistAttributesDto,
    ApiFormDto,
    KycFormDto,
    OptionDto,
} from "../dtos";

@Injectable()
export class KycFormParser {
    private readonly logger = new Logger(KycFormParser.name);

    private static readonly productIdToLang: Record<string, "fi" | "se"> = {
        "sweden-flex-online": "se",
        "sweden-flex-application": "se",
        "sweden-b2b-application": "se", // added for completeness
        "finland-b2b-application": "fi",
    };

    /**
     * Parse country list from API response
     */
    parseCountryList(response: Array<string>, productId: string): Array<OptionDto> {
        const lang = KycFormParser.productIdToLang[productId] ?? "en";

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

    /**
     * Parse and normalize full KYC form data
     */
    parseProductData(apiResponse: ApiFormDto, productId: string): KycFormDto {
        try {
            const formData = apiResponse;
            const productData = formData.product;

            if (!formData || !productData) {
                throw new Error("Missing required attributes from api kyc response");
            }

            this.logger.log(`Cleaning API data for: ${productId}`);

            const lang = KycFormParser.productIdToLang[productId] || "se";

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
                sessionModal: {
                    refreshTitle: productData.sessionModal.refreshTitle,
                    refreshDescription: productData.sessionModal.refreshDescription,
                    continueSessionButton: productData.sessionModal.continueSessionButton,
                    expiredTitle: productData.sessionModal.expiredTitle,
                    expiredDescription: productData.sessionModal.expiredDescription,
                    loginButton: productData.sessionModal.loginButton,
                    logoutButton: productData.sessionModal.logoutButton,
                },
                questions: this.cleanQuestions(formData.setOfQuestions, lang),
            };
        } catch (error: any) {
            this.logger.error(`Failed to clean API data for ${productId}`, error);
            throw new Error(`Invalid API data structure: ${error.message}`);
        }
    }

    /**
     * Normalize questions and dynamic fields
     */
    private cleanQuestions(
        setOfQuestions: Array<ApiQuestionComponentDto> | undefined,
        lang: "fi" | "se" | "nl"
    ): KycFormDto["questions"] {
        if (!Array.isArray(setOfQuestions)) {
            this.logger.warn(`No questions found`);
            return [];
        }

        const questions: KycFormDto["questions"] = [];

        for (const questionComponent of setOfQuestions) {
            try {
                const attrs = this.getQuestionForLang(questionComponent, lang);
                if (!attrs) {
                    this.logger.warn(
                        `No attributes for question ${questionComponent.id} in ${lang}`
                    );
                    continue;
                }

                const errorMessages = attrs.errorMessages?.map((msg) => ({
                    error: msg.error,
                    message: msg.message,
                }));

                const options = attrs.options?.map((opt) => ({
                    text: opt.text,
                    value: String(opt.value),
                }));

                const dynamicField = this.normalizeDynamicFields(attrs.dynamicField);

                questions.push({
                    id: questionComponent.id,
                    question: {
                        questionLabel: attrs.questionLabel,
                        componentType: attrs.componentType,
                        step: questionComponent.step,
                        options,
                        placeholder: attrs.placeholder || undefined,
                        questionParameter: attrs.questionParameter,
                        errorMessages,
                        dynamicField,
                    },
                });

                this.logger.debug(
                    `Cleaned question ${questionComponent.id}: ${attrs.questionParameter}`
                );
            } catch (error) {
                this.logger.error(`Failed to clean question ${questionComponent.id}`, error);
            }
        }

        return questions;
    }

    /**
     * Extract and normalize dynamic fields
     */
    private normalizeDynamicFields(dynamicFields?: any[]) {
        if (!Array.isArray(dynamicFields)) return [];

        return dynamicFields.map((f) => {
            const base = String(f.__component || "").replace(/-(se|fi|nl)$/i, "");
            const id = String(f.id ?? "");

            if (base === "kyc.dependent-question") {
                return {
                    id,
                    __component: "kyc.dependent-question",
                    conditionValue: String(f.conditionValue),
                    questionLabel: f.questionLabel,
                    componentType: f.componentType,
                    placeholder: f.placeholder || undefined,
                    questionParameter: f.questionParameter,
                    questionDescription: f.questionDescription || undefined,
                    options: (f.options || []).map((opt: any) => ({
                        text: opt.text,
                        value: String(opt.value),
                    })),
                    useCountryList: Boolean(f.useCountryList),
                    errorMessages: (f.errorMessages || []).map((msg: any) => ({
                        error: msg.error,
                        message: msg.message,
                    })),
                };
            }

            if (base === "kyc.beneficial-owner") {
                return {
                    id,
                    __component: "kyc.beneficial-owner",
                    nameParameter: f.nameParameter || null,
                    namePlaceholder: f.namePlaceholder || undefined,
                    nameQuestion: f.nameQuestion || null,
                    ssnParameter: f.ssnParameter || null,
                    ssnPlaceholder: f.ssnPlaceholder || undefined,
                    ssnQuestion: f.ssnQuestion || null,
                    ownershipParameter: f.ownershipParameter || null,
                    ownershipPlaceholder: f.ownershipPlaceholder || undefined,
                    ownershipQuestion: f.ownershipQuestion || null,
                    countryParameter: f.countryParameter || null,
                    countryPlaceholder: f.countryPlaceholder || undefined,
                    countryQuestion: f.countryQuestion || null,
                    useCountryList: Boolean(f.useCountryList),
                    addBObutton: f.addBObutton || null,
                };
            }

            if (base === "kyc.country-options") {
                return {
                    id,
                    __component: "kyc.country-options",
                    useCountryList: Boolean(f.useCountryList),
                };
            }

            if (base === "kyc.info") {
                return {
                    id,
                    __component: "kyc.info",
                    componentType: f.componentType || undefined,
                    infoHeader: f.title || f.infoHeader || undefined,
                    infoDescription: f.text || f.infoDescription || undefined,
                };
            }

            this.logger.warn(`Unknown dynamic component: ${f.__component}`);
            return { id, __component: base, ...f };
        });
    }

    private getQuestionForLang(
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

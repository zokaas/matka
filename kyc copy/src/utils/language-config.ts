/**
 * Language config for KYC parsing
 * Maps product ids to locale codes for correct countrylist
 */

export type QuestionLang = "fi" | "se";
export type CountryLocale = "fis" | "ses";

export class LanguageConfig {
  private static readonly PRODUCT_QUESTION_LANG: Record<string, QuestionLang> =
    {
      "sweden-b2b-application": "se",
      "finland-b2b-application": "fi",
    };

  private static readonly PRODUCT_COUNTRY_LOCALE: Record<
    string,
    CountryLocale
  > = {
    "sweden-b2b-application": "ses",
    "finland-b2b-application": "fis",
  };

  static getQuestionLang(productId: string): QuestionLang {
    return this.PRODUCT_QUESTION_LANG[productId] ?? "se";
  }

  static getCountryLocale(productId: string): CountryLocale {
    return this.PRODUCT_COUNTRY_LOCALE[productId] ?? "ses";
  }
}

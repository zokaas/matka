import { defineMessages } from "react-intl";

export const messages = defineMessages({
  overdueTitle: {
    id: "flex-online-se-kyc-modal-overdue-title",
    defaultMessage: "Viktigt: Dina KYC-uppgifter måste uppdateras",
  },
  overdueMessage: {
    id: "flex-online-se-kyc-modal-overdue-message",
    defaultMessage:
      "Ditt konto har begränsningar eftersom din KYC-information inte har uppdaterats i tid. Du kan inte göra uttag förrän du har slutfört uppdateringen.",
  },
  dueDateLabel: {
    id: "flex-online-se-kyc-modal-due-date-label",
    defaultMessage: "Förfallodatum:",
  },
  kycTitle: {
    id: "flex-online-se-kyc-modal-kyc-title",
    defaultMessage: "Uppdatera dina KYC-uppgifter",
  },
  dueDateWarningMessage: {
    id: "flex-online-se-kyc-modal-due-date-warning-message",
    defaultMessage:
      "För att fortsätta använda alla funktioner i ditt konto behöver du uppdatera dina KYC-uppgifter (Know Your Customer). Detta är ett lagkrav för att vi ska kunna erbjuda våra tjänster.",
  },
  kycReasonMessage: {
    id: "flex-online-se-kyc-modal-kyc-reason-message",
    defaultMessage:
      "Vi är enligt lag skyldiga att verifiera kunders identitet (KYC) för att förebygga bedrägerier, penningtvätt och annan finansiell brottslighet.",
  },
  creditConsentLabel: {
    id: "flex-online-se-kyc-modal-credit-consent-label",
    defaultMessage: "Samtycke till att hämta kreditupplysning",
  },

  updateNowButton: {
    id: "flex-online-se-kyc-modal-update-now-button",
    defaultMessage: "Uppdatera uppgifter nu",
  },
  remindLaterButton: {
    id: "flex-online-se-kyc-modal-remind-later-button",
    defaultMessage: "Påminn mig senare",
  },
});

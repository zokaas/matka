import { z } from "zod";

import { namesValidation, validationsSE } from "@opr-finance/features";
import { T_FormSchema } from "./types";
import { isKYCServiceEnabled } from "../utils";

let guarantorSelf: boolean;
let guarantorOther: boolean;

const organizationNumber = z
    .string()
    .min(1, { message: "Ange ett organisationsnummer" })
    .max(11, {
        message: "Organisationsnummer du har angett är i fel format",
    })
    .refine((val) => validationsSE.isValidSwedishOrgNumber(val), {
        message: "Organisationsnummer du har angett är i fel format",
    });

const loanAmount = z.string().min(1, { message: "Ange ett lånebelopp" });
const repaymentPeriod = z
    .string()
    .min(1, { message: "Välj återbetalningstid" })
    .refine((val) => val != "", { message: "Välj återbetalningstid" });

const kycFields = !isKYCServiceEnabled()
    ? {
          loanPurpose: z
              .string()
              .min(1, { message: "Ange syfte med lånet" })
              .refine((val) => val !== "" || val !== null, { message: "Ange syfte med lånet" }),

          loanPurposeDescription: z
              .string()
              .min(1, { message: "Ange en mer detaljerad beskrivning av syftet med lånet" })
              .refine((val) => val !== "" || val !== null, {
                  message: "Ange en mer detaljerad beskrivning av syftet med lånet",
              }),

          PEP: z
              .string()
              .min(1, { message: "Välj ett alternativ i listan" })
              .refine((val) => val !== "" || val !== null, {
                  message: "Välj ett alternativ i listan",
              }),
      }
    : {};

const campaignCode = z.string();

const streetAddress = z
    .string({ required_error: "" })
    .min(1, { message: "Ange adress" })
    .refine((val) => val != "", { message: "Ange adress" });

const zipCode = z
    .string({ required_error: "" })
    .trim()
    .min(1, { message: "Ange postnummer" })
    .refine((val) => validationsSE.isValidZipcode(val), {
        message: "Endast siffror är tillåtna",
    });

const city = z
    .string({ required_error: "" })
    .min(1, { message: "Ange ort" })
    .refine((val) => namesValidation.isValidName(val), {
        message: "Endast bokstäver är tillåtna",
    });

const disburismentAccount = z
    .string()
    .min(7, { message: "Ange kontonummer för utbetalning av ditt lån" })
    .refine((val) => validationsSE.isValidSwedishIBAN(val), {
        message: "Kontonumret du har angett är i fel format",
    });

const applicantName = z
    .string()
    .min(1, { message: "Ange sökandes namn" })
    .refine((val) => namesValidation.isValidName(val), { message: "Endast bokstäver är tillåtna" });

const ssn = z
    .string()
    .min(1, { message: "Ange personnummer på sökande" })
    .refine((val) => validationsSE.isValidSwedishSSN(val), {
        message: "Personnummer angivet i fel format ",
    });

export const emailAddress = z
    .string({ required_error: "" })
    .min(1, { message: "Ange mailadress" })
    .email({ message: "Mailadress angiven i fel format" });

const applicantPhone = z
    .string({ required_error: "" })
    .min(1, { message: "Ange telefonnummer" })
    .refine((val) => validationsSE.isValidPhoneNumberSe(val), {
        message: "Telefonnummer angivet i fel format",
    });

const allowMarketing = z.boolean();

const businessCheck = z.boolean().refine((val) => val, {
    message:
        "För att gå vidare med ansökan behöver du godkänna att vi behandlar dina personuppgifter och tillåter oss att göra en korrekt kreditbedömning.",
});

const processFirstGuarantor = (val: boolean, field: string) => {
    if (field === "selfGuarantor") guarantorSelf = val;
    else guarantorOther = val;
    if (!val && !guarantorSelf && !guarantorOther) {
        return false;
    } else {
        return true;
    }
};

const selfGuarantor = z
    .boolean()
    .refine((val) => processFirstGuarantor(val, "selfGuarantor") !== false, {
        message: "Ange en borgensman",
    });

const otherAsFirstGuarantor = z
    .boolean()
    .refine((val) => processFirstGuarantor(val, "otherGuarantor") !== false, {
        message: "Ange en borgensman",
    });

const guarantorName = z
    .string({ required_error: "Ange namn på borgensmannen" })
    .min(1, { message: "Ange namn på borgensmannen" })
    .refine((val) => namesValidation.isValidName(val), { message: "Endast bokstäver är tillåtna" });

const guarantorEmail = z
    .string({ required_error: "Ange en mailaddress till borgensmannen" })
    .min(1, { message: "Ange en mailaddress till borgensmannen" })
    .email({ message: "Mailadress angiven i fel format" });

const guarantorPhone = z
    .string({ required_error: "Ange telefonnummer till borgensmannen" })
    .min(1, { message: "Ange telefonnummer till borgensmannen" })
    .refine((val) => validationsSE.isValidPhoneNumberSe(val), {
        message: "Telefonnummer angivet i fel format",
    });

const secondGuarantorName = z
    .string()
    .min(1, { message: "Ange namn på borgensmannen" })
    .refine((val) => namesValidation.isValidName(val), { message: "Endast bokstäver är tillåtna" });

const secondGuarantorEmail = z
    .string()
    .min(1, { message: "Ange mailadress till borgensmannen" })
    .email({ message: "Mailadress angiven i fel format" });

const secondGuarantorPhone = z
    .string()
    .min(1, { message: "Ange telefonnummer till borgensmannen" })
    .refine((val) => validationsSE.isValidPhoneNumberSe(val), {
        message: "Telefonnummer angivet i fel format",
    });

const attachments = z.array(z.object({}));
const invoiceDueDate = z
    .number()
    .min(1, { message: "Du måste välja ett förfallodatum" })
    .max(28, { message: "Du måste välja ett förfallodatum" });

export const schemas: T_FormSchema = {
    organizationNumber,
    loanAmount,
    repaymentPeriod,
    ...kycFields,
    campaignCode,
    streetAddress,
    zipCode,
    city,
    disburismentAccount,
    applicantName,
    ssn,
    emailAddress,
    applicantPhone,
    businessCheck,
    selfGuarantor,
    otherAsFirstGuarantor,
    guarantorName,
    guarantorEmail,
    guarantorPhone,
    secondGuarantorName,
    secondGuarantorEmail,
    secondGuarantorPhone,
    attachments,
    allowMarketing,
    invoiceDueDate,
};

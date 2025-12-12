import { T_FormFields } from "../hooks/types";
import { getAttachmentsData } from "@opr-finance/features/file-upload-handler";
import { T_ApplicationData } from "../types";
import { getTrackingData } from "./trackingUtils";
import { isProduction } from "./getEnvironment";

export const applicationMapper = async (
    data: T_FormFields,
    secondGuarantorVisible: boolean,
    clientApplicationId: string
): Promise<T_ApplicationData> => {
    const {
        applicationUuid,
        loanAmount,
        invoiceDueDate,
        loanPurpose,
        loanPurposeDescription,
        repaymentPeriod,
        campaignCode,
        businessId,
        companyName,
        streetAddress,
        zipCode,
        city,
        disburismentAccount,
        businessSector,
        applicantName,
        ssn,
        emailAddress,
        applicantPhone,
        businessCheck,
        PEP,
        allowMarketing,
        selfGuarantor,
        attachments,
        source,
        subsource,
        redirect_id,
    } = data;
    const { gaClientId, gaSessionId } = await getTrackingData();

    return {
        applicationUuid,
        amount: Number(loanAmount.replace(/\D/g, "")),
        desiredDueDate: invoiceDueDate,
        loanReason: loanPurpose,
        loanPurposeDescription,
        maturity: Number(repaymentPeriod.replace(" månader", "")),
        campaignCode,
        company: {
            organizationNumber: businessId.replace(/-|\s/g, ""),
            name: companyName,
            streetAddress,
            zipCode: zipCode.replace(/\s/g, ""),
            city,
            accountNumber: disburismentAccount,
            businessSector,
        },
        applicant: {
            name: applicantName,
            ssn,
            email: emailAddress,
            phoneNumber: applicantPhone,
            creditCheck: businessCheck,
            pep: PEP === "Ja",
            marketingPermission: allowMarketing,
            selfGuarantor,
        },
        guarantors: setGuarantors(data, secondGuarantorVisible),
        attachments: await getAttachmentsData(attachments || []),
        source,
        subsource: subsource ?? "",
        redirectId: redirect_id ?? "",
        ip: "",
        gaTransactionId: clientApplicationId,
        timestamp: (Date.now() * 1000).toString(),
        production: isProduction,
        gaClientId,
        gaSessionId,
    };
};

const setGuarantors = (data: T_FormFields, secondGuarantorVisible: boolean) => {
    const {
        selfGuarantor,
        applicantName,
        guarantorName,
        emailAddress,
        guarantorEmail,
        applicantPhone,
        guarantorPhone,
        ssn,
        secondGuarantorName,
        secondGuarantorPhone,
        secondGuarantorEmail,
    } = data;
    return {
        firstGuarantor: {
            applicantAsFirstGuarantor: selfGuarantor,
            name: selfGuarantor ? applicantName : guarantorName,
            email: selfGuarantor ? emailAddress : guarantorEmail,
            phone: selfGuarantor ? applicantPhone : guarantorPhone,
            ...(selfGuarantor && { ssn: ssn }),
        },
        ...(secondGuarantorVisible && {
            secondGuarantor: {
                name: secondGuarantorName,
                phone: secondGuarantorPhone,
                email: secondGuarantorEmail,
            },
        }),
    };
};

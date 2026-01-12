import { sendGAEvent } from "@opr-finance/utils";
import { T_AnalyticsPayload } from "../types/analytics";

export function sendAnalyticsEvents(payload: T_AnalyticsPayload) {
    const {
        applicantEmail,
        applicantPhoneNumber,
        applicantName,
        amount,
        applicationId,
        productName,
        campaignCode,
    } = payload;

    // Applicant-level event
    sendGAEvent({
        applicantEmail,
        applicantPhoneNumber,
        applicantName,
        amount,
    });

    // Business credit application event
    // TODO: should it be separated event? "... partner"/ "....rescoring"?
    sendGAEvent({
        event: "submit_application_business_credit",
        credit_limit: Number(amount),
        application_id: applicationId,
        promotional_code: campaignCode,
    });

    // Purchase event
    sendGAEvent({ ecommerce: null });
    // TODO: should it be separated event? "... partner"/ "....rescoring"?
    sendGAEvent({
        event: "purchase",
        ecommerce: {
            transaction_id: applicationId,
            value: Number(amount),
            currency: "EUR",
            items: [
                {
                    item_id: "BC_1",
                    item_name: productName,
                    price: Number(amount),
                    quantity: 1,
                },
            ],
        },
    });
}

export const onPageFullyLoaded = () => {
    sendGAEvent({ event: "start" });
    // Push Data Layer event when a visitor visit a page or the page reloads.
    sendGAEvent({ event: "pageview" });
};

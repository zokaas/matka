import { T_ApplicationPayload } from "../types/general";

const productName = process.env.REACT_APP_GA4_PRODUCT_NAME ?? "";

export const createDataLayerEventSubmit = (data: T_ApplicationPayload) => {
    const promotionalCode =
        data.campaignCode.trim().length > 0 ? data.campaignCode : "No promotional code";
    const event = {
        event: "submit_application_business_credit",
        credit_limit: Number(data.amount),
        loan_purpose: data.reason,
        application_id: data.clientApplicationId,
        promotional_code: promotionalCode,
        product: productName,
    };
    return event;
};

export const createDataLayerEventPurchase = (data: T_ApplicationPayload) => {
    const event = {
        event: "purchase",
        ecommerce: {
            transaction_id: data.clientApplicationId,
            value: Number(data.amount),
            currency: "SEK",
            product: productName,
            items: [
                {
                    item_id: "BC_1",
                    item_name: productName,
                    price: Number(data.amount),
                    quantity: 1,
                },
            ],
        },
    };
    return event;
};

import { T_ApplicationSent, T_BaseApplicant } from "../types/general";
import {
    buildBaseApplicantName,
    normalizeAmount,
    T_TrackingPayloadClean,
} from "./applicationMapper";
import { T_AnalyticsPayload } from "../types/analytics";
import { T_TrackingPayload } from "@opr-finance/utils";

type SubmitOptions<T_Input extends T_BaseApplicant, T_Mapped> = {
    mapper: (data: T_Input) => Promise<T_Mapped & T_TrackingPayload>;
    sender: (mappedData: T_Mapped) => Promise<T_ApplicationSent>;
    analytics?: (payload: T_AnalyticsPayload) => void;
    conversion?: (amount: string) => void;
    onCompleted: (state: T_ApplicationSent) => void;
    setIsLoading: (loading: boolean) => void;
};

const productName = process.env.REACT_APP_GA4_PRODUCT_NAME ?? "";

export async function handleSubmit<
    T_Input extends T_BaseApplicant & { campaignCode: string },
    T_Mapped
>(data: T_Input, opts: SubmitOptions<T_Input, T_Mapped>): Promise<void> {
    const { mapper, sender, analytics, conversion, onCompleted, setIsLoading } = opts;
    setIsLoading(true);
    try {
        const mappedData = await mapper(data);
        const result = await sender(mappedData);

        const normalizedAmount = normalizeAmount(data.amount);
        if (analytics) {
            const payload = {
                applicantEmail: data.applicantEmail,
                applicantPhoneNumber: data.applicantPhone,
                applicantName: buildBaseApplicantName(
                    data.applicantGivenName,
                    data.applicantSurname
                ),
                amount: normalizedAmount,
                applicationId: mappedData.gaTransactionId,
                productName,
                campaignCode: data.campaignCode,
            };

            analytics(payload);
        }

        conversion?.(normalizedAmount);

        onCompleted(result);
    } finally {
        setIsLoading(false);
    }
}

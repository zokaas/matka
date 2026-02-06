import { isValidDate } from "@opr-finance/utils";
import { T_AppFlowContext, T_AppFlowResult } from "../types";

export function resolveApplicationFlow(ctx: T_AppFlowContext): T_AppFlowResult {
    const {
        applicationId,
        kycFormFilled,
        env: { isProduction, isKycActive, isNewCustomer },
    } = ctx;

    // missing applicationId
    if (!applicationId) {
        return { type: "APPLICATION" };
    }

    // KYC service disabled
    if (!isKycActive) {
        return isProduction ? { type: "COMPLETED" } : { type: "APPLICATION" };
    }

    // dev/test override
    if (!isProduction && isNewCustomer) {
        return { type: "APPLICATION" };
    }

    // Final decision
    const isKycCompleted = Boolean(kycFormFilled) && isValidDate(kycFormFilled);

    return isKycCompleted ? { type: "COMPLETED" } : { type: "ONBOARDING" };
}

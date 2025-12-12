import { ConsoleLogger, LOG_LEVEL } from "@opr-finance/features/console-logger";
import { APP_ENV } from "./getEnvironment";
import { flowStatus, T_FlowStatus } from "../types/general";

// Helper function to determine if we need to redirect to KYC
export const evaluateKycRedirection = (
    applicationState: string | null,
    isKycCompleted: boolean
): T_FlowStatus => {
    const logger = new ConsoleLogger({ level: LOG_LEVEL });

    const isNewCustomer = import.meta.env.VITE_NEW_CUSTOMER_ONBOARDING === "1";
    const isKycActive = import.meta.env.VITE_ACTIVE_KYC_SERVICE === "1";
    const isProduction = APP_ENV === "production";
    logger.debug("isKycActive: ", isKycActive ? "true" : "false");
    logger.debug("environment", isProduction ? "production" : "development");
    logger.debug("isNewCustomer: ", isNewCustomer ? "true" : "false");

    // No application state → fill form
    if (!applicationState) return flowStatus.APPLICATION;

    // Application found, KYC service in not active
    if (!isKycActive) {
        return isProduction ? flowStatus.COMPLETED : flowStatus.APPLICATION;
    }

    // Application found, KYC service is active
    // development test the whole flow
    if (!isProduction && isNewCustomer) return flowStatus.APPLICATION;

    return isKycCompleted ? flowStatus.COMPLETED : flowStatus.ONBOARDING;
};

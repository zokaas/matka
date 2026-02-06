import { ConsoleLogger, LOG_LEVEL } from "@opr-finance/features/console-logger";

export const handleKycRedirect = async (kycCacheId: string): Promise<boolean> => {
    const logger = new ConsoleLogger({ level: LOG_LEVEL });
    const kycFormBaseUrl = import.meta.env.VITE_KYC_FORM_URL as string;
    if (!kycFormBaseUrl) {
        logger.error("Missing KYC form base URL");
        return false;
    }

    const kycServiceUrl = new URL(kycFormBaseUrl);

    kycServiceUrl.searchParams.set("key", kycCacheId);

    setTimeout(() => {
        logger.log("handleKycRedirect - Redirecting now...");
        window.location.href = kycServiceUrl.toString();
    }, 100);

    return true;
};

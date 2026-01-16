import { ConsoleLogger, LOG_LEVEL } from "@opr-finance/feature-console-logger";
import { T_CompanyKycParams, T_KycFlow, T_KycParams } from "../types/kyc";
import { saveData } from "../api/cacheData";
import { mapKycParams } from "./kycParams";
import { T_LoginSessionReducerState } from "@opr-finance/feature-login-session";
import { clearSessionStorage } from "./clearSessionStorage";

const logger = new ConsoleLogger({ level: LOG_LEVEL });

export const initiateKycFlowWithSession = async (kycParams: T_KycParams) => {
    const kycCacheId = await saveData(kycParams);
    if (!kycCacheId) {
        logger.log("error");
        throw new Error("Failed to save KYC data, no cache id");
    }
    logger.log("kycCacheId", kycCacheId);
    const success = await handleKycRedirect(kycCacheId);

    if (success) {
        clearSessionStorage();
    } else {
        logger.error("KYC redirect failed");
    }
};

const handleKycRedirect = async (kycCacheId: string): Promise<boolean> => {
    const kycFormBaseUrl = process.env.REACT_APP_KYC_FORM_URL as string;
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
    logger.log("redirect OK!");
    return true;
};

export const startKyc = async (
    company: T_CompanyKycParams,
    session: T_LoginSessionReducerState,
    flow: T_KycFlow
): Promise<boolean> => {
    const params = mapKycParams(company, session, flow);
    if (!params) return false;

    await initiateKycFlowWithSession(params);
    return true;
};

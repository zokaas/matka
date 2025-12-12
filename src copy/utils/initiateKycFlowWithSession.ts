import { loginSessionActions } from "@opr-finance/features/login-session";
import { handleKycRedirect } from "./handleKycRedirect";
import { cleanLocalStorage } from "./cleanLocalStorage";
import { Dispatch, UnknownAction } from "redux";
import { T_KycParams } from "../types";
import { ConsoleLogger, LOG_LEVEL } from "@opr-finance/features/console-logger";
import { saveData } from "../api/cacheData";

export async function initiateKycFlowWithSession(
    dispatch: Dispatch<UnknownAction>,
    kycParams: T_KycParams
) {
    const logger = new ConsoleLogger({ level: LOG_LEVEL });

    dispatch(loginSessionActions.setSkipSessionRedirect(true));
    const kycCacheId = await saveData(kycParams);
    if (!kycCacheId) {
        throw new Error("Failed to save KYC data, no cache id");
    }
    logger.log("kycCacheId", kycCacheId);

    const success = await handleKycRedirect(kycCacheId);

    if (success) {
        dispatch(loginSessionActions.loginSessionEnd());
        cleanLocalStorage();
    } else {
        logger.error("KYC redirect failed");
    }
}

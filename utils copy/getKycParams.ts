import { T_CompanyDataForKyc, T_KycParams } from "../types";
import { ConsoleLogger, LOG_LEVEL } from "@opr-finance/features/console-logger";
import { T_LoginSessionDataForKyc } from "../types";

export function mapKycParamsFromData(data: {
    companyData: T_CompanyDataForKyc;
    sessionData: T_LoginSessionDataForKyc;
    applicationId: string | null;
    applicationUuid: string;
}): T_KycParams | null {
    const logger = new ConsoleLogger({ level: LOG_LEVEL });

    const { companyData, sessionData, applicationId, applicationUuid } = data;
    if (!companyData) {
        logger.error("Missing company object");
        return null;
    }
    if (!sessionData) {
        logger.error("Missing sessionData object");
        return null;
    }

    const { organizationNumber, name, sni, sni_text } = companyData;
    const { exp, sessionRefreshCount, maxSessionRefresh, kcUserId, auth } = sessionData;

    const clientId = import.meta.env.VITE_AUTH_CLIENT_ID as string;
    const sessionId = localStorage.getItem("id") ?? "";

    const missing: Record<string, boolean> = {
        organizationNumber: !organizationNumber,
        name: !name,
        sessionId: !sessionId,
        applicationId: !applicationId,
        applicationUuid: !applicationUuid,
        clientId: !clientId,
        exp: typeof exp !== "number",
        sessionRefreshCount: typeof sessionRefreshCount !== "number",
        maxSessionRefresh: typeof maxSessionRefresh !== "number",
    };

    const missingKeys = Object.entries(missing)
        .filter(([_, isMissing]) => isMissing)
        .map(([key]) => key);

    if (missingKeys.length > 0) {
        logger.error("Missing or invalid KYC parameters:", {
            missingFields: missingKeys,
        });
        return null;
    }

    return {
        applicationId,
        applicationUuid,
        clientId,
        kycType: "onboarding",
        company: {
            companyName: name,
            orgNumber: organizationNumber,
            sniCode: sni,
        },
        session: {
            kcUserId,
            sessionId,
            exp: exp * 1000, // convert seconds → ms
            sessionRefreshCount,
            maxSessionRefresh,
        },
        auth,
    };
}

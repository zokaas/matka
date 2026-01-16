import { ConsoleLogger, LOG_LEVEL } from "@opr-finance/feature-console-logger";
import { T_CompanyKycParams, T_KycFlow, T_KycParams, kycRedirectPath, kycType } from "../types/kyc";
import { T_LoginSessionReducerState } from "@opr-finance/feature-login-session";

const logger = new ConsoleLogger({ level: LOG_LEVEL });
const flexOnlineBaseUrl = process.env.REACT_APP_FLEX_ONLINE_BASEURL;

export const mapKycParams = (
    company: T_CompanyKycParams,
    session: T_LoginSessionReducerState,
    flow: T_KycFlow
): T_KycParams | null => {
    logger.log("mapKycParams", company, session);
    if (!company || !session) return null;

    const { orgNumber, companyName, sniCode } = company;
    const { exp, sessionRefreshCount, maxSessionRefresh, gtm_userId, auth } = session;

    const clientId = process.env.REACT_APP_CLIENT_ID as string;
    const sessionId = localStorage.getItem("token") ?? "";
    const applicationId = sessionStorage.getItem("applicationId") ?? "";

    const missing: Record<string, boolean> = {
        organizationNumber: !orgNumber,
        companyName: !companyName,
        sessionId: !sessionId,
        applicationId: !applicationId,
        clientId: !clientId,
        exp: typeof exp !== "number",
        sessionRefreshCount: typeof sessionRefreshCount !== "number",
        maxSessionRefresh: typeof maxSessionRefresh !== "number",
        // TODO: uncomment the above line when sniCode is set by backend in dynamicFields
        //sniCode: !sniCode,
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

    const kycDoneUrl = `${flexOnlineBaseUrl}/${kycRedirectPath[flow]}`;

    return {
        applicationId,
        clientId,
        kycType: kycType.ONBOARDING,
        kycFlow: flow,
        kycDoneUrl,
        company,
        session: {
            kcUserId: gtm_userId,
            sessionId,
            exp: exp * 1000, // convert seconds → ms
            sessionRefreshCount,
            maxSessionRefresh,
        },
        auth,
    };
};

export const mapCompanyDataForKyc = (company: {
    organizationNumber: any;
    companyName: any;
    industryCode: any;
}): T_CompanyKycParams => {
    return {
        orgNumber: company?.organizationNumber ?? "",
        companyName: company?.companyName ?? "",
        sniCode: company?.industryCode ?? "",
    };
};

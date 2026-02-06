import { checkSigningRights } from "../api/checkSigningRights";
import { E_Routes } from "../types";
import { APP_ENV } from "./getEnvironment";

const isProduction = APP_ENV === "production";

export const validateApplicantAccess = async (
    ssn: string,
    applicantSsn: string,
    organizationNumber: string,
    navigate: (to: string, options?: any) => void
) => {
    if (isProduction) {
        if (applicantSsn && applicantSsn !== ssn) {
            navigate(E_Routes.FORBIDDEN, { state: { source: "ssn-check" } });
            return false;
        }
        const hasRights = await checkSigningRights({ ssn, organizationNumber });
        if (!hasRights) {
            navigate(E_Routes.FORBIDDEN);
            return false;
        }
    }
    return true;
};

import { Dispatch, UnknownAction } from "redux";
import { T_CompanyDataForKyc, T_LoginSessionDataForKyc } from "../types";
import { initiateKycFlowWithSession } from "./initiateKycFlowWithSession";
import { mapKycParamsFromData } from "./getKycParams";

export async function startKyc(
    dispatch: Dispatch<UnknownAction>,
    data: {
        companyData: T_CompanyDataForKyc;
        sessionData: T_LoginSessionDataForKyc;
        applicationId: string | null;
        applicationUuid: string;
    }
): Promise<void> {
    const params = mapKycParamsFromData(data);
    if (!params) {
        throw new Error("Invalid KYC params");
    }

    await initiateKycFlowWithSession(dispatch, params);
}

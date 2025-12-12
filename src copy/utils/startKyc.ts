import { Dispatch, UnknownAction } from "redux";
import { T_CompanyDataForKyc, T_LoginSessionDataForKyc } from "../types";
import { initiateKycFlowWithSession } from "./initiateKycFlowWithSession";
import { mapKycParamsFromData } from "./getKycParams";

export async function startKyc(
    dispatch: Dispatch<UnknownAction>,
    company: T_CompanyDataForKyc,
    sessionData: T_LoginSessionDataForKyc
): Promise<boolean> {
    const params = mapKycParamsFromData(company, sessionData);
    if (!params) return false;

    await initiateKycFlowWithSession(dispatch, params);
    return true;
}

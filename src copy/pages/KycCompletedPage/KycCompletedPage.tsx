import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";

import { AppState, E_Routes } from "../../types/general";
import { kycFlow, kycRedirectPath, T_KycFlow } from "../../types/kyc";
import { useEffect } from "react";
import { kycActions, T_KycReducerState } from "@opr-finance/feature-kyc";

export function KycCompletedPage() {
    const dispatch = useDispatch();

    const { authenticated, logoutInProgress } = useSelector((state: AppState) => state.session);
    const { activeSmeId } = useSelector((state: AppState) => state.customer.engagement);
    const kyc = useSelector((state: AppState) => state.kyc);

    if (!authenticated && !logoutInProgress) {
        return <Redirect to={E_Routes.ROOT} />;
    }

    const kycDone = true;

    useEffect(() => {
        const kycState: T_KycReducerState = {
            ...kyc,
            returnedFromKyc: true,
        };

        dispatch(kycActions.updateReturnedFromKycState(kycState));
        dispatch(kycActions.hideModal());
    }, [dispatch, kycDone]);

    const flow: T_KycFlow = activeSmeId ? kycFlow.EXISTING_CUSTOMER : kycFlow.NEW_CUSTOMER;

    return <Redirect to={kycRedirectPath[flow]} />;
}

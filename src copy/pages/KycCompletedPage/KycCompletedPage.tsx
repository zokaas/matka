import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { useEffect, useState } from "react";

import { AppState, E_Routes } from "../../types/general";
import { kycFlow, kycRedirectPath, T_KycFlow } from "../../types/kyc";
import { kycActions, T_KycReducerState } from "@opr-finance/feature-kyc";

export function KycCompletedPage() {
    const dispatch = useDispatch();
    const [isReady, setIsReady] = useState(false);

    const { authenticated, logoutInProgress } = useSelector((state: AppState) => state.session);
    const { activeSmeId } = useSelector((state: AppState) => state.customer.engagement);
    const kyc = useSelector((state: AppState) => state.kyc);

    useEffect(() => {
        const kycState: T_KycReducerState = {
            ...kyc,
            returnedFromKyc: true,
        };

        dispatch(kycActions.updateReturnedFromKycState(kycState));
        dispatch(kycActions.hideModal());
        setIsReady(true);
    }, [dispatch, kyc]);

    if (!authenticated && !logoutInProgress) {
        return <Redirect to={E_Routes.ROOT} />;
    }

    if (!isReady) {
        return null;
    }

    const flow: T_KycFlow = activeSmeId ? kycFlow.EXISTING_CUSTOMER : kycFlow.NEW_CUSTOMER;

    return <Redirect to={kycRedirectPath[flow]} />;
}
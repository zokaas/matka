import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";

import { AppState, E_Routes } from "../../types/general";
import { kycFlow, kycRedirectPath, T_KycFlow, T_KycState } from "../../types/kyc";
import { appActions } from "../../actions/actions";
import { useEffect } from "react";

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
        const kycState: T_KycState = {
            ...kyc,
            kycDone: Boolean(kycDone),
            kycUpdatedDate: new Date().toISOString(),
        };

        dispatch(appActions.updateKycState(kycState));
    }, [dispatch, kycDone]);

    const flow: T_KycFlow = activeSmeId ? kycFlow.EXISTING_CUSTOMER : kycFlow.NEW_CUSTOMER;

    return <Redirect to={kycRedirectPath[flow]} />;
}

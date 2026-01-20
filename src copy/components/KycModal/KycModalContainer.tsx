import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    kycActions,
} from "@opr-finance/feature-kyc";
import {
    ButtonStyles,
    FontsStyles,
    FrontPageStyles,
    ModalStyles,
} from "@opr-finance/theme-flex-online";

import { KycModal } from "../KycModal";
import { AppState } from "../../types/general";
import { checkKycStatus, shouldShowKycModal, dismissKycModal } from "../../utils";

export const KycModalContainer: React.FC = () => {
    const dispatch = useDispatch();

    const { isOpen, isLoading } = useSelector((state: AppState) => state.kyc.modal);
    const kycState = useSelector((state: AppState) => state.kyc.kycStatus);
    const authenticated = useSelector((state: AppState) => state.session.authenticated);

    const kycStatus = checkKycStatus(kycState);

    // Auto-show modal on mount if conditions are met
    useEffect(() => {
        if (authenticated && !kycState.kycDone && shouldShowKycModal(kycStatus)) {
            dispatch(kycActions.openKycModal());
        }
    }, [authenticated, kycState.kycDone, dispatch]);

    const handleClose = () => {
        dismissKycModal();
        dispatch(kycActions.closeKycModal());
    };

    const handleStartKyc = () => {
        dispatch(kycActions.startKycFlow());
    };

    if (!authenticated || kycState.kycDone) {
        return null;
    }

    return (
        <KycModal
            isOpen={isOpen}
            kycStatus={kycStatus}
            onClose={handleClose}
            onStartKyc={handleStartKyc}
            styleConfig={{
                modalCloseIcon: ModalStyles.modalCloseIcon(),
                modalOverlay: ModalStyles.modalOverlay(),
                modalContent: ModalStyles.modalContentScroll({ height: ["fit-content"] }),
                modalTitle: ModalStyles.modalTitle(),
                titleText: ModalStyles.titleText(),
                contentText: FontsStyles.fontContentText(),
                dateText: {
                    ...FontsStyles.fontContentText(),
                    marginTop: "16px",
                    fontWeight: "bold",
                },
                buttonContainer: FrontPageStyles.creditRaiseInfoColumn(),
                primaryButton: ButtonStyles.greenButtonStyles({ width: "100%" }),
                secondaryButton: ButtonStyles.grayButtonStyles({ width: "100%" }),
                buttonText: ButtonStyles.buttonFontStyles(),
            }}
        />
    );
};
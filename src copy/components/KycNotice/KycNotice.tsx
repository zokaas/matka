import React, { useState } from "react";
import { useSelector } from "react-redux";
import { StyledGrid } from "@opr-finance/component-grid";
import { ConsoleLogger, LOG_LEVEL } from "@opr-finance/feature-console-logger";

import { KycModal, messages } from "../KycModal";
import { Notice } from "../Notice";
import { AppState, E_Routes } from "../../types/general";
import { kycFlow, T_CompanyKycParams } from "../../types/kyc";
import {
    checkKycStatus,
    clearKycModalDismissal,
    dismissKycModal,
    mapCompanyDataForKyc,
    startKyc,
    history,
    handleStartKyc,
} from "../../utils";
import {
    ButtonStyles,
    FontsStyles,
    FrontPageStyles,
    KycNoticeStyles,
    ModalStyles,
} from "@opr-finance/theme-flex-online";
import { StyledButton } from "@opr-finance/component-button/src/Button";
import { Font } from "@opr-finance/component-fonts/src/Font";
import { useIntl } from "react-intl";
import { selectAccountApplicationId } from "../../selectors";

const logger = new ConsoleLogger({ level: LOG_LEVEL });

export const KycNotice: React.FC = () => {
    const { formatMessage: fm } = useIntl();
    const [showKycModal, setShowKycModal] = useState(false);

    const kycState = useSelector((state: AppState) => state.kyc.kycStatus);
    const company = useSelector((state: AppState) => state.customer.companyInfo.info);
    const session = useSelector((state: AppState) => state.session);
    const authenticated = useSelector((state: AppState) => state.session.authenticated);
    const applicationId = useSelector(selectAccountApplicationId) ?? "";

    const kycStatus = checkKycStatus(kycState);
    if (!authenticated || kycState.kycDone || !kycStatus) {
        return null;
    }

    const { isOverdue, daysRemaining } = kycStatus;
    const shouldShow = isOverdue || (daysRemaining !== null && daysRemaining <= 14);

    if (!shouldShow) return null;

    const onStartKyc = async () => {
        await handleStartKyc({ company, session, flow: kycFlow.EXISTING_CUSTOMER, applicationId });
    };
    const handleOpenModal = () => {
        clearKycModalDismissal();
        setShowKycModal(true);
    };

    const noticeText = isOverdue
        ? "Du har inte svarat på våra kundkännedomsfrågor. Därför är dina möjligheter att göra uttag nu spärrade."
        : `Det är dags att uppdatera din information för våra frågor om kundkännedom. Genom att svara i tid undviker du att möjligheten att göra uttag spärras`;

    const styleConfig = {
        buttonStyles: isOverdue ? ButtonStyles.redButtonStyles() : ButtonStyles.greenButtonStyles(),
        buttonText: ButtonStyles.buttonFontStyles(),
    };

    return (
        <>
            <KycModal
                isOpen={showKycModal}
                kycStatus={kycStatus}
                onClose={() => {
                    dismissKycModal();
                    setShowKycModal(false);
                }}
                onStartKyc={onStartKyc}
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
            <StyledGrid styleConfig={{ root: { cursor: "pointer" } }}>
                <button
                    onClick={handleOpenModal}
                    style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}>
                    <Notice
                        notice={noticeText}
                        styleConfig={{
                            noticeContainer: KycNoticeStyles.kycNoticeContainer({
                                label: isOverdue ? "Critical" : "Alert",
                            }),
                            notice: KycNoticeStyles.kycNotice(),
                        }}>
                        <StyledButton
                            onClick={handleOpenModal}
                            styleConfig={{ root: styleConfig.buttonStyles }}>
                            <Font styleConfig={{ root: styleConfig.buttonText }}>
                                {fm(messages.updateNowButton)}
                            </Font>
                        </StyledButton>
                    </Notice>
                </button>
            </StyledGrid>
        </>
    );
};

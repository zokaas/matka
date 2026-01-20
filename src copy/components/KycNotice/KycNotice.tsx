import React, { useState } from "react";
import { useSelector } from "react-redux";
import { StyledGrid } from "@opr-finance/component-grid";
import { ConsoleLogger, LOG_LEVEL } from "@opr-finance/feature-console-logger";

import { KycModal } from "../KycModal";
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
} from "../../utils";
import {
    ButtonStyles,
    FontsStyles,
    FrontPageStyles,
    KycNoticeStyles,
    ModalStyles,
} from "@opr-finance/theme-flex-online";

const logger = new ConsoleLogger({ level: LOG_LEVEL });

export const KycNotice: React.FC = () => {
    const [showKycModal, setShowKycModal] = useState(false);

    const kycState = useSelector((state: AppState) => state.kyc);
    const company = useSelector((state: AppState) => state.customer.companyInfo.info);
    const session = useSelector((state: AppState) => state.session);
    const authenticated = useSelector((state: AppState) => state.session.authenticated);

    const kycStatus = checkKycStatus(kycState);
    if (!authenticated || kycState.kycDone || !kycStatus) {
        return null;
    }

    const { isOverdue, daysRemaining } = kycStatus;
    const shouldShow = isOverdue || (daysRemaining !== null && daysRemaining <= 14);

    if (!shouldShow) return null;

    const handleStartKyc = async () => {
        logger.log("Starting KYC flow");

        if (!company) {
            logger.error("Company info not available");
            history.push(E_Routes.ERROR);
            return;
        }

        const { organizationNumber, companyName, dynamicFields } = company;
        const { industryCode } = dynamicFields?.kyc || "";

        const companyData: T_CompanyKycParams = mapCompanyDataForKyc({
            organizationNumber,
            companyName,
            industryCode,
        });

        const started = await startKyc(companyData, session, kycFlow.EXISTING_CUSTOMER);

        if (!started) {
            logger.error("Failed to start KYC flow");
            history.push(E_Routes.ERROR);
        }
    };

    const noticeText = isOverdue
        ? "Du har inte svarat på våra kundkännedomsfrågor. Därför är dina möjligheter att göra uttag nu spärrade."
        : `Det är dags att uppdatera din information för våra frågor om kundkännedom. Genom att svara i tid undviker du att möjligheten att göra uttag spärras`;
    console.log("KycNotice styleConfig:", {
        noticeContainer: KycNoticeStyles.kycNoticeContainer({ label: "Critical" }),
    });
    return (
        <>
            <KycModal
                isOpen={showKycModal}
                kycStatus={kycStatus}
                onClose={() => {
                    dismissKycModal();
                    setShowKycModal(false);
                }}
                onStartKyc={handleStartKyc}
                styleConfig={{
                    modalCloseIcon: ModalStyles.modalCloseIcon(),
                    modalOverlay: ModalStyles.modalOverlay(),
                    modalContent: ModalStyles.modalContentScroll({ height: ["fit-content"] }),
                    modalTitle: ModalStyles.modalTitle(),
                    titleText: ModalStyles.titleText(),
                    contentScroll: {
                        padding: "20px",
                        maxHeight: "60vh",
                    },
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

            <StyledGrid
                onClick={() => {
                    clearKycModalDismissal();
                    setShowKycModal(true);
                }}
                styleConfig={{ root: { cursor: "pointer" } }}>
                <Notice
                    notice={noticeText}
                    styleConfig={{
                        noticeContainer: KycNoticeStyles.kycNoticeContainer({
                            label: "Critical",
                        }),
                        notice: KycNoticeStyles.kycNotice(),
                    }}
                />
            </StyledGrid>
        </>
    );
};

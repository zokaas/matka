import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { StyledGrid } from "@opr-finance/component-grid";
import { kycActions } from "@opr-finance/feature-kyc";

import { Notice } from "../Notice";
import { AppState } from "../../types/general";
import { checkKycStatus } from "../../utils";
import { ButtonStyles, KycNoticeStyles } from "@opr-finance/theme-flex-online";
import { StyledButton } from "@opr-finance/component-button/src/Button";
import { Font } from "@opr-finance/component-fonts/src/Font";
import { useIntl } from "react-intl";
import { messages } from "../KycModal";

export const KycNotice: React.FC = () => {
    const { formatMessage: fm } = useIntl();
    const dispatch = useDispatch();

    const kycState = useSelector((state: AppState) => state.kyc);
    const authenticated = useSelector((state: AppState) => state.session.authenticated);

    const kycStatus = checkKycStatus(kycState);
    if (!authenticated || !kycStatus) {
        return null;
    }

    const { isOverdue, daysRemaining } = kycStatus;
    const shouldShow = isOverdue || (daysRemaining !== null && daysRemaining <= 14);

    if (!shouldShow) return null;

    const handleOpenModal = () => {
        dispatch(kycActions.showModal());
    };

    const noticeText = isOverdue
        ? "Du har inte svarat på våra kundkännedomsfrågor. Därför är dina möjligheter att göra uttag nu spärrade."
        : "Det är dags att uppdatera din information för våra frågor om kundkännedom. Genom att svara i tid undviker du att möjligheten att göra uttag spärras";

    const styleConfig = {
        buttonStyles: isOverdue ? ButtonStyles.redButtonStyles() : ButtonStyles.greenButtonStyles(),
        buttonText: ButtonStyles.buttonFontStyles(),
    };

    return (
        <StyledGrid
            styleConfig={{
                root: {
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                },
            }}>
            <button
                onClick={handleOpenModal}
                style={{
                    background: "none",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                    width: "100%",
                    maxWidth: "1200px",
                }}>
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
    );
};

import React from "react";
import { useIntl } from "react-intl";
import { format, parseISO } from "date-fns";
import { sv } from "date-fns/locale";

import { Modal } from "@opr-finance/component-modal-dialog";
import { StyledGrid } from "@opr-finance/component-grid";
import { Font } from "@opr-finance/component-fonts";
import { StyledButton } from "@opr-finance/component-button";
import { Icon } from "@opr-finance/component-icon";

import { KycModalProps } from "./types";
import { messages } from "./messages";

export const KycModal: React.FC<KycModalProps> = ({
    isOpen,
    kycStatus,
    kycDueDate,
    onClose,
    onStartKyc,
    styleConfig,
}) => {
    const { formatMessage: fm } = useIntl();

    const { reason, isOverdue, effectiveDueDate, daysRemaining } = kycStatus;
    const displayDueDate = kycDueDate || effectiveDueDate;

    const urgent = Boolean(isOverdue || (typeof daysRemaining === "number" && daysRemaining <= 7));

    const title = isOverdue ? fm(messages.overdueTitle) : fm(messages.kycTitle);

    return (
        <Modal
            modalTitle={title}
            isOpen={isOpen}
            onClick={onClose}
            isCloseIconVisible={true}
            styleConfig={{
                closeIcon: styleConfig.modalCloseIcon,
                overlay: styleConfig.modalOverlay,
                content: styleConfig.modalContent,
                title: styleConfig.modalTitle,
                titleText: styleConfig.titleText,
            }}
        >
            <StyledGrid styleConfig={{ root: styleConfig.buttonContainer }}>
                {/* Body */}
                {isOverdue ? (
                    <>
                        <Font styleConfig={{ root: styleConfig.contentText }} as="p">
                            {fm(messages.overdueMessage)}
                        </Font>

                        {displayDueDate && (
                            <Font styleConfig={{ root: styleConfig.dateText }} as="p">
                                {fm(messages.dueDateLabel)}{" "}
                                {format(parseISO(displayDueDate), "d MMMM yyyy", { locale: sv })}
                            </Font>
                        )}

                        <Font styleConfig={{ root: styleConfig.contentText }} as="p">
                            {fm(messages.overdueMessage)}
                        </Font>
                    </>
                ) : (
                    <>
                        <Font styleConfig={{ root: styleConfig.contentText }} as="p">
                            {fm(messages.dueDateWarningMessage)}
                        </Font>

                        <Font styleConfig={{ root: styleConfig.contentText }} as="p">
                            {fm(messages.kycReasonMessage)}
                        </Font>

                        <Font styleConfig={{ root: styleConfig.contentText }} as="p">
                            {fm(messages.creditConsentLabel)}
                        </Font>

                        {displayDueDate && (
                            <Font styleConfig={{ root: styleConfig.dateText }} as="p">
                                {fm(messages.dueDateLabel)}{" "}
                                {format(parseISO(displayDueDate), "d MMMM yyyy", { locale: sv })}
                            </Font>
                        )}
                    </>
                )}

                {/* Actions */}
                <StyledGrid
                    styleConfig={{
                        root: {
                            display: "flex",
                            flexDirection: "column",
                            gap: "12px",
                            marginTop: "24px",
                        },
                    }}>
                    <StyledButton
                        onClick={onStartKyc}
                        styleConfig={{ root: styleConfig.primaryButton }}>
                        <Font styleConfig={{ root: styleConfig.buttonText }}>
                            {fm(messages.updateNowButton)}{" "}
                            <Icon icon={["fa", "angle-double-right"]} />
                        </Font>
                    </StyledButton>

                    <StyledButton
                        onClick={onClose}
                        styleConfig={{ root: styleConfig.secondaryButton }}>
                        <Font styleConfig={{ root: styleConfig.buttonText }}>
                            {fm(messages.remindLaterButton)}
                        </Font>
                    </StyledButton>
                </StyledGrid>
            </StyledGrid>
        </Modal>
    );
};
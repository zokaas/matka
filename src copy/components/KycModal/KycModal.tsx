import React from "react";
import { useIntl } from "react-intl";
import { format, parseISO } from "date-fns";
import { sv } from "date-fns/locale";

import { Modal } from "@opr-finance/component-modal-dialog";
import { StyledGrid } from "@opr-finance/component-grid";
import { Font } from "@opr-finance/component-fonts";
import { StyledButton } from "@opr-finance/component-button";
import { Icon } from "@opr-finance/component-icon";
import { Loader } from "@opr-finance/component-loader";

import { T_KycModalProps } from "./types";
import { messages } from "./messages";

export const KycModal: React.FC<T_KycModalProps> = ({
    isOpen,
    kycStatus,
    kycDueDate,
    isLoading = false,
    onClose,
    onStartKyc,
    styleConfig,
}) => {
    const { formatMessage: fm } = useIntl();

    const { isOverdue, effectiveDueDate } = kycStatus;
    const displayDueDate = kycDueDate || effectiveDueDate;

    const title = isOverdue ? fm(messages.overdueTitle) : fm(messages.kycTitle);

    const handleStartKyc = () => {
        if (!isLoading) {
            onStartKyc();
        }
    };

    const handleClose = () => {
        if (!isLoading) {
            onClose();
        }
    };

    return (
        <Modal
            modalTitle={title}
            isOpen={isOpen}
            onClick={handleClose}
            isCloseIconVisible={!isLoading}
            styleConfig={{
                closeIcon: styleConfig.modalCloseIcon,
                overlay: styleConfig.modalOverlay,
                content: styleConfig.modalContent,
                title: styleConfig.modalTitle,
                titleText: styleConfig.titleText,
            }}>
            <StyledGrid styleConfig={{ root: styleConfig.buttonContainer }}>
                {isLoading ? (
                    <StyledGrid
                        styleConfig={{
                            root: {
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                padding: "24px",
                                gap: "16px",
                            },
                        }}>
                        <Loader isLoading={true} />
                    </StyledGrid>
                ) : (
                    <>
                        <Font styleConfig={{ root: styleConfig.contentText }} as="p">
                            {fm(messages.kycReasonMessage)}
                        </Font>

                        <Font styleConfig={{ root: styleConfig.contentText }} as="p">
                            {fm(messages.creditConsentLabel)}
                        </Font>

                        {isOverdue ? (
                            <Font styleConfig={{ root: styleConfig.contentText }} as="p">
                                {fm(messages.overdueMessage)}
                            </Font>
                        ) : (
                            <>
                                <Font styleConfig={{ root: styleConfig.contentText }} as="p">
                                    {fm(messages.dueDateWarningMessage)}
                                </Font>

                                {displayDueDate && (
                                    <Font styleConfig={{ root: styleConfig.dateText }} as="p">
                                        {fm(messages.dueDateLabel)}{" "}
                                        {format(parseISO(displayDueDate), "d MMMM yyyy", {
                                            locale: sv,
                                        })}
                                    </Font>
                                )}
                            </>
                        )}

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
                                onClick={handleStartKyc}
                                styleConfig={{ root: styleConfig.primaryButton }}>
                                <Font styleConfig={{ root: styleConfig.buttonText }}>
                                    {fm(messages.updateNowButton)}{" "}
                                    <Icon icon={["fa", "angle-double-right"]} />
                                </Font>
                            </StyledButton>

                            {!isOverdue && (
                                <StyledButton
                                    onClick={handleClose}
                                    styleConfig={{ root: styleConfig.secondaryButton }}>
                                    <Font styleConfig={{ root: styleConfig.buttonText }}>
                                        {fm(messages.remindLaterButton)}
                                    </Font>
                                </StyledButton>
                            )}
                        </StyledGrid>
                    </>
                )}
            </StyledGrid>
        </Modal>
    );
};

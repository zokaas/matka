import React from "react";
import { useIntl } from "react-intl";
import { format, parseISO } from "date-fns";
import { sv } from "date-fns/locale";

import { Modal } from "@opr-finance/component-modal-dialog";
import { StyledGrid } from "@opr-finance/component-grid";
import { Font } from "@opr-finance/component-fonts";
import { StyledButton } from "@opr-finance/component-button";
import { Icon } from "@opr-finance/component-icon";
import {
    ButtonStyles,
    FontsStyles,
    FrontPageStyles,
    ModalStyles,
} from "@opr-finance/theme-flex-online";
import { KycModalProps } from "./types";

export const KycModal: React.FC<KycModalProps> = ({
    isOpen,
    kycStatus,
    kycDueDate,
    onClose,
    onStartKyc,
}) => {
    const { formatMessage: fm } = useIntl();

    const getModalContent = () => {
        const { reason, daysRemaining, isOverdue, effectiveDueDate } = kycStatus;

        // Use provided due date or calculated one
        const displayDueDate = kycDueDate || effectiveDueDate;

        // Overdue - cannot dismiss
        if (isOverdue) {
            return {
                title: "Viktigt: Dina KYC-uppgifter måste uppdateras",
                message: (
                    <>
                        <Font styleConfig={{ root: FontsStyles.fontContentText() }} as="p">
                            Ditt konto har begränsningar eftersom din KYC-information inte har
                            uppdaterats i tid. Du kan inte göra uttag förrän du har slutfört
                            uppdateringen.
                        </Font>
                        {displayDueDate && (
                            <Font
                                styleConfig={{
                                    root: {
                                        ...FontsStyles.fontContentText(),
                                        marginTop: "16px",
                                        fontWeight: "bold",
                                    },
                                }}
                                as="p">
                                Förfallodatum:{" "}
                                {format(parseISO(displayDueDate), "d MMMM yyyy", { locale: sv })}
                            </Font>
                        )}
                    </>
                ),
                showCloseButton: false,
                urgent: true,
            };
        }

        // No due date set - show calculated deadline
        if (reason === "no_due_date") {
            return {
                title: "Uppdatera dina KYC-uppgifter",
                message: (
                    <>
                        <Font styleConfig={{ root: FontsStyles.fontContentText() }} as="p">
                            För att fortsätta använda alla funktioner i ditt konto behöver du
                            uppdatera dina KYC-uppgifter (Know Your Customer). Detta är ett
                            lagkrav för att vi ska kunna erbjuda våra tjänster.
                        </Font>
                        {daysRemaining !== null && displayDueDate && (
                            <Font
                                styleConfig={{
                                    root: {
                                        ...FontsStyles.fontContentText(),
                                        marginTop: "16px",
                                        fontWeight: "bold",
                                    },
                                }}
                                as="p">
                                Du har {daysRemaining} dag{daysRemaining !== 1 ? "ar" : ""} kvar.
                                Förfallodatum:{" "}
                                {format(parseISO(displayDueDate), "d MMMM yyyy", { locale: sv })}
                            </Font>
                        )}
                    </>
                ),
                showCloseButton: true,
                urgent: daysRemaining !== null && daysRemaining <= 7,
            };
        }

        // Approaching deadline (< 14 days)
        const urgentLevel = daysRemaining !== null && daysRemaining <= 7;

        return {
            title: urgentLevel
                ? "Brådskande: Uppdatera dina KYC-uppgifter"
                : "Påminnelse: Uppdatera dina KYC-uppgifter",
            message: (
                <>
                    <Font styleConfig={{ root: FontsStyles.fontContentText() }} as="p">
                        Du har {daysRemaining} dag{daysRemaining !== 1 ? "ar" : ""} kvar att
                        uppdatera dina KYC-uppgifter. Efter förfallodatum kommer du inte att
                        kunna göra uttag förrän uppdateringen är klar.
                    </Font>
                    {displayDueDate && (
                        <Font
                            styleConfig={{
                                root: {
                                    ...FontsStyles.fontContentText(),
                                    marginTop: "16px",
                                    fontWeight: "bold",
                                },
                            }}
                            as="p">
                            Förfallodatum:{" "}
                            {format(parseISO(displayDueDate), "d MMMM yyyy", { locale: sv })}
                        </Font>
                    )}
                </>
            ),
            showCloseButton: true,
            urgent: urgentLevel,
        };
    };

    const content = getModalContent();

    return (
        <Modal
            modalTitle={content.title}
            isOpen={isOpen}
            onClick={content.showCloseButton ? onClose : () => {}}
            isCloseIconVisible={content.showCloseButton}
            styleConfig={{
                closeIcon: ModalStyles.modalCloseIcon(),
                overlay: ModalStyles.modalOverlay(),
                content: ModalStyles.modalContentScroll({ height: ["fit-content"] }),
                title: ModalStyles.modalTitle(),
                titleText: ModalStyles.titleText(),
            }}>
            <StyledGrid styleConfig={{ root: FrontPageStyles.creditRaiseInfoColumn() }}>
                {content.message}

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
                        styleConfig={{
                            root: ButtonStyles.greenButtonStyles({ width: "100%" }),
                        }}>
                        <Font styleConfig={{ root: ButtonStyles.buttonFontStyles() }}>
                            Uppdatera uppgifter nu <Icon icon={["fa", "angle-double-right"]} />
                        </Font>
                    </StyledButton>

                    {content.showCloseButton && (
                        <StyledButton
                            onClick={onClose}
                            styleConfig={{
                                root: ButtonStyles.grayButtonStyles({ width: "100%" }),
                            }}>
                            <Font styleConfig={{ root: ButtonStyles.buttonFontStyles() }}>
                                Påminn mig senare
                            </Font>
                        </StyledButton>
                    )}
                </StyledGrid>
            </StyledGrid>
        </Modal>
    );
};
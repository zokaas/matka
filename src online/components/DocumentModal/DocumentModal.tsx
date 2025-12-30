import React, { useState } from "react";
import { useIntl } from "react-intl";

import { StyledGrid } from "@opr-finance/component-grid";
import {
    ButtonStyles,
    FontsStyles,
    LoanPageStyles,
    ModalStyles,
} from "@opr-finance/theme-flex-online";
import { StyledButton } from "@opr-finance/component-button";
import { Icon } from "@opr-finance/component-icon";
import { Modal } from "@opr-finance/component-modal-dialog";
import { Font } from "@opr-finance/component-fonts";

import { T_ModalProps } from "./types";
import { messages } from "../../pages/LoanPage/messages";

export function DocumentModal(props: T_ModalProps) {
    const { formatMessage: fm } = useIntl();

    return (
        <Modal
            modalTitle={fm(messages.modalTitle)}
            isOpen={props.modalOpen}
            onClick={() => props.toggleModalOpen(false)}
            styleConfig={{
                closeIcon: ModalStyles.modalCloseIcon(),
                overlay: ModalStyles.modalOverlay(),
                content: ModalStyles.modalContentScroll({ height: ["430px", "330px"] }),
                title: ModalStyles.modalTitle(),
                titleText: ModalStyles.titleText(),
            }}
        >
            <StyledGrid styleConfig={{ root: LoanPageStyles.modalLayout() }}>
                <Font styleConfig={{ root: FontsStyles.fontContentText() }} as="p">
                    {fm(messages.modalContent)}
                </Font>
                <StyledButton
                    onClick={props.handleClick}
                    styleConfig={{
                        root: ButtonStyles.greenButtonStyles({ marginTop: "42px" }),
                    }}
                >
                    <Font styleConfig={{ root: ButtonStyles.buttonFontStyles() }}>
                        {fm(messages.modalButtonText)}
                        <Icon icon={["fa", "angle-double-right"]} />{" "}
                    </Font>
                </StyledButton>
            </StyledGrid>
        </Modal>
    );
}

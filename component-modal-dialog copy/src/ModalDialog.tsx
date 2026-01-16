import React, { FunctionComponent } from "react";
import ReactModal from "react-modal";
import ReactMarkdown from "react-markdown";
import { Icon } from "@opr-finance/component-icon";
import { Font, Text } from "@opr-finance/component-fonts";
import {
    StyledModal,
    StyledTitle,
    StyledCloseIcon,
    ModalStyled,
    ModalTitle,
    ModalCloseIcon,
} from "./ModalDialog.styled";
import { ModalDialogProps, ModalDialogOverlayProps, ContnentProps, ModalProps } from "./types";

ReactModal.setAppElement("#root");

const modalStyles: ModalDialogOverlayProps = {
    overlay: {
        backgroundColor: "rgba(0,0,0,0.4)",
        display: "flex",
        zIndex: 1500,
    },
};

export const ModalDialog: FunctionComponent<ModalDialogProps> = (props) => {
    return (
        <StyledModal style={modalStyles} isOpen={props.isOpen} variant={props.dialogVariant}>
            <StyledTitle variant={props.dialogVariant}>
                {props.modalTitle}
                <StyledCloseIcon onClick={props.onClick}>
                    <Icon icon={["fas", "times"]} size={"lg"} />
                </StyledCloseIcon>
            </StyledTitle>
            {props.children}
        </StyledModal>
    );
};

export const RichContent: FunctionComponent<ContnentProps> = (props) => {
    return (
        <>
            {props.createdDate && <Text variant="small">{props.createdDate}</Text>}
            <ReactMarkdown>{props.content}</ReactMarkdown>
        </>
    );
};

// NOTE: New modal with styleConfig
export function Modal({
    isCloseIconVisible = true,
    styleConfig,
    isOpen,
    children,
    onClick,
    modalTitle,
}: ModalProps) {
    return (
        <ModalStyled
            style={{ overlay: styleConfig.overlay }}
            isOpen={isOpen}
            styleConfig={styleConfig}>
            <ModalTitle styleConfig={{ title: styleConfig.title }}>
                <Font styleConfig={{ root: styleConfig.titleText }}>{modalTitle}</Font>
                {isCloseIconVisible && (
                    <ModalCloseIcon
                        onClick={onClick}
                        styleConfig={{ closeIcon: styleConfig.closeIcon }}>
                        <Icon icon={["fas", "times"]} size="lg" />
                    </ModalCloseIcon>
                )}
            </ModalTitle>
            {children}
        </ModalStyled>
    );
}

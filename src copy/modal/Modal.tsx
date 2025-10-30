import React from "react";
import { T_ModalProps } from "./types";
import {
    modalActionBlockStyles,
    modalButtonStyles,
    modalContentContainerStyles,
    modalDescriptionStyles,
    modalOverlayStyles,
    modalTitleStyles,
} from "./styles";

export const ModalDialog: React.FC<T_ModalProps> = (props: T_ModalProps) => {
    const {
        isOpen,
        title,
        description,
        firstActionText,
        firstAction,
        secondActionText,
        secondAction,
        isLoading,
        classNames,
    } = props;

    if (!isOpen) return null;

    const overlayStyles = classNames?.modalOverlay || modalOverlayStyles;
    const contentStyles = classNames?.modalContentContainer || modalContentContainerStyles;
    const titleStyles = classNames?.modalTitle || modalTitleStyles;
    const descriptionStyles = classNames?.modalDescription || modalDescriptionStyles;
    const actionStyles = classNames?.modalActionBlock || modalActionBlockStyles;
    const buttonStyles = classNames?.modalButton || modalButtonStyles;

    return (
        <div className={overlayStyles}>
            {/* TODO create a loader then use -> Show loader or disable buttons if isLoading */}
            <div className={contentStyles}>
                <h2 className={titleStyles}>{title}</h2>
                {description && <p className={descriptionStyles}>{description}</p>}
                <div className={actionStyles}>
                    <button className={buttonStyles} onClick={firstAction} disabled={isLoading}>
                        {firstActionText}
                    </button>
                    {secondActionText && secondAction && (
                        <button
                            className={buttonStyles}
                            onClick={secondAction}
                            disabled={isLoading}>
                            {secondActionText}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

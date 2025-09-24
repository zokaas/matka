import React from "react";
import { T_ModalProps } from "./types";
import { actionBlock, modalButton, modalContentContainer, modalDescription, modalStyles, modalTitle } from "./styles";

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

    const overlayClass = classNames?.modalOverlay || modalStyles;
    const contentClass = classNames?.modalContentContainer || modalContentContainer;
    const titleClass = classNames?.modalTitle || modalTitle;
    const descriptionClass = classNames?.modalDescription || modalDescription;
    const actionClass = classNames?.modalActionBlock || actionBlock;
    const buttonClass = classNames?.modalButton || modalButton;

    return (
        <div className={overlayClass}>
            <div className={contentClass}>
                <h2 className={titleClass}>{title}</h2>
                {description && <p className={descriptionClass}>{description}</p>}
                <div className={actionClass}>
                    <button className={buttonClass} onClick={firstAction} disabled={isLoading}>
                        {firstActionText}
                    </button>
                    {secondActionText && secondAction && (
                        <button className={buttonClass} onClick={secondAction} disabled={isLoading}>
                            {secondActionText}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
import React from "react";
import { T_ModalProps } from "./types";
import { actionBlock, modalContentContainer, modalStyles } from "./styles";

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
    } = props;
    if (!isOpen) return null;

    return (
        <div className={modalStyles}>
            <div className={modalContentContainer}>
                <h2>{title}</h2>
                {description && <p>{description}</p>}
                {/* TODO Show loader or disable buttons if isLoading */}
                <div className={actionBlock}>
                    <button onClick={firstAction}>{firstActionText}</button>
                    {secondActionText && secondAction && (
                        <button onClick={secondAction}>{secondActionText}</button>
                    )}
                </div>
            </div>
        </div>
    );
};

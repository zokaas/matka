import React, { FunctionComponent } from "react";
import { ModalDialogProps, ContnentProps, ModalProps } from "./types";
export declare const ModalDialog: FunctionComponent<ModalDialogProps>;
export declare const RichContent: FunctionComponent<ContnentProps>;
export declare function Modal({ isCloseIconVisible, styleConfig, isOpen, children, onClick, modalTitle, }: ModalProps): React.JSX.Element;

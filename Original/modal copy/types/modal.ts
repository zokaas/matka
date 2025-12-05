export type T_ModalProps = {
    isOpen: boolean;
    title: string;
    description?: string;
    firstActionText: string;
    firstAction: () => void;
    secondActionText?: string;
    secondAction?: () => void;
    isLoading: boolean;
    classNames?: T_ModalClassNamesProps;
};

export type T_ModalClassNamesProps = {
    modalOverlay?: string;
    modalContentContainer?: string;
    modalTitle?: string;
    modalDescription?: string;
    modalActionBlock?: string;
    modalButton?: string;
};

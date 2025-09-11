export type T_ModalProps = {
    isOpen: boolean;
    title: string;
    description?: string;
    firstActionText: string;
    firstAction: () => void;
    secondActionText?: string;
    secondAction?: () => void;
    isLoading: boolean;
};

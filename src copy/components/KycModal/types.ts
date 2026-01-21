import { SystemStyleObject } from "@styled-system/css";

export type T_KycStatusResult = {
    isOverdue: boolean;
    daysRemaining: number | null;
    effectiveDueDate?: string;
};

export type T_KycModalProps = {
    isOpen: boolean;
    kycStatus: T_KycStatusResult;
    kycDueDate?: string;
    isLoading?: boolean;
    onClose: () => void;
    onStartKyc: () => void;
    styleConfig: {
        modalCloseIcon: SystemStyleObject;
        modalOverlay: SystemStyleObject;
        modalContent: SystemStyleObject;
        modalTitle: SystemStyleObject;
        titleText: SystemStyleObject;
        contentText: SystemStyleObject;
        dateText: SystemStyleObject;
        buttonContainer: SystemStyleObject;
        primaryButton: SystemStyleObject;
        secondaryButton: SystemStyleObject;
        buttonText: SystemStyleObject;
    };
};

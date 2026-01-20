import { SystemStyleObject } from "@styled-system/css";

export type KycStatusResult = {
    isOverdue: boolean;
    daysRemaining: number | null;
    effectiveDueDate?: string;
};

export type KycModalProps = {
    isOpen: boolean;
    kycStatus: KycStatusResult;
    kycDueDate?: string;
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

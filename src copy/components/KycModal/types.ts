import { KycStatusResult } from "../../utils";

export type KycModalProps = {
    isOpen: boolean;
    kycStatus: KycStatusResult;
    kycDueDate?: string;
    onClose: () => void;
    onStartKyc: () => void;
};
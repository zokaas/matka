import { SystemStyleObject } from "@styled-system/css";
type ModalContentProps = {
    height?: string[];
};
export declare function modalOverlay(): SystemStyleObject;
export declare function modalTitle(): SystemStyleObject;
export declare function titleText(): SystemStyleObject;
export declare function modalContent(): SystemStyleObject;
export declare function modalContentScroll(props?: ModalContentProps): SystemStyleObject;
export declare function modalButtonContainer(): SystemStyleObject;
type T_ModalButtonProps = {
    width?: string | Array<string>;
};
export declare function modalButtonStyles(props?: T_ModalButtonProps): SystemStyleObject;
export declare function modalCloseIcon(): SystemStyleObject;
export declare function modalButtonText(): SystemStyleObject;
export {};

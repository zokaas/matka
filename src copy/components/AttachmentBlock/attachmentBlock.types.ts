import { Dispatch, SetStateAction } from "react";
import { T_FormFields } from "../../hooks/types";
import { T_Error, T_EventType } from "../../types";

export type T_AttachmentBlockProps = {
    setFieldErrors: Dispatch<SetStateAction<T_Error[]>>;
    fieldErrors: T_Error[];
    fields: T_FormFields;
    formId: string;
    handleFieldChange: (e: T_EventType) => void;
    handleBlur: (e: T_EventType) => void;
    handleFocus: (block: string) => void;
    getErrorMessage: (name: string) => string | null;
};

export type T_AttahmentLoadStatus = {
    uploadFinished: boolean;
    fileName: string;
};

export type T_FileObject = {
    dataUrl: string;
    name: string;
    type: string;
    size: number;
};

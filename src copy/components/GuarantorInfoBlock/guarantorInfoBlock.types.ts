import { Dispatch, SetStateAction } from "react";
import { T_FormFields } from "../../hooks/types";
import { T_Error, T_EventType } from "../../types";

export type T_GuaerantorInfoBlockProps = {
    setFieldErrors: Dispatch<SetStateAction<T_Error[]>>;
    fieldErrors: T_Error[];
    setFields: Dispatch<SetStateAction<T_FormFields>>;
    fields: T_FormFields;
    formId: string;
    handleFieldChange: (e: T_EventType) => void;
    handleBlur: (e: T_EventType) => void;
    handleFocus: (block: string) => void;
    getErrorMessage: (name: string) => string | null;
};

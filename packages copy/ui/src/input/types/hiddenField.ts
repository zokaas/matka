export type T_HiddenFieldProps = {
    fieldName: string;
    value?: unknown;
    onChange: (val: unknown) => void;
    onBlur: () => void;
};

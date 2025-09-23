export type T_FilterProps = {
    fieldName?: string;
    placeholder: string;
    onChange: (value: string) => void;
    classNames?: T_FilterClassNames;
};

export type T_FilterClassNames = {
    containerCLassName?: string;
    inputClassName?: string;
};

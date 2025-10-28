export type T_RadioOption = {
    id: string;
    value: string;
};

export type T_RadioGroup = {
    label: string | React.ReactNode;
    name: string;
    options: T_RadioOption[];
    selectedValue: string;
    onChange: (value: string) => void;
    errorMessage?: string;
};

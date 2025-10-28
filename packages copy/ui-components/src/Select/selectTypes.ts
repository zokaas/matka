//TODO: Shoould we consider of adding common types for reusability?
// Same T_Option here and in RadioGroup
export type T_SelectOption = {
    id: string;
    value: string;
};

export type T_Select = {
    name: string;
    label: string | React.ReactNode;
    options?: T_SelectOption[];
    selectedValue: string;
    onChange: (value: string) => void;
    errorMessage?: string;
    placeholder?: string;
};

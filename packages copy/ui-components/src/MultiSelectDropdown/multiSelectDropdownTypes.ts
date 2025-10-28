export type T_Options = {
    id: string | null;
    value: string;
};

export type T_MultiSelectDropdown = {
    name: string;
    label: string | React.ReactNode;
    options: Array<T_Options>;
    placeholder: string;
    selectedOptions: Array<string>;
    onChange: (selected: string[]) => void;
    errorMessage?: string;
};

export type T_Input = {
    name: string;
    label: string | React.ReactNode;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    type?: "text" | "number";
    errorMessage?: string;
};

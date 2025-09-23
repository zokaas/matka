export type T_LabelInfo = {
    componentType: "tooltip" | "subHeader";
    infoHeader: string | null;
    infoDescription: string | null;
};

export type T_LabelProps = {
    htmlFor: string;
    children: React.ReactNode;
    className?: string;
    labelClassName?: string;
    infoItems?: T_LabelInfo | T_LabelInfo[] | null;
};

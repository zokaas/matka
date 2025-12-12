export type T_SideNavigationContentProps = {
    currentForm: string | null;
    blurredForms: string[];
    validForms: string[];
    onSubmit?: () => void;
    secondGuarantorVisible: boolean | undefined;
    signingRightsVisible?: boolean;
    applicationPreviewVisible: boolean;
};

export type T_SideNavigationIconProps = {
    name: string;
    currentForm: string | null;
    blurredForms: string[];
    validForms: string[];
};

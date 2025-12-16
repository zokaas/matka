export type T_ClassProps = {
    defaultClasses: string;
    overridingClasses?: string;
    hardcodedClasses?: string;
};

export type T_StylesProps = {
    label?: {
        stepLabelClasses?: string;
        stepActiveLabelClasses?: string;
        stepContainerClasses?: string;
    };
    badge?: {
        stepBadgeClasses?: string;
        stepBadgeCompletedClasses?: string;
        stepCounterClasses?: string;
        stepCounterActiveStyles?: string;
        stepCounterDoneStyles?: string;
    };
    statusLine?: {
        fillDone?: string;
    };
};

import { ReactNode } from "react";
import {
    ColorProps,
    FlexboxProps,
    LayoutProps,
    PositionProps,
    SpaceProps,
    TypographyProps,
} from "styled-system";

import { AppThemeProps } from "@opr-finance/themes";
import { SystemStyleObject } from "@styled-system/css";

export type CommonModalDialogProps = {
    isOpen: boolean;
    children: ReactNode;
    modalTitle?: string;
};

export type ModalDialogProps = CommonModalDialogProps & {
    onClick: (event: React.MouseEvent<HTMLElement>) => void;
    dialogVariant: "default";
    titleVariant?: "default";
};

export type ContnentProps = {
    content: string;
    createdDate?: string;
};

export type ModalDialogOverlayProps = {
    overlay: {
        backgroundColor: string;
        display: string;
        zIndex: number;
    };
};

export type StyledModalProps = ColorProps &
    FlexboxProps &
    LayoutProps &
    PositionProps &
    SpaceProps &
    CommonModalDialogProps & {
        className?: string;
        variant: "default";
        style: ModalDialogOverlayProps;
    };

export type StyledModalPropsWithTheme = StyledModalProps & AppThemeProps;

export type StyledTitleProps = ColorProps &
    FlexboxProps &
    LayoutProps &
    SpaceProps &
    TypographyProps & {
        variant: "default";
        children: ReactNode;
    };

export type StyledCloseIconProps = {
    children: ReactNode;
    onClick: (event: React.MouseEvent<HTMLElement>) => void;
};

/* StyleConfig Modal */

export type DefaultModalTitleProps = {
    children: ReactNode;
    styleConfig: {
        title: SystemStyleObject;
    };
};
export type TitleTextStyle = DefaultModalProps & {
    styleConfig: {
        titleText: SystemStyleObject;
    };
};

export type DefaultModalCloseIconProps = {
    children: ReactNode;
    styleConfig: {
        closeIcon: SystemStyleObject;
    };
    onClick: (event: React.MouseEvent<HTMLElement>) => void;
};

export type DefaultModalProps = {
    isOpen: boolean;
    children: ReactNode;
    modalTitle?: string;
    styleConfig: {
        overlay: SystemStyleObject;
        content: SystemStyleObject;
    };
    isCloseIconVisible?: boolean;
};

export type DefaultStyledModal = DefaultModalProps & {
    style: { overlay: SystemStyleObject };
};

export type ModalProps = DefaultModalTitleProps &
    DefaultModalCloseIconProps &
    DefaultModalProps &
    TitleTextStyle;

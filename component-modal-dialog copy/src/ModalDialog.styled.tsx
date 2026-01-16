import { FunctionComponent } from "react";
import Modal from "react-modal";
import styled from "styled-components";
import { color, flexbox, layout, position, space, typography, variant } from "styled-system";
import { css } from "@styled-system/css";

import { AppTheme, AppThemeProps } from "@opr-finance/themes";

import {
    StyledModalProps,
    StyledTitleProps,
    StyledCloseIconProps,
    DefaultStyledModal,
    DefaultModalTitleProps,
    DefaultModalCloseIconProps,
} from "./types";

const dialogVariants = (theme: AppTheme) => ({ ...theme.modal.dialog });
const titleVariants = (theme: AppTheme) => ({ ...theme.modal.title });

export const StyledModal: FunctionComponent<StyledModalProps> = styled(Modal).attrs({
    className: "ModalDialog",
})<StyledModalProps>`
    ${(props: AppThemeProps) => variant({ variants: dialogVariants(props.theme) })}
    ${color}
    ${flexbox}
    ${layout}
    ${position}
    ${space}
    :focus {
        outline: none;
    }
`;

export const StyledTitle: FunctionComponent<StyledTitleProps> = styled.p<StyledTitleProps>`
    ${(props: AppThemeProps) => variant({ variants: titleVariants(props.theme) })}
    ${color}
    ${flexbox}
    ${layout}
    ${space}
    ${typography}
`;

export const StyledCloseIcon: FunctionComponent<StyledCloseIconProps> = styled.span<StyledCloseIconProps>`
    cursor: pointer;
    margin-left: auto;
`;

/* StyleConfig Modal */
export const ModalStyled: FunctionComponent<DefaultStyledModal> = styled(Modal).attrs({
    className: "StyledConfigModalDialog",
})<DefaultStyledModal>`
    ${(props: DefaultStyledModal) => {
        return css(props.styleConfig.content);
    }}
    :focus {
        outline: none;
    }
`;

export const ModalTitle: FunctionComponent<DefaultModalTitleProps> = styled.div<DefaultModalTitleProps>`
    ${(props: DefaultModalTitleProps) => css(props.styleConfig.title)}
`;

export const ModalCloseIcon: FunctionComponent<DefaultModalCloseIconProps> = styled.span<DefaultModalCloseIconProps>`
    ${(props: DefaultModalCloseIconProps) => css(props.styleConfig.closeIcon)}
`;

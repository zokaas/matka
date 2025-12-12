import { FunctionComponent } from "react";
import { css } from "@styled-system/css";
import styled from "styled-components";

import { T_ScrollProps, T_ScrollContainerProps } from "./types";

import { Link } from "react-scroll";

export const ScrollContainer: FunctionComponent<T_ScrollContainerProps> = styled.div<T_ScrollContainerProps>`
    ${(props: T_ScrollContainerProps) => css(props.styles)};
`;

export const Scroll = ({
    styles,
    children,
    to,
    spy = true,
    smooth = true,
    offset = 0,
    duration = 500,
}: T_ScrollProps) => {
    return (
        <ScrollContainer styles={styles}>
            <Link to={to} spy={spy} smooth={smooth} offset={offset} duration={duration}>
                {children}
            </Link>
        </ScrollContainer>
    );
};

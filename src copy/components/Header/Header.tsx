import React from "react";
import { Container } from "@opr-finance/styled-components";
import { componentStyles } from "@opr-finance/themes/sweden-foretagslan-application";

import { T_HeaderProps } from "./types";

function Header(props: Readonly<T_HeaderProps>) {
    const { headerStyles } = componentStyles;
    return (
        <Container styles={headerStyles.headerContainer}>
            <Container styles={headerStyles.headerContentContainer}>
                {props.logo}
                {props.button}
            </Container>
        </Container>
    );
}

export default Header;

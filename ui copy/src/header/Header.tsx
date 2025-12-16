import React from "react";
import { T_HeaderProps } from "./types";
import {
    headerStyles,
    headerContentContainer,
    headerLogoContainer,
    headerLogoImage,
} from "./styles";
import { Container } from "@ui/container";

export const Header: React.FC<T_HeaderProps> = (props: T_HeaderProps) => {
    return (
        <header className={headerStyles}>
            <Container className={headerContentContainer}>
                <Container className={headerLogoContainer}>
                    <div className={headerLogoImage} />
                </Container>
            </Container>
        </header>
    );
};

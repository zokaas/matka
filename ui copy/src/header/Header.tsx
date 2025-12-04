import React from "react";
import { T_HeaderProps } from "./types";
import {
    headerStyles,
    headerContentContainer,
    headerTitle,
    headerLogoContainer,
    headerLogoImage,
} from "./styles";
import { Container } from "@ui/container";

export const Header: React.FC<T_HeaderProps> = (props: T_HeaderProps) => {
    return (
        <header className={headerStyles}>
            <Container className={headerContentContainer}>
                <Container className={headerLogoContainer}>
                    <img className={headerLogoImage} src={props.logoSrc} />
                </Container>
                {/* {props.title && (
                    <Container>
                        <h1 className={headerTitle}>{props.title}</h1>
                    </Container>
                )} */}
            </Container>
        </header>
    );
};

import React from "react";
import type { PropsWithChildren } from "react";
import { Container } from "@ui/container";
import { mainContainerStyle, mainContentStyle } from "~/styles";

export const StatusLayout = ({ children }: PropsWithChildren) => {
    return (
        <main className={mainContentStyle}>
            <Container className={mainContainerStyle}>{children}</Container>
        </main>
    );
};

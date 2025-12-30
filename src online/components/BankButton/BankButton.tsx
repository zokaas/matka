import React from "react";

import { StyledGrid, EmptyStyledGrid } from "@opr-finance/component-grid";
import { BankButtonProps } from "./types";

export function BankButton(props: BankButtonProps) {
    return (
        <StyledGrid
            styleConfig={{ root: props.styleConfig.buttonContainer }}
            onClick={props.onClick}
        >
            <EmptyStyledGrid styleConfig={{ root: props.styleConfig.bankContainer }} />
        </StyledGrid>
    );
}

import React from "react";

import { StyledGrid } from "@opr-finance/component-grid";
import { Font } from "@opr-finance/component-fonts";

import { NoticeProps } from "./types";

export function Notice(props: NoticeProps) {
    return (
        <StyledGrid styleConfig={{ root: props.styleConfig.noticeContainer }}>
            <Font styleConfig={{ root: props.styleConfig.notice }} as="p">
                {props.notice}
            </Font>
            {props.children && (
                <StyledGrid
                    styleConfig={{
                        root: {
                            alignSelf: "center",
                            width: "auto",
                        },
                    }}>
                    {props.children}
                </StyledGrid>
            )}
        </StyledGrid>
    );
}

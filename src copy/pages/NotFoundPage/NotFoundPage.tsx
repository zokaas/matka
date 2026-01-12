import React from "react";
import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom";

import { StyledGrid } from "@opr-finance/component-grid";
import { StyledPageTitle } from "@opr-finance/component-content";
import { NotFoundPageStyles } from "@opr-finance/theme-flex-online";

import { NotFoundPageProps } from "./types";
import { AppState, E_Routes } from "../../types/general";

export function NotFoundPage(props: NotFoundPageProps) {
    const { authenticated, logoutInProgress } = useSelector((state: AppState) => state.session);

    if (!authenticated && !logoutInProgress) {
        return <Redirect to={E_Routes.ROOT} />;
    }

    return (
        <StyledGrid styleConfig={{ root: NotFoundPageStyles.notFoundPageRootStyles() }}>
            <StyledPageTitle
                title="Sidan kunde inte hittas"
                styleConfig={{
                    pageTitleContainer: props.styleConfig.titleBox,
                    pageTitleText: props.styleConfig.pageTitle,
                }}
            />
        </StyledGrid>
    );
}

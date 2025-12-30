import React from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom";

import { StyledGrid } from "@opr-finance/component-grid";
import { StyledPageTitle } from "@opr-finance/component-content";
import { NoLoanPageStyles } from "@opr-finance/theme-flex-online";
import { Font } from "@opr-finance/component-fonts";
import { StyledLink } from "@opr-finance/component-link-to";

import { AppState, E_Routes } from "../../types/general";
import { NoLoanPageProps } from "./types";
import { messages } from "./messages";

export function NoLoanPage(props: NoLoanPageProps) {
    const { formatMessage: fm } = useIntl();

    const { authenticated, logoutInProgress } = useSelector((state: AppState) => state.session);

    if (!authenticated && !logoutInProgress) {
        return <Redirect to={E_Routes.ROOT} />;
    }

    return (
        <StyledGrid styleConfig={{ root: NoLoanPageStyles.noLoanPageRootStyles() }}>
            <StyledPageTitle
                title={fm(messages.pageTitle)}
                styleConfig={{
                    pageTitleContainer: props.styleConfig.titleBox,
                    pageTitleText: props.styleConfig.pageTitle,
                }}
            />
            <StyledGrid styleConfig={{ root: NoLoanPageStyles.noLoanPageContainer() }}>
                <Font styleConfig={{ root: NoLoanPageStyles.NoLoanPageTitle() }}>
                    {fm(messages.heading)}
                </Font>
                <Font styleConfig={{ root: NoLoanPageStyles.NoLoanPageContent() }}>
                    {`${fm(messages.bodyText)}`}
                    <StyledLink
                        href={`${process.env.REACT_APP_APPLICATION}`}
                        styleConfig={{ root: NoLoanPageStyles.NoLoanPageLink() }}>
                        {fm(messages.linkText)}
                    </StyledLink>
                </Font>
            </StyledGrid>
        </StyledGrid>
    );
}

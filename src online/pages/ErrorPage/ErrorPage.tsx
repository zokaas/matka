import React from "react";
import { useIntl } from "react-intl";
import { Link } from "react-router-dom";

import { StyledGrid } from "@opr-finance/component-grid";
import { StyledPageTitle } from "@opr-finance/component-content";
import { ErrorPageStyles, PageTitleStyles } from "@opr-finance/theme-flex-online";
import { Font } from "@opr-finance/component-fonts";
import { StyledLink } from "@opr-finance/component-link-to";

import { ErrorPageProps } from "./types";
import { E_Routes } from "../../types/general";
import { messages } from "./messages";

export function ErrorPage(props: ErrorPageProps) {
    const { formatMessage: fm } = useIntl();

    return (
        <StyledGrid styleConfig={{ root: ErrorPageStyles.errorPageRootStyles() }}>
            <StyledPageTitle
                title={fm(messages.pageTitle)}
                styleConfig={{
                    pageTitleContainer: PageTitleStyles.titleBox,
                    pageTitleText: PageTitleStyles.pageTitle,
                }}
            />
            <StyledGrid styleConfig={{ root: ErrorPageStyles.contentContainer() }}>
                <Font styleConfig={{ root: ErrorPageStyles.heading() }}>
                    {fm(messages.pageInfo)}
                </Font>
                <Font styleConfig={{ root: ErrorPageStyles.content() }}>
                    {fm(messages.pageInfo1)}{" "}
                    <Link to={E_Routes.ROOT} style={{ color: "#5c98d3" }}>
                        {fm(messages.LinkText1)}
                    </Link>{" "}
                    {fm(messages.pageInfo2)}{" "}
                    <StyledLink
                        href={`${process.env.REACT_APP_LOGOUT_REDIRECT}`}
                        styleConfig={{ root: ErrorPageStyles.link() }}>
                        {fm(messages.LinkText2)}
                    </StyledLink>
                    .
                </Font>
            </StyledGrid>
        </StyledGrid>
    );
}

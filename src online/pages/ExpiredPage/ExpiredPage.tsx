import React from "react";
import { useIntl } from "react-intl";
import { Link } from "react-router-dom";

import { StyledGrid } from "@opr-finance/component-grid";
import { StyledPageTitle } from "@opr-finance/component-content";
import { ExpiredPageStyles } from "@opr-finance/theme-flex-online";
import { Font } from "@opr-finance/component-fonts";
import { messages } from "./messages";

import { ExpiredPageProps } from "./types";

export function ExpiredPage(props: ExpiredPageProps) {
    const { formatMessage: fm } = useIntl();

    return (
        <StyledGrid styleConfig={{ root: ExpiredPageStyles.expiredPageRootStyles() }}>
            <StyledPageTitle
                title={fm(messages.expiredPageTitle)}
                styleConfig={{
                    pageTitleContainer: props.styleConfig.titleBox,
                    pageTitleText: props.styleConfig.pageTitle,
                }}
            />
            <StyledGrid styleConfig={{ root: ExpiredPageStyles.contentContainer() }}>
                <Font styleConfig={{ root: ExpiredPageStyles.heading() }}>
                    {fm(messages.expiredPageHeadingBox)}
                </Font>
                <Font styleConfig={{ root: ExpiredPageStyles.content() }}>
                    {fm(messages.expiredPageText)}{" "}
                    <Link to="/" style={{ color: "#5c98d3" }}>
                        {fm(messages.expiredPageLinkText)}
                    </Link>
                    .
                </Font>
            </StyledGrid>
        </StyledGrid>
    );
}

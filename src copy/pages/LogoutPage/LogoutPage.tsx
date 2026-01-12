import React, { useEffect } from "react";
import { useIntl } from "react-intl";

import { StyledGrid } from "@opr-finance/component-grid";
import { StyledPageTitle } from "@opr-finance/component-content";
import { Font } from "@opr-finance/component-fonts";
import { StyledLink } from "@opr-finance/component-link-to";

import { LogoutPageProps } from "./types";
import { messages } from "./messages";
import { useSelector } from "react-redux";
import { AppState } from "../../types/general";
import { onComponentMounted } from "../../utils";

export function LogoutPage(props: LogoutPageProps) {
    const { formatMessage: fm } = useIntl();
    const boardMemberId = useSelector((state: AppState) => {
        return state.customer?.companyInfo?.boardmembers
            ? state.customer?.companyInfo?.boardmembers[0].id
            : "";
    });

    useEffect(() => {
        onComponentMounted(boardMemberId);
    }, []);

    return (
        <StyledGrid styleConfig={{ root: props.styleConfig.rootStyles }}>
            <StyledPageTitle
                title={fm(messages.pageTitle)}
                styleConfig={{
                    pageTitleContainer: props.styleConfig.titleBox,
                    pageTitleText: props.styleConfig.pageTitle,
                }}
            />
            <StyledGrid styleConfig={{ root: props.styleConfig.pageContent }}>
                <Font as="p" styleConfig={{ root: props.styleConfig.content }}>
                    {`${fm(messages.bodyText)} `}
                    <StyledLink
                        href={`${process.env.REACT_APP_LOGOUT_REDIRECT}`}
                        styleConfig={{ root: props.styleConfig.link }}>
                        {fm(messages.linkText)}
                    </StyledLink>
                </Font>
            </StyledGrid>
        </StyledGrid>
    );
}

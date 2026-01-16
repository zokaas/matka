import React, { useEffect } from "react";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";

import { StyledGrid } from "@opr-finance/component-grid";
import { StyledPageTitle } from "@opr-finance/component-content";
import { ThankYouPageStyles } from "@opr-finance/theme-flex-online";
import { Font } from "@opr-finance/component-fonts";
import { Link } from "@opr-finance/component-link-to";

import { AppState, E_Routes } from "../../types/general";
import { ThankYouPageProps } from "./types";
import { messages } from "./messages";
import { loginSessionActions } from "@opr-finance/feature-login-session";
import { clearSessionStorage } from "../../utils";

export function ThankYouPage(props: ThankYouPageProps) {
    const { formatMessage: fm } = useIntl();

    const { authenticated, logoutInProgress } = useSelector((state: AppState) => state.session);

    if (!authenticated && !logoutInProgress) {
        return <Redirect to={E_Routes.ROOT} />;
    }
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(
            loginSessionActions.loginSessionEnd({
                redirect: false,
            })
        );
        clearSessionStorage();
    }, [dispatch]);

    return (
        <StyledGrid styleConfig={{ root: ThankYouPageStyles.thankYouPageRootStyles() }}>
            <StyledPageTitle
                title={fm(messages.pageTitle)}
                styleConfig={{
                    pageTitleContainer: props.styleConfig.titleBox,
                    pageTitleText: props.styleConfig.pageTitle,
                }}
            />
            <StyledGrid styleConfig={{ root: ThankYouPageStyles.thankYouPageContainer() }}>
                <Font styleConfig={{ root: ThankYouPageStyles.thankYouPageContent() }}>
                    {fm(messages.headingFirst)}
                </Font>
                <Font styleConfig={{ root: ThankYouPageStyles.thankYouPageContent() }}>
                    {fm(messages.headingSecond)}
                </Font>
                <Font styleConfig={{ root: ThankYouPageStyles.thankYouPageContent() }}>
                    {`${fm(messages.bodyText)}`}
                    <Link
                        styleConfig={{ root: ThankYouPageStyles.thankYouPageLink() }}
                        href={fm(messages.emailLink)}>
                        {fm(messages.emailText)}
                    </Link>
                </Font>
                <Font styleConfig={{ root: ThankYouPageStyles.thankYouPagePhoneText() }}>
                    {fm(messages.phoneText)}
                </Font>
            </StyledGrid>
        </StyledGrid>
    );
}

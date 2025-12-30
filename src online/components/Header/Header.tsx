import React, { FunctionComponent } from "react";
import { useSelector } from "react-redux";

import { HeaderStyles } from "@opr-finance/theme-flex-online";
import { StyledGrid } from "@opr-finance/component-grid";
import { Navigation } from "@opr-finance/component-navigation";
import { E_AllowedAccountStates } from "@opr-finance/feature-account";

import { HeaderProps } from "./types";
import { AppState, E_Routes } from "../../types/general";
import { useIntl } from "react-intl";
import { messages } from "./messages";

type NavItems = {
    linkTo: string;
    navigationText: string;
};

export const Header: FunctionComponent<HeaderProps> = (props) => {
    const { formatMessage: fm } = useIntl();
    const accountState = useSelector((state: AppState) => state.account.accountState);
    const engagements = useSelector((state: AppState) => state.customer.engagement.engagements);

    const navItems: NavItems[] = [
        {
            linkTo: E_Routes.FRONT,
            navigationText: fm(messages.frontPage),
        },
        {
            linkTo: E_Routes.LOAN,
            navigationText: fm(messages.loanPage),
        },
        {
            linkTo: E_Routes.TOPUP,
            navigationText: fm(messages.topUpPage),
        },
        {
            linkTo: E_Routes.USER,
            navigationText: fm(messages.userInfo),
        },
        {
            linkTo: E_Routes.CONTACT,
            navigationText: fm(messages.contactInfo),
        },
    ];

    // if (engagements && engagements.length > 1) {
    //     navItems.push({
    //         linkTo: E_Routes.CHOOSE_ACCOUNT,
    //         navigationText: "Växla konto",
    //     });
    // }

    const filteredNavItems =
        accountState === E_AllowedAccountStates.COLLECTION
            ? navItems.filter(
                  (item) => item.linkTo !== E_Routes.LOAN && item.linkTo !== E_Routes.TOPUP
              )
            : !props.isTopupVisible
            ? navItems.filter((item) => item.linkTo !== E_Routes.TOPUP)
            : navItems;

    return (
        <StyledGrid
            styleConfig={{
                root: HeaderStyles.headerContainer(),
            }}>
            <StyledGrid
                styleConfig={{
                    root: HeaderStyles.headerStyles(),
                }}>
                {props.logo}
                {props.navigationVisible && (
                    <Navigation navigationItems={filteredNavItems}></Navigation>
                )}
                {props.button}
            </StyledGrid>
        </StyledGrid>
    );
};

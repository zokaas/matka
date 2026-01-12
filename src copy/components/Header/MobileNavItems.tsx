import React, { FunctionComponent, Dispatch, SetStateAction } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useIntl } from "react-intl";

import { IconContainer } from "@opr-finance/component-navigation";
import { Scroll } from "@opr-finance/component-scroll";
import { MobileNavStyles } from "@opr-finance/theme-flex-online";
import { StyledGrid } from "@opr-finance/component-grid";

import { AppState, E_Routes } from "../../types/general";
import { messages } from "./messages";
import { useSelector } from "react-redux";
import { E_AllowedAccountStates } from "@opr-finance/feature-account";

export type T_IconProperties = {
    icon: string;
    text: string;
    route?: string;
    isMoreIcon?: boolean;
};

type MobileNavItemsProps = {
    isMorePageVisible: boolean;
    isTopupVisible: boolean;
    setIsMorePageVisible: Dispatch<SetStateAction<boolean>>;
};

export const MobileNavItems: FunctionComponent<MobileNavItemsProps> = ({
    isMorePageVisible,
    setIsMorePageVisible,
    isTopupVisible,
}) => {
    const { formatMessage: fm } = useIntl();
    const accountState = useSelector((state: AppState) => state.account.accountState);

    const location = useLocation();
    const history = useHistory();

    const isPathMatched = (path: string) => location.pathname === path;

    const iconsOnPage = 4;
    const iconPropertiesMap: Record<string, T_IconProperties> = {
        home: { icon: "home-lg", text: fm(messages.frontPage), route: E_Routes.FRONT },
        loan: { icon: "file-alt", text: fm(messages.mobileLoanInfo), route: E_Routes.LOAN },
        topup: { icon: "file-check", text: fm(messages.mobileTopUp), route: E_Routes.TOPUP },
        user: { icon: "user", text: fm(messages.userInfo), route: E_Routes.USER },
        contact: {
            icon: "comment-alt-dots",
            text: fm(messages.contactInfo),
            route: E_Routes.CONTACT,
        },
        more: { icon: "ellipsis-h", text: fm(messages.mobileMore), isMoreIcon: true },
    };

    const filteredMobileNavItems = () => {
        // Filter logic based on account state and isTopUpVisible flag
        const baseItems = [
            iconPropertiesMap.home,
            iconPropertiesMap.loan,
            iconPropertiesMap.topup,
            iconPropertiesMap.user,
            iconPropertiesMap.contact,
            iconPropertiesMap.more,
        ];

        if (accountState === E_AllowedAccountStates.COLLECTION) {
            return baseItems.filter(
                (item) =>
                    item.route !== E_Routes.LOAN &&
                    item.route !== E_Routes.TOPUP &&
                    item.icon !== "ellipsis-h"
            );
        }

        const filteredItems = baseItems.filter((item) => {
            if (!isTopupVisible && item.route === E_Routes.TOPUP) return false;
            return true;
        });

        // Check if the "more" icon is needed
        const isMorePageIconVisible = filteredItems.length > iconsOnPage + 1;

        if (!isMorePageIconVisible) {
            return filteredItems.filter((item) => item.icon !== "ellipsis-h");
        }
        return [...filteredItems.slice(0, iconsOnPage - 1), iconPropertiesMap.more];
    };

    const handleIconClick = (item: T_IconProperties) => {
        if (item.isMoreIcon) {
            setIsMorePageVisible(!isMorePageVisible);
        } else if (item.route) {
            history.push(item.route);
            setIsMorePageVisible(false);
        }
    };

    return (
        <StyledGrid styleConfig={{ root: MobileNavStyles.mobileNavItemsWrapper() }}>
            {filteredMobileNavItems().map((item, index) => (
                <Scroll to="app-base-container" key={`scroll-item-${index}`}>
                    <IconContainer
                        key={`item-${index}`}
                        icon={["fas", item.icon]}
                        size="lg"
                        text={item.text}
                        isActive={() => {
                            if (item.isMoreIcon) {
                                return isMorePageVisible;
                            } else {
                                return isPathMatched(`${item.route}`);
                            }
                        }}
                        onClick={() => handleIconClick(item)}
                    />
                </Scroll>
            ))}
        </StyledGrid>
    );
};

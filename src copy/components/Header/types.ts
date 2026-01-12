import { ReactNode } from "react";

export type NavigationItem = {
    linkTo: string;
    navigationText: string;
    active?: boolean;
};

export type NavigationItems = NavigationItem[];

export type NavigationProps = { navigationItems: NavigationItems };

export type NavigationLinkProps = {
    to: string;
    key: number;
    active?: boolean;
};

export type HeaderProps = {
    navigationVisible: boolean;
    isTopupVisible?: boolean;
    logo: ReactNode;
    button: ReactNode;
    authenticated: boolean;
};

import React from "react";
import { useIntl } from "react-intl";

import { StyledGrid } from "@opr-finance/component-grid";
import { StyledPageTitle } from "@opr-finance/component-content";
import { NoTopUpPageStyles } from "@opr-finance/theme-flex-online";
import { Font } from "@opr-finance/component-fonts";
import { StyledLink } from "@opr-finance/component-link-to";
import { Icon } from "@opr-finance/component-icon";
import { messages } from "./messages";

// add to contentfu

export function NotEligiblePage() {
    const { formatMessage: fm } = useIntl();
    const rules = [fm(messages.pageInfo1), fm(messages.pageInfo2)];
    return (
        <StyledGrid styleConfig={{ root: NoTopUpPageStyles.NoTopUpPageRootStyles() }}>
            <StyledPageTitle
                title={fm(messages.pageTitle)}
                styleConfig={{
                    pageTitleContainer: NoTopUpPageStyles.NoTopUpPageTitleContainer(),
                    pageTitleText: NoTopUpPageStyles.NoTopUpPageTitleText(),
                }}
            />
            <StyledGrid styleConfig={{ root: NoTopUpPageStyles.NoTopUpPageContainer() }}>
                <Font styleConfig={{ root: NoTopUpPageStyles.NoTopUpPageTitle() }}>
                    {fm(messages.subHeading1)}
                </Font>
                <StyledGrid styleConfig={{ root: NoTopUpPageStyles.containerInfoList() }}>
                    {rules.map((item, index) => (
                        <StyledGrid
                            styleConfig={{ root: NoTopUpPageStyles.containerInfo() }}
                            key={`item-${index}`}>
                            <Icon icon={["fas", "circle"]} fontSize="8px" cursor="" />
                            <Font styleConfig={{ root: NoTopUpPageStyles.NoTopUpPageText() }}>
                                {item}
                            </Font>
                        </StyledGrid>
                    ))}
                </StyledGrid>
                <StyledGrid styleConfig={{ root: NoTopUpPageStyles.NoTopUpPageContent() }}>
                    <Font styleConfig={{ root: NoTopUpPageStyles.NoTopUpPageTitle() }}>
                        {fm(messages.subHeading2)}
                    </Font>
                    <Font styleConfig={{ root: NoTopUpPageStyles.NoTopUpPageContactInfo() }}>
                        {fm(messages.contactPhone)}
                    </Font>

                    <Font styleConfig={{ root: NoTopUpPageStyles.NoTopUpPageContactInfo() }}>
                        {fm(messages.textEmail)}
                        <StyledLink
                            href={fm(messages.emailLink)}
                            styleConfig={{ root: NoTopUpPageStyles.NoTopUpPageLink() }}>
                            {fm(messages.emailLinkText)}
                        </StyledLink>
                    </Font>
                </StyledGrid>
            </StyledGrid>
        </StyledGrid>
    );
}

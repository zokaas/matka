import React from "react";

import { Loader } from "@opr-finance/component-loader";
import { StyledGrid } from "@opr-finance/component-grid";
import { LoginPageStyles } from "@opr-finance/theme-flex-online";
import { Font } from "@opr-finance/component-fonts";
import { useIntl } from "react-intl";

export function LoginPage() {
    const messages = {
        loadingPageWait: {
            id: "flex-online-se-loading-page",
        },
    };

    const { formatMessage: fm } = useIntl();

    return (
        <StyledGrid styleConfig={{ root: LoginPageStyles.loginPageRootStyles }}>
            <StyledGrid styleConfig={{ root: LoginPageStyles.contentContainer() }}>
                <Font styleConfig={{ root: LoginPageStyles.heading() }}>
                    {fm(messages.loadingPageWait)}
                </Font>
            </StyledGrid>
            <Loader isLoading={true}></Loader>
        </StyledGrid>
    );
}

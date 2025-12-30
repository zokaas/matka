import { StyledGrid } from "@opr-finance/component-grid";
import React from "react";
import { useIntl } from "react-intl";

import { Account } from "@opr-finance/feature-account";
import { FrontPageStyles } from "@opr-finance/theme-flex-online";

import { messages } from "../../pages/Frontpage/messages";

export function AccountDetailBlock() {
    const { formatMessage: fm } = useIntl();

    return (
        <StyledGrid styleConfig={{ root: FrontPageStyles.loanInfoContainer() }}>
            <Account
                country="Sweden"
                messages={{
                    title: fm(messages.frontPageHeadingSummary),
                    availableText: fm(messages.frontPageSummaryAvailableText),
                    withdrawnText: fm(messages.frontPageSummaryWithdrawnText),
                    creditLimitText: fm(messages.frontPageSummaryCreditlimitText),
                    infoText: fm(messages.frontPageSummaryInfo),
                }}
                styleConfig={{
                    text: null,
                    today: null,
                    userInfoTitle: null,
                    userInfoContent: null,
                    title: FrontPageStyles.loanInfoTitle(),
                    amount: null,
                    balanceContainer: FrontPageStyles.balanceContainer(),
                    remainingCreditWrapper: FrontPageStyles.remainingCreditWrapper(),
                    remainingCreditText: FrontPageStyles.remainingCreditText(),
                    remainingCreditAmount: FrontPageStyles.remainingCreditAmount(),
                    percentageContainer: FrontPageStyles.percentageContainer(),
                    creditWrapper: FrontPageStyles.creditWrapper(),
                    creditUsed: FrontPageStyles.creditUsed(),
                    creditTotal: FrontPageStyles.creditTotal(),
                    creditText: FrontPageStyles.creditText(),
                    balanceInfo: FrontPageStyles.balanceInfo(),
                }}
            />
        </StyledGrid>
    );
}

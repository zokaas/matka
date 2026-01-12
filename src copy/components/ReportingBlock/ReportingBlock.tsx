import { useIntl } from "react-intl";

import { StyledGrid } from "@opr-finance/component-grid";
import { Font } from "@opr-finance/component-fonts";
import { LoanPageStyles } from "@opr-finance/theme-flex-online";

import { messages } from "../../pages/LoanPage/messages";
import { useSelector } from "react-redux";
import { AppState } from "../../types/general";
import { formatOrgNumSwe } from "@opr-finance/utils";
import { Reporting, reportingUtils } from "@opr-finance/feature-reporting";

export function ReportingBlock() {
    const { formatMessage: fm } = useIntl();
    const { getLastReportingYear, getReportingYears } = reportingUtils;

    const { info } = useSelector((state: AppState) => state.customer.companyInfo);
    const { account } = useSelector((state: AppState) => state.account);
    const orgNumber = info?.organizationNumber ? formatOrgNumSwe(info?.organizationNumber) : "";
    const cid = process.env.REACT_APP_CLIENT_ID as string;
    const locale = "sv";
    const dateFormat = "yyyy-MM-dd";

    const gwUrl = process.env.REACT_APP_BFF_URL;
    const pdfGeneratorUrl = `${gwUrl}/pdf/${cid}/flex/se/online/overview`;

    if (account && account.createDate) {
        // const accountCreatedDate = "2018-12-06"; //TODO For testing purpose, remove this later and uncomment the below
        const accountCreatedDate = account.createDate;

        return (
            <StyledGrid styleConfig={{ root: LoanPageStyles.loanPageContainerReporting() }}>
                <StyledGrid
                    styleConfig={{
                        root: LoanPageStyles.loanPageTransactionContainer(),
                    }}>
                    {orgNumber && account?.createDate ? (
                        <Reporting
                            cid={cid}
                            accountCreatedDate={account.createDate}
                            translations={{
                                blockHeading: fm(messages.reportingBlockHeading),
                                reportingInstructions: fm(messages.reportingBlockInstructionsText),
                                noReportsMessage: fm(messages.reportingBlockNoReportsMessage),
                                dateInputPlaceholder: fm(
                                    messages.reportingBlockDateInputPlaceholder
                                ),
                                buttonText: fm(messages.reportingBlockButtonText),
                                loadingText: fm(messages.reportingBlockLoadingText),
                                errorText: fm(messages.reportingBlockErrorText),
                            }}
                            styles={{
                                rootContainer: LoanPageStyles.reportingRootContainer(),
                                blockHeadingStyles: LoanPageStyles.reportingBlockHeading(),
                                reportingInstructionsText:
                                    LoanPageStyles.reportingInstructionsText(),
                                reportsContainer: LoanPageStyles.reportsContainer,
                                button: LoanPageStyles.reportingButton(),
                                buttonText: LoanPageStyles.reportingButtonText(),
                                reportingDatepicker: LoanPageStyles.reportingDatepicker(),
                                errorText: LoanPageStyles.reportingErrorText(),
                            }}
                            pdfGeneratorUrl={pdfGeneratorUrl}
                            locale={locale}
                            dateFormat={dateFormat}
                        />
                    ) : (
                        <Font
                            as="p"
                            styleConfig={{ root: LoanPageStyles.reportingInstructionsText }}>
                            {fm(messages.reportingBlockNoAccountDataMessage)}
                        </Font>
                    )}
                </StyledGrid>
            </StyledGrid>
        );
    }
}

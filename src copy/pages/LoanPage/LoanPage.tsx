import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from "react-router-dom";

import { StyledGrid } from "@opr-finance/component-grid";
import { StyledPageTitle } from "@opr-finance/component-content";
import { LoanPageStyles } from "@opr-finance/theme-flex-online";
import { CurrencyLocale, CurrencyFormat, currency } from "@opr-finance/component-currency";
import { smeDocumentActions } from "@opr-finance/feature-document";
import { T_FormattedInvoice } from "@opr-finance/feature-statements";
import { E_AllowedAccountStates } from "@opr-finance/feature-account";
import { ConsoleLogger, LOG_LEVEL } from "@opr-finance/feature-console-logger";
import { add, formatOrgNumSwe, remove } from "@opr-finance/utils";

import { LoanPageProps, T_AccountData } from "./types";
import { messages } from "./messages";

import { AppState, E_Routes } from "../../types/general";
import { TransactionsBlock } from "../../components/TransactionsBlock/TransactionsBlock";
import { InvoicesBlock } from "../../components/InvoicesBlock/InvoicesBlock";
import { InfoAndContactBlock } from "../../components/InfoAndContactBlock/InfoAndContactBlock";
import { onComponentMounted } from "../../utils";
import { WithdrawLoanPageBlock } from "../../components/WithdrawLoanPageBlock/WithdrawLoanPageBlock";
import { ReportingBlock } from "../../components/ReportingBlock/ReportingBlock";
import { KycNotice } from "../../components/KycNotice/KycNotice";

export function LoanPage(props: LoanPageProps) {
    const logger = new ConsoleLogger({ level: LOG_LEVEL });
    const dispatch = useDispatch();
    const { formatMessage: fm } = useIntl();

    const documentInUse = process.env.REACT_APP_DISPLAY_DOCUMENTS === "1" ? true : false;
    const showReportingBlock = process.env.REACT_APP_REPORTING === "1" ? true : false;

    const { authenticated, logoutInProgress } = useSelector((state: AppState) => state.session);
    const accountState = useSelector((state: AppState) => state.account.accountState);

    const invoicesData: Array<T_FormattedInvoice> = useSelector(
        (state: AppState) => state.invoices.formatted
    );
    const { statementTransactions } = useSelector((state: AppState) => state.transactions);
    const country: string = useSelector((state: AppState) => state.transactions.config.country);
    const account = useSelector((state: AppState) => state.account.account);
    const company = useSelector((state: AppState) => state.customer.companyInfo.info);

    const { defaultPromissoryNoteId, activeAccountId, token, gwUrl, mockApiCalls } = useSelector(
        (state: AppState) => state.document.config
    );

    useEffect(() => {
        onComponentMounted(boardMemberId);
    }, []);

    const boardMemberId = useSelector((state: AppState) => {
        return state.customer?.companyInfo?.boardmembers
            ? state.customer?.companyInfo?.boardmembers[0].id
            : "";
    });

    const formatAmount = (amount: number) => {
        return currency({
            value: amount,
            locale: CurrencyLocale[country],
            currency: CurrencyFormat[country],
            style: "currency",
        });
    };

    const availableBalanceCurrency = formatAmount(account?.remainingPrincipal || 0);

    const remainingDebt = formatAmount(account?.totalUnpaidInvoiceAmount || 0);

    const accountData: T_AccountData = {
        companyName: company?.companyName || "",
        organisationNumber: company?.organizationNumber
            ? formatOrgNumSwe(company.organizationNumber)
            : "",
        accountNumber: account?.accountNumber || "",
        creationDate: account?.createDate || "",
        remainingPrincipal: availableBalanceCurrency,
        remainingDebt,
    };

    const [applicationData, setApplicationData] = useState<{ withdrawnAmount: string }>({
        withdrawnAmount: "0",
    });

    const [validForms, setValidForms] = useState<string[]>(() => {
        const defaultValids: string[] = ["withdrawnForm"];
        return defaultValids;
    });

    const handleChange = (isValid: boolean, formName, form) => {
        if (isValid) {
            setValidForms(add(validForms, formName));
        } else {
            setValidForms(remove(validForms, formName, (a, b) => a === b));
        }

        setApplicationData({
            ...applicationData,
            ...form,
        });
    };

    const handleClick = () => {
        dispatch(
            smeDocumentActions.smeFetchDocumentTrigger({
                token,
                gwUrl,
                mockApiCalls,
                accountId: activeAccountId,
                documentId: defaultPromissoryNoteId,
            })
        );
    };

    const getPdfClick = (
        event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
        documentId: string
    ) => {
        event.preventDefault();
        logger.log("documentId", documentId);
        dispatch(
            smeDocumentActions.smeFetchDocumentTrigger({
                documentId,
                accountId: activeAccountId,
                token,
                mockApiCalls,
                gwUrl,
            })
        );
    };

    if (
        (!authenticated || accountState === E_AllowedAccountStates.COLLECTION) &&
        !logoutInProgress
    ) {
        return <Redirect to={E_Routes.ROOT} />;
    }

    return (
        <StyledGrid styleConfig={{ root: LoanPageStyles.loanPageRootStyles() }}>
            <KycNotice />
            <StyledPageTitle
                title={fm(messages.pageTitle)}
                styleConfig={{
                    pageTitleContainer: props.styleConfig.titleBox,
                    pageTitleText: props.styleConfig.pageTitle,
                }}
            />
            <InfoAndContactBlock
                documentInUse={documentInUse}
                defaultPromissoryNoteId={defaultPromissoryNoteId}
                handleClick={handleClick}
                availableBalanceCurrency={availableBalanceCurrency}
            />
            <StyledGrid styleConfig={{ root: LoanPageStyles.loanPageSections() }}>
                {/* <WithdrawButtonMobile /> */}
                <WithdrawLoanPageBlock handleChange={handleChange} />
                <TransactionsBlock
                    statementTransactions={statementTransactions}
                    accountData={accountData}
                />
                {showReportingBlock && <ReportingBlock />}
                <InvoicesBlock data={invoicesData} onClick={getPdfClick} />
            </StyledGrid>
        </StyledGrid>
    );
}

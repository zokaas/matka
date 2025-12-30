import React, { useEffect, useRef, useState } from "react";
import { useIntl } from "react-intl";
import { format } from "date-fns";

import { StyledGrid } from "@opr-finance/component-grid";
import { Font } from "@opr-finance/component-fonts";
import { StyledButton } from "@opr-finance/component-button";
import { DatepickerSelect } from "@opr-finance/component-datepicker";
import { ButtonLoader } from "@opr-finance/component-loader";
import { ButtonStyles, FontsStyles, LoanPageStyles } from "@opr-finance/theme-flex-online";
import { ConsoleLogger, LOG_LEVEL } from "@opr-finance/feature-console-logger";

import { Transactions } from "../Transactions/Transactions";
import { messages } from "../../pages/LoanPage/messages";
import {
    I_SmeFormattedTransactions,
    smeTransactionsActions,
} from "@opr-finance/feature-transactions-v2";
import { generatePdf, createTransactionsData } from "@opr-finance/feature-pdf-generator";

import { useDispatch, useSelector } from "react-redux";
import { CheckboxField } from "@opr-finance/component-forms";
import { Icon } from "@opr-finance/component-icon";
import { AppState } from "../../types/general";
import { T_TransactionsProps } from "./types";
import { useWindowSize } from "@opr-finance/utils";
import ReactDOM from "react-dom";
import { PrepairingPdfComponent } from "@opr-finance/feature-reporting/src/components/PrepairingPdfComponent";

export function TransactionsBlock({ statementTransactions, accountData }: T_TransactionsProps) {
    const logger = new ConsoleLogger({ level: LOG_LEVEL });
    const { formatMessage: fm } = useIntl();
    const dispatch = useDispatch();
    const dateFormat = "yyyy-MM-dd";
    const dateFormatLocal = "yyyy-MM-dd";
    const transactionsConfig = useSelector((state: AppState) => state.transactions.config);
    const { width } = useWindowSize();

    const currentDate = new Date();
    const earliestDate = new Date(1990);

    let startDateConfig = useSelector((state: AppState) => state.transactions.config.startDate);
    if (!startDateConfig) startDateConfig = "";
    let endDateConfig = useSelector((state: AppState) => state.transactions.config.endDate);
    if (!endDateConfig) endDateConfig = currentDate.toISOString().split("T")[0];

    const [endDate, setEndDate] = useState<string>(endDateConfig);
    const [startDate, setStartDate] = useState<string>(startDateConfig);
    const [showAll, setShowAll] = useState<boolean>(false);
    const [isRequestPending, setIsRequestPending] = useState(false);
    const [isPdfLoadingError, setPdfLoadingError] = useState(false);

    const gwUrl = process.env.REACT_APP_BFF_URL;
    const cid = process.env.REACT_APP_CLIENT_ID as string;

    const checkFirstRender = useRef(true);

    useEffect(() => {
        //skip useEffect from running on the first render
        if (checkFirstRender.current) {
            checkFirstRender.current = false;
            return;
        }
        dispatch(
            smeTransactionsActions.smeFetchTransactionsInitializer({
                ...transactionsConfig,
                startDate,
                endDate,
            })
        );
        dispatch(smeTransactionsActions.smeFetchTransactionsTrigger({ startDate, endDate }));
    }, [startDate, endDate]);

    const handleDateSelect = (selectedDate: string | Date, attribute: string) => {
        const date =
            typeof selectedDate === "string" ? selectedDate : format(selectedDate, dateFormat);
        if (attribute === "startDate") setStartDate(date);
        else setEndDate(date);
    };

    const formateToString = (date: string | Date) => {
        const formattedDate = typeof date === "string" ? date : format(date, dateFormatLocal);
        return formattedDate;
    };

    const formateToDate = (date: string | Date) => {
        const formattedDate = typeof date === "string" ? new Date(date) : date;
        return formattedDate;
    };

    const configureTransactionsForPdf = () => {
        const transactions = statementTransactions.map((transaction) => {
            const type =
                transaction.transactionType && messages.hasOwnProperty(transaction.transactionType)
                    ? fm(messages[transaction.transactionType])
                    : "";
            return {
                amount: transaction.formattedAmount || "",
                transactionDate: transaction.transactionDate || "",
                date: transaction.formattedDate || "",
                type,
            };
        });
        return transactions;
    };

    const generatePdfTransactions = async () => {
        const pdfWindow = window.open("", "POPUP_WINDOW", "");

        ReactDOM.render(<PrepairingPdfComponent />, pdfWindow!.document.body);

        setIsRequestPending(true);
        const transactions = configureTransactionsForPdf();
        const data = createTransactionsData(transactions, accountData, startDate, endDate);
        const url = `${gwUrl}/pdf/${cid}/flex/se/online/transactions`;
        const token = localStorage.getItem("token");
        logger.log("generatePdfTransactions");

        if (!token) {
            logger.log("got no token, back to front page");
            return (window.location.href = "/");
        }

        try {
            const pdfUrl = (await generatePdf(data, url, token)) as string;
            logger.log(pdfUrl);

            setPdfLoadingError(false);

            pdfWindow!.location.href = pdfUrl;

            setIsRequestPending(false);
        } catch (error) {
            setPdfLoadingError(true);
            setIsRequestPending(false);
            logger.log("error in generatePdfTransactions", error);

            pdfWindow!.close();
        }
    };

    const configureTransactionsColumns = () => {
        return [
            {
                name: fm(messages.TableDate),
                selector: (rowData: I_SmeFormattedTransactions) => rowData.formattedDate,
            },
            {
                name: fm(messages.TableTransactionsType),
                cell: (rowData: I_SmeFormattedTransactions) =>
                    rowData.transactionType && messages.hasOwnProperty(rowData.transactionType)
                        ? fm(messages[rowData.transactionType])
                        : "Default message",
            },
            {
                name: fm(messages.TableAmount),
                selector: (rowData: I_SmeFormattedTransactions) => rowData.formattedAmount,
                right: true,
            },
        ];
    };

    const configureTransactionsMobileColumns = (styleConfig) => {
        return [
            {
                name: "",
                cell: (rowData: I_SmeFormattedTransactions) => {
                    const cellTitle =
                        rowData.transactionType && messages.hasOwnProperty(rowData.transactionType)
                            ? fm(messages[rowData.transactionType])
                            : "Default message";

                    return (
                        <StyledGrid styleConfig={{ root: styleConfig.mobileTableContainer }}>
                            <StyledGrid styleConfig={{ root: styleConfig.invoiceInfoContainer }}>
                                <Font styleConfig={{ root: styleConfig.invoicesTableText }}>
                                    {cellTitle}
                                </Font>
                                <Font styleConfig={{ root: styleConfig.invoicesTableText }}>
                                    {rowData.formattedDate}
                                </Font>
                            </StyledGrid>
                            <StyledGrid styleConfig={{ root: styleConfig.invoiceAmountContainer }}>
                                <Font styleConfig={{ root: styleConfig.invoicesTableText }}>
                                    {rowData.formattedAmount}
                                </Font>
                            </StyledGrid>
                        </StyledGrid>
                    );
                },
            },
        ];
    };

    return (
        <StyledGrid styleConfig={{ root: LoanPageStyles.loanPageContainerTransactions() }}>
            <StyledGrid
                styleConfig={{
                    root: LoanPageStyles.loanPageTransactionHeading(),
                }}>
                <Font styleConfig={{ root: FontsStyles.fontBoxTitle() }} as="p">
                    {fm(messages.TableHeadingTransactions)}
                </Font>
            </StyledGrid>
            <StyledGrid
                styleConfig={{
                    root: LoanPageStyles.loanPageTransactionBlockContainer(),
                }}>
                <StyledGrid
                    styleConfig={{ root: LoanPageStyles.loanPageTransactionTableContainer() }}>
                    <StyledGrid
                        styleConfig={{
                            root: LoanPageStyles.loanPageTransactionTableDatesContainer(),
                        }}>
                        <DatepickerSelect
                            config={{
                                handleDate: (e) => handleDateSelect(e, "startDate"),
                                name: "startDate",
                                value: formateToString(startDate),
                                dateFormat: dateFormat,
                                placeholder: fm(messages.fromDate),
                                locale: "sv",
                                fromDate: earliestDate,
                                toDate: endDate ? formateToDate(endDate) : new Date(),
                            }}
                            styleConfig={{
                                regularStyles: LoanPageStyles.loanPageDatePicker(),
                            }}
                        />
                        <Font
                            styleConfig={{
                                root: { margin: "0 10px" },
                            }}>
                            —
                        </Font>
                        <DatepickerSelect
                            config={{
                                handleDate: (e) => handleDateSelect(e, "endDate"),
                                name: "endDate",
                                value: formateToString(endDate),
                                dateFormat: dateFormat,
                                placeholder: "To",
                                locale: "sv",
                                toDate: currentDate,
                                fromDate: startDate ? formateToDate(startDate) : earliestDate,
                            }}
                            styleConfig={{ regularStyles: LoanPageStyles.loanPageDatePicker() }}
                        />
                        <StyledGrid
                            styleConfig={{
                                root: LoanPageStyles.loanPageShowAllTransactionsActionsContainer(),
                            }}>
                            <StyledGrid
                                onClick={() => {
                                    setStartDate("");
                                    setEndDate(currentDate.toISOString().split("T")[0]);
                                }}
                                styleConfig={{ root: LoanPageStyles.loanPageDateClearBtn }}>
                                {fm(messages.clearDates).toLocaleUpperCase()}
                            </StyledGrid>
                            <StyledGrid
                                styleConfig={{
                                    root: LoanPageStyles.loanPageShowAllTransactionsCheckboxContainerTop(),
                                }}>
                                <CheckboxField
                                    checked={showAll}
                                    checkedIcon={<Icon fontSize={"20px"} icon={["fa", "check"]} />}
                                    onClick={() => setShowAll(!showAll)}
                                    styleConfig={{
                                        root: LoanPageStyles.showAllTransactionsCheckbox(),
                                        checked: {},
                                    }}
                                />
                                <Font styleConfig={{ root: { marginLeft: "10px" } }}>
                                    {" "}
                                    {fm(messages.showAll)}
                                </Font>
                            </StyledGrid>
                        </StyledGrid>
                    </StyledGrid>
                    <Transactions
                        showAll={showAll}
                        data={statementTransactions}
                        columns={configureTransactionsColumns()}
                        mobileColumns={configureTransactionsMobileColumns({
                            mobileTableContainer: LoanPageStyles.mobileTableContainer(),
                            invoiceInfoContainer: LoanPageStyles.invoiceInfoContainer(),
                            invoiceAmountContainer: LoanPageStyles.invoiceAmountContainer(),
                            invoicesTableText: LoanPageStyles.invoicesTableText(),
                        })}
                    />
                    {showAll && (
                        <StyledGrid
                            styleConfig={{
                                root: LoanPageStyles.loanPageShowAllTransactionsCheckboxContainerBottom(),
                            }}>
                            <CheckboxField
                                checked={showAll}
                                checkedIcon={<Icon fontSize={"20px"} icon={["fa", "check"]} />}
                                onClick={() => setShowAll(!showAll)}
                                styleConfig={{
                                    root: LoanPageStyles.showAllTransactionsCheckbox(),
                                    checked: {},
                                }}
                            />
                            <Font styleConfig={{ root: { marginLeft: "10px" } }}>Show all</Font>
                        </StyledGrid>
                    )}
                </StyledGrid>
                <StyledGrid
                    styleConfig={{
                        root: LoanPageStyles.loanPageTransactionSideInfoContainer(),
                    }}>
                    <StyledButton
                        onClick={() => generatePdfTransactions()}
                        disabled={isRequestPending || statementTransactions.length === 0}
                        styleConfig={{
                            root: {
                                ...ButtonStyles.greenButtonStyles(),
                                marginTop: 0,
                                order: [2, 1],
                                width: ["100%", "auto"],
                            },
                        }}>
                        <Font styleConfig={{ root: ButtonStyles.buttonFontStyles() }}>
                            {isRequestPending ? (
                                <>
                                    <span> {fm(messages.reportingBlockLoadingText)}</span>
                                    <ButtonLoader
                                        size="1x"
                                        icon={["fas", "spinner"]}
                                        styles={{ margin: "0 5px", color: "white" }}
                                    />
                                </>
                            ) : (
                                fm(messages.downloadTransactions)
                            )}
                        </Font>
                    </StyledButton>
                    <StyledGrid styleConfig={{ root: LoanPageStyles.sideInfoContainerTextBox() }}>
                        {!isPdfLoadingError ? (
                            <Font as="p" styleConfig={{ root: {} }}>
                                {fm(messages.pdfDownloadInstructions)}
                            </Font>
                        ) : (
                            <Font styleConfig={{ root: LoanPageStyles.errorMessage }}>
                                {fm(messages.reportingBlockErrorText)}
                            </Font>
                        )}
                    </StyledGrid>
                </StyledGrid>
            </StyledGrid>
        </StyledGrid>
    );
}

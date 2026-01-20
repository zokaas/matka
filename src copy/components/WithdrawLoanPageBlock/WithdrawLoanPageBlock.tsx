import React, { useState } from "react";
import { useIntl } from "react-intl";
import { ButtonStyles, LoanPageStyles, FrontPageStyles } from "@opr-finance/theme-flex-online";

import { ConsoleLogger, LOG_LEVEL } from "@opr-finance/feature-console-logger";
import { messages } from "../../pages/Frontpage/messages";
import { useDispatch, useSelector } from "react-redux";
import { smeWithdrawActions, StyledWithdraw } from "@opr-finance/feature-withdraw";
import { AppState } from "../../types/general";
import { selectOverdueDays, selectUnpaidAmount } from "../../selectors";
import { T_WithdrawProps } from "./types";
import { withdrawalRules } from "../../constants/rules";
import { shouldBlockWithdrawal } from "../../utils";

export function WithdrawLoanPageBlock(props: T_WithdrawProps) {
    const logger = new ConsoleLogger({ level: LOG_LEVEL });
    const dispatch = useDispatch();
    const { formatMessage: fm } = useIntl();
    const account = useSelector((state: AppState) => state.account.account);
    const accountState = useSelector((state: AppState) => state.account.accountState);
    const kycState = useSelector((state: AppState) => state.kyc.kycStatus);

    const availableCreditLimit = account?.availableCreditLimit;
    const isIBANRegistered = account?.disbursementAccount?.externalAccountNumber ? true : false;
    const overdueDays = useSelector(selectOverdueDays);
    const unpaidAmount = useSelector(selectUnpaidAmount);
    const blockedStatus = account?.blockedStatus ? account.blockedStatus : false;

    const [isWithdraw, setIsWithdraw] = useState(false);
    const isKycOverdue = shouldBlockWithdrawal(kycState);

    return (
        <StyledWithdraw
            styleConfig={{
                creditRaiseContainer: LoanPageStyles.creditRaiseContainer(),
                creditRaiseTitle: FrontPageStyles.creditRaiseTitle(),
                creditRaiseWrapper: LoanPageStyles.creditRaiseWrapper(),
                creditRaiseInputColumn: LoanPageStyles.creditRaiseInputColumn(),
                creditRaiseInputLabel: LoanPageStyles.creditRaiseInputLabel(),
                creditRaiseInputSectionWrapper: LoanPageStyles.creditRaiseInputSectionWrapper(),
                creditIncreaseInputRow: LoanPageStyles.creditIncreaseInputRow(),
                creditRaiseInputWrapper: LoanPageStyles.creditRaiseInputWrapper(),
                creditRaiseInput: LoanPageStyles.creditRaiseInput(),
                creditRaiseEuroSign: FrontPageStyles.creditRaiseEuroSign({
                    marginRight: "0px",
                    marginLeft: "10px",
                    order: 1,
                }),
                greenButtonStyles: ButtonStyles.greenButtonStyles({
                    width: "150px",
                    marginTop: ["10px"],
                }),
                disabledButtonStyles: ButtonStyles.disabledButtonStyles({
                    width: "150px",
                    marginTop: ["10px"],
                }),
                buttonFontStyles: ButtonStyles.buttonFontStyles(),
                creditRaiseInfoColumn: FrontPageStyles.creditRaiseInfoColumn(),
                creditRaiseText: FrontPageStyles.creditRaiseText({ textAlign: "left" }),
                errorMessage: FrontPageStyles.errorMessage(),
                rulesContainer: FrontPageStyles.rulesContainer(),
                notEligibleText: LoanPageStyles.errorMessage(),
                withdrawalSentMessageText: LoanPageStyles.withdrawalSentMessageText(),
                buttonInfo: FrontPageStyles.buttonInfo(),
            }}
            max={availableCreditLimit ? Math.floor(availableCreditLimit) : 0}
            onSubmit={(value: number): void => {
                setIsWithdraw(true);
                dispatch(
                    smeWithdrawActions.withdrawTrigger({
                        appliedAmount: value,
                    })
                );
            }}
            isWithdrawn={isWithdraw}
            withdrawalRules={withdrawalRules}
            currentForm="withdrawnForm"
            blurredForms={[]}
            validForms={[]}
            formData={{ withdrawAmount: "" }}
            onChange={(isValid, form) => {
                props.handleChange(isValid, "withdrawAmount", form);
            }}
            onBlur={() => {}}
            onFocus={() => {}}
            availableCreditLimit={availableCreditLimit && Math.floor(availableCreditLimit)}
            unit="Kr"
            overdueDays={overdueDays}
            unpaidAmount={unpaidAmount}
            accountState={accountState}
            isIbanMissing={!isIBANRegistered}
            blockedStatus={blockedStatus}
            kycOverdue={isKycOverdue}
            isLoanPage={true}
            messages={{
                title: fm(messages.withdrawTitle),
                inputLabel: fm(messages.withdrawInputLabel),
                inputPlaceholder: fm(messages.withdrawInputplaceholder),
                buttonText: fm(messages.withdrawButtontext),
                buttonInfo: fm(messages.withdrawButtonInfoText),
                info1Text: fm(messages.withdrawInfo1),
                info2Text: fm(messages.withdrawInfo2),
                info3Text: fm(messages.withdrawInfo3),
                info4Text: fm(messages.withdrawInfo4),
                withdrawSentMessage: fm(messages.withdrawSentMessage),
                withdrawAlertText1: fm(messages.withdrawAlertText1),
                withdrawAlertText2: fm(messages.withdrawAlertText2),
                euroCurrency: fm(messages.euroCurrency),
                notEligibleText: fm(messages.notEligibleText),
                withdrawOverdueInvoice: fm(messages.withdrawOverdueInvoice),
                withdrawAvailableCreditTooSmall: fm(messages.withdrawAvailableCreditTooSmall),
                withdrawNotAbleToMakeWithdrawal: fm(messages.withdrawNotAbleToMakeWithdrawal),
                withdrawNoIbanNumber: fm(messages.withdrawNoIbanNumber),
                withdrawBlockedByKyc: fm(messages.withdrawBlockedByKyc),
            }}
        />
    );
}

import React, { useState } from "react";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";

import { ButtonStyles, FrontPageStyles } from "@opr-finance/theme-flex-online";
import { smeWithdrawActions, StyledWithdraw } from "@opr-finance/feature-withdraw";

import { T_WithdrawProps } from "./types";
import { messages } from "../../pages/Frontpage/messages";

import { withdrawalRules } from "../../constants/rules";
import { shouldBlockWithdrawal } from "../../utils";
import { AppState } from "../../types/general";

export function WithdrawBlock(props: T_WithdrawProps) {
    const { formatMessage: fm } = useIntl();
    const dispatch = useDispatch();
    const kycState = useSelector((state: AppState) => state.kyc);

    const [isWithdrawn, setIsWithdrawn] = useState(false);

    const isKycOverdue = shouldBlockWithdrawal(kycState);
console.log('KYC State:', kycState);
console.log('Should block withdrawals?', isKycOverdue);

    return (
        <StyledWithdraw
            styleConfig={{
                creditRaiseContainer: FrontPageStyles.creditRaiseContainer(),
                creditRaiseTitle: FrontPageStyles.creditRaiseTitle(),
                creditRaiseWrapper: FrontPageStyles.creditRaiseWrapper(),
                creditRaiseInputColumn: FrontPageStyles.creditRaiseInputColumn(),
                creditIncreaseInputRow: FrontPageStyles.creditIncreaseInputRow(),
                creditRaiseInputWrapper: FrontPageStyles.creditRaiseInputWrapper(),
                creditRaiseInput: FrontPageStyles.creditRaiseInput(),
                creditRaiseEuroSign: FrontPageStyles.creditRaiseEuroSign({
                    marginRight: "0px",
                    marginLeft: "10px",
                    order: 1,
                }),
                greenButtonStyles: ButtonStyles.greenButtonStyles({
                    width: "150px",
                    marginTop: "10px",
                }),
                disabledButtonStyles: ButtonStyles.disabledButtonStyles({
                    width: "150px",
                    marginTop: "10px",
                }),
                buttonFontStyles: ButtonStyles.buttonFontStyles(),
                creditRaiseInfoColumn: FrontPageStyles.creditRaiseInfoColumn(),
                creditRaiseText: FrontPageStyles.creditRaiseText({ textAlign: "left" }),
                errorMessage: FrontPageStyles.errorMessage(),
                rulesContainer: FrontPageStyles.rulesContainer(),
                notEligibleText: FrontPageStyles.notEligibleReasonContainer(),
                buttonInfo: FrontPageStyles.buttonInfo(),
            }}
            max={props.availableCreditLimit ? Math.floor(props.availableCreditLimit) : 0}
            onSubmit={(value: number): void => {
                setIsWithdrawn(true);
                dispatch(
                    smeWithdrawActions.withdrawTrigger({
                        appliedAmount: value,
                    })
                );
            }}
            withdrawalRules={withdrawalRules}
            isWithdrawn={isWithdrawn}
            currentForm="withdrawnForm"
            blurredForms={[]}
            validForms={[]}
            formData={{ withdrawAmount: "" }}
            onChange={(isValid, form) => {
                props.handleChange(isValid, "withdrawAmount", form);
            }}
            onBlur={() => {}}
            onFocus={() => {}}
            unit="Kr"
            availableCreditLimit={
                props.availableCreditLimit && Math.floor(props.availableCreditLimit)
            }
            overdueDays={props.overdueDays}
            unpaidAmount={props.unpaidAmount}
            accountState={props.accountState}
            blockedStatus={props.blockedStatus}
            kycOverdue={isKycOverdue}
            messages={{
                title: fm(messages.withdrawTitle),
                inputLabel: fm(messages.withdrawInputLabel),
                inputPlaceholder: fm(messages.withdrawInputplaceholder),
                buttonText: fm(messages.withdrawButtontext),
                buttonInfo: fm(messages.withdrawButtonInfoText),
                info1Text: fm(messages.withdrawInfo1),
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

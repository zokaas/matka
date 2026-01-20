import React, { useState } from "react";
import * as yup from "yup";
import { SystemStyleObject } from "@styled-system/css";
import * as VP from "@opr-finance/api-definitions";

import { StyledGrid } from "@opr-finance/component-grid";
import { Font } from "@opr-finance/component-fonts";
import { useForm, TextField, DefaultFormProps } from "@opr-finance/component-forms";
import { StyledButton } from "@opr-finance/component-button";
import { isNumber, checkWithdrawEligibilityWithReasons } from "@opr-finance/utils";
import { Icon } from "@opr-finance/component-icon";
import { T_WithdrawalRules } from "@opr-finance/utils";
import { E_WithdrawNotEligibleReason } from "@opr-finance/utils/src/eligibilityCheck";

export type T_StyledWithdrawProps = {
    styleConfig: {
        id?: string;
        creditRaiseContainer: SystemStyleObject;
        creditRaiseTitle: SystemStyleObject;
        creditRaiseWrapper: SystemStyleObject;
        creditRaiseInputColumn: SystemStyleObject;
        creditRaiseInputLabel?: SystemStyleObject;
        creditRaiseInputSectionWrapper?: SystemStyleObject;
        creditIncreaseInputRow: SystemStyleObject;
        creditRaiseInputWrapper: SystemStyleObject;
        creditRaiseInput: SystemStyleObject;
        creditRaiseEuroSign: SystemStyleObject;
        greenButtonStyles: SystemStyleObject;
        disabledButtonStyles: SystemStyleObject;
        buttonFontStyles: SystemStyleObject;
        creditRaiseInfoColumn: SystemStyleObject;
        creditRaiseText: SystemStyleObject;
        errorMessage: SystemStyleObject;
        rulesContainer: SystemStyleObject;
        notEligibleText: SystemStyleObject;
        withdrawalSentMessageText?: SystemStyleObject;
        buttonInfo: SystemStyleObject;
    };
    max: number;
    onSubmit: (value: number) => void;
    isWithdrawn: boolean;
    unit: string;
    isLoading?: boolean;
    availableCreditLimit: number | undefined;
    accountState: VP.components["schemas"]["AccountState"] | undefined;
    overdueDays: number | undefined;
    unpaidAmount: number | undefined;
    isIbanMissing?: boolean | undefined;
    blockedStatus?: boolean;
    kycOverdue?: boolean;
    withdrawalRules: T_WithdrawalRules;
    isLoanPage?: boolean;
    messages: {
        title: string;
        inputLabel: string;
        inputPlaceholder: string;
        buttonText: string;
        buttonInfo: string;
        info1Text: string;
        info2Text?: string;
        info3Text: string;
        info4Text: string;
        withdrawSentMessage: string;
        withdrawAlertText1: string;
        withdrawAlertText2: string;
        euroCurrency: string;
        notEligibleText: string;
        withdrawOverdueInvoice: string;
        withdrawAvailableCreditTooSmall: string;
        withdrawNotAbleToMakeWithdrawal: string;
        withdrawNoIbanNumber: string;
        withdrawBlockedByKyc?: string;
    };
    ref?: any;
} & DefaultFormProps<T_WithdrawAmount>;

export type T_WithdrawAmount = {
    withdrawAmount: string;
};

export function StyledWithdraw(props: T_StyledWithdrawProps) {
    const {
        styleConfig,
        messages,
        availableCreditLimit,
        unpaidAmount,
        overdueDays,
        accountState,
        blockedStatus,
        isIbanMissing,
        kycOverdue,
        withdrawalRules,
        max,
        isLoanPage,
    } = props;
    const schema = yup.object().shape({
        withdrawAmount: yup
            .string()
            .test("withdrawAmount", messages.withdrawAlertText1, (val) => Number(val) <= props?.max)
            .test(
                "withdrawAmount",
                messages.withdrawAlertText2,
                (val) => Number(val) >= withdrawalRules.minWithdrawal
            ),
    });
    const {
        form,
        processChange,
        processBlur,
        processFocus,
        processSubmit,
        initForm,
        getValidationError,
        getValidationErrorMessage,
        Error,
    } = useForm<T_WithdrawAmount>({
        initial: {
            withdrawAmount: "",
        },
        onChange: () => {},
        onBlur: () => {
            props.onBlur();
        },
        onFocus: () => {
            props.onFocus();
        },
        onError: (data) => {
            props.onChange(false, {
                withdrawAmount: data.withdrawAmount,
            });
        },
        schema,
        styleConfig: {
            formError: { color: "red", textAlign: "center" },
        },
    });

    const accountData = {
        availableCreditLimit,
        unpaidAmount,
        overdueDays,
        accountState,
        isIbanMissing,
        blockedStatus,
        kycOverdue,
    };

    const { isCustomerEligible, notEligibleReason } = checkWithdrawEligibilityWithReasons(
        accountData,
        withdrawalRules
    );

    const isValidAmount =
        max &&
        withdrawalRules.minWithdrawal &&
        +form.data.withdrawAmount <= max &&
        +form.data.withdrawAmount >= withdrawalRules.minWithdrawal;

    const handleWithdrawal = () => {
        if (form.data.withdrawAmount === "" || !isValidAmount) return;
        props.onSubmit(parseInt(form.data.withdrawAmount));
    };

    let rules: Array<string>;

    if (messages.info2Text) {
        rules = [messages.info1Text, messages.info2Text, messages.info3Text, messages.info4Text];
    } else {
        rules = [messages.info1Text, messages.info3Text, messages.info4Text];
    }

    const notEligibleReasonMessages: Map<string, string> = new Map([
        [E_WithdrawNotEligibleReason.OVERDUE_INVOICES, messages.withdrawOverdueInvoice],
        [
            E_WithdrawNotEligibleReason.AVAILABLE_CREDIT_TOO_SMALL,
            messages.withdrawAvailableCreditTooSmall,
        ],
        [
            E_WithdrawNotEligibleReason.NOT_ABLE_TO_MAKE_WITHDRAWAL,
            messages.withdrawNotAbleToMakeWithdrawal,
        ],
        [E_WithdrawNotEligibleReason.NO_IBAN, messages.withdrawNoIbanNumber],
        [
            E_WithdrawNotEligibleReason.KYC_OVERDUE,
            messages.withdrawBlockedByKyc || messages.notEligibleText,
        ],
    ]);

    return (
        <StyledGrid id="withdraw-section" styleConfig={{ root: styleConfig.creditRaiseContainer }}>
            <Font as="p" styleConfig={{ root: styleConfig.creditRaiseTitle }}>
                {messages.title}
            </Font>
            <StyledGrid styleConfig={{ root: styleConfig.creditRaiseWrapper }}>
                {props?.isWithdrawn && (
                    <Font styleConfig={{ root: styleConfig.withdrawalSentMessageText }}>
                        {messages.withdrawSentMessage}
                    </Font>
                )}
                {!props?.isWithdrawn && (
                    <StyledGrid
                        styleConfig={{
                            root: styleConfig.creditRaiseInputColumn,
                        }}>
                        <Font
                            styleConfig={{
                                root: styleConfig.creditRaiseInputLabel,
                            }}
                            as="p">
                            {messages.inputLabel}
                        </Font>
                        <StyledGrid styleConfig={{ root: styleConfig.creditRaiseInputWrapper }}>
                            <StyledGrid
                                styleConfig={{
                                    root: styleConfig.creditIncreaseInputRow,
                                }}>
                                <StyledGrid
                                    styleConfig={{ root: styleConfig.creditRaiseInputWrapper }}>
                                    <StyledGrid
                                        styleConfig={{
                                            root: styleConfig.creditIncreaseInputRow,
                                        }}>
                                        <Font
                                            styleConfig={{
                                                root: styleConfig.creditRaiseEuroSign,
                                            }}>
                                            {props.unit}
                                        </Font>{" "}
                                        <TextField
                                            styleConfig={{
                                                root: styleConfig.creditRaiseInput,
                                                validationMessage: styleConfig.errorMessage,
                                            }}
                                            inputConfig={{
                                                type: "text",
                                                placeholder: messages.inputPlaceholder,
                                                disabled: !isCustomerEligible,
                                                name: "withdrawAmount",
                                                value: form.data.withdrawAmount,
                                                onChange: (e) => {
                                                    if (isNumber(e.target.value)) {
                                                        processChange({
                                                            field: "withdrawAmount",
                                                            value: e.target.value,
                                                        });
                                                    }
                                                },
                                                onKeyDown: (e) => {
                                                    if (e.key === "Enter") {
                                                        return false;
                                                    }
                                                },
                                                onBlur: (e) => {
                                                    processBlur("withdrawAmount");
                                                },
                                                onFocus: () => {
                                                    processFocus("withdrawAmount");
                                                },
                                            }}></TextField>
                                    </StyledGrid>
                                    {!isCustomerEligible && (
                                        <Font styleConfig={{ root: styleConfig.notEligibleText }}>
                                            {notEligibleReason &&
                                                notEligibleReasonMessages.get(notEligibleReason)}
                                        </Font>
                                    )}
                                    {!isValidAmount && <Error field="withdrawAmount" />}
                                </StyledGrid>
                            </StyledGrid>
                        </StyledGrid>
                        <StyledButton
                            disabled={!isCustomerEligible}
                            onClick={handleWithdrawal}
                            styleConfig={{
                                root: isValidAmount
                                    ? styleConfig.greenButtonStyles
                                    : styleConfig.disabledButtonStyles,
                            }}>
                            <Font styleConfig={{ root: styleConfig.buttonFontStyles }}>
                                {messages.buttonText} <Icon icon={["fa", "angle-double-right"]} />{" "}
                            </Font>
                        </StyledButton>
                        {!isLoanPage && (
                            <Font as="p" styleConfig={{ root: styleConfig.buttonInfo }}>
                                {messages.buttonInfo}
                            </Font>
                        )}{" "}
                    </StyledGrid>
                )}

                {!isLoanPage && (
                    <StyledGrid
                        styleConfig={{
                            root: styleConfig.creditRaiseInfoColumn,
                        }}>
                        {rules.map((item, index) => (
                            <StyledGrid
                                key={"item" + index}
                                styleConfig={{ root: styleConfig.rulesContainer }}>
                                <Icon icon={["fas", "circle"]} size="xs" />
                                <Font styleConfig={{ root: styleConfig.creditRaiseText }}>
                                    {item}
                                </Font>
                            </StyledGrid>
                        ))}
                    </StyledGrid>
                )}
            </StyledGrid>
        </StyledGrid>
    );
}

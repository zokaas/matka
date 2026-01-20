"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StyledWithdraw = StyledWithdraw;
const react_1 = __importDefault(require("react"));
const yup = __importStar(require("yup"));
const component_grid_1 = require("@opr-finance/component-grid");
const component_fonts_1 = require("@opr-finance/component-fonts");
const component_forms_1 = require("@opr-finance/component-forms");
const component_button_1 = require("@opr-finance/component-button");
const utils_1 = require("@opr-finance/utils");
const component_icon_1 = require("@opr-finance/component-icon");
const eligibilityCheck_1 = require("@opr-finance/utils/src/eligibilityCheck");
function StyledWithdraw(props) {
    const { styleConfig, messages, availableCreditLimit, unpaidAmount, overdueDays, accountState, blockedStatus, isIbanMissing, kycOverdue, withdrawalRules, max, isLoanPage, } = props;
    const schema = yup.object().shape({
        withdrawAmount: yup
            .string()
            .test("withdrawAmount", messages.withdrawAlertText1, (val) => Number(val) <= (props === null || props === void 0 ? void 0 : props.max))
            .test("withdrawAmount", messages.withdrawAlertText2, (val) => Number(val) >= withdrawalRules.minWithdrawal),
    });
    const { form, processChange, processBlur, processFocus, processSubmit, initForm, getValidationError, getValidationErrorMessage, Error, } = (0, component_forms_1.useForm)({
        initial: {
            withdrawAmount: "",
        },
        onChange: () => { },
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
    const { isCustomerEligible, notEligibleReason } = (0, utils_1.checkWithdrawEligibilityWithReasons)(accountData, withdrawalRules);
    const isValidAmount = max &&
        withdrawalRules.minWithdrawal &&
        +form.data.withdrawAmount <= max &&
        +form.data.withdrawAmount >= withdrawalRules.minWithdrawal;
    const handleWithdrawal = () => {
        if (form.data.withdrawAmount === "" || !isValidAmount)
            return;
        props.onSubmit(parseInt(form.data.withdrawAmount));
    };
    let rules;
    if (messages.info2Text) {
        rules = [messages.info1Text, messages.info2Text, messages.info3Text, messages.info4Text];
    }
    else {
        rules = [messages.info1Text, messages.info3Text, messages.info4Text];
    }
    const notEligibleReasonMessages = new Map([
        [eligibilityCheck_1.E_WithdrawNotEligibleReason.OVERDUE_INVOICES, messages.withdrawOverdueInvoice],
        [
            eligibilityCheck_1.E_WithdrawNotEligibleReason.AVAILABLE_CREDIT_TOO_SMALL,
            messages.withdrawAvailableCreditTooSmall,
        ],
        [
            eligibilityCheck_1.E_WithdrawNotEligibleReason.NOT_ABLE_TO_MAKE_WITHDRAWAL,
            messages.withdrawNotAbleToMakeWithdrawal,
        ],
        [eligibilityCheck_1.E_WithdrawNotEligibleReason.NO_IBAN, messages.withdrawNoIbanNumber],
        [
            eligibilityCheck_1.E_WithdrawNotEligibleReason.KYC_OVERDUE,
            messages.withdrawBlockedByKyc || messages.notEligibleText,
        ],
    ]);
    return (react_1.default.createElement(component_grid_1.StyledGrid, { id: "withdraw-section", styleConfig: { root: styleConfig.creditRaiseContainer } },
        react_1.default.createElement(component_fonts_1.Font, { as: "p", styleConfig: { root: styleConfig.creditRaiseTitle } }, messages.title),
        react_1.default.createElement(component_grid_1.StyledGrid, { styleConfig: { root: styleConfig.creditRaiseWrapper } },
            (props === null || props === void 0 ? void 0 : props.isWithdrawn) && (react_1.default.createElement(component_fonts_1.Font, { styleConfig: { root: styleConfig.withdrawalSentMessageText } }, messages.withdrawSentMessage)),
            !(props === null || props === void 0 ? void 0 : props.isWithdrawn) && (react_1.default.createElement(component_grid_1.StyledGrid, { styleConfig: {
                    root: styleConfig.creditRaiseInputColumn,
                } },
                react_1.default.createElement(component_fonts_1.Font, { styleConfig: {
                        root: styleConfig.creditRaiseInputLabel,
                    }, as: "p" }, messages.inputLabel),
                react_1.default.createElement(component_grid_1.StyledGrid, { styleConfig: { root: styleConfig.creditRaiseInputWrapper } },
                    react_1.default.createElement(component_grid_1.StyledGrid, { styleConfig: {
                            root: styleConfig.creditIncreaseInputRow,
                        } },
                        react_1.default.createElement(component_grid_1.StyledGrid, { styleConfig: { root: styleConfig.creditRaiseInputWrapper } },
                            react_1.default.createElement(component_grid_1.StyledGrid, { styleConfig: {
                                    root: styleConfig.creditIncreaseInputRow,
                                } },
                                react_1.default.createElement(component_fonts_1.Font, { styleConfig: {
                                        root: styleConfig.creditRaiseEuroSign,
                                    } }, props.unit),
                                " ",
                                react_1.default.createElement(component_forms_1.TextField, { styleConfig: {
                                        root: styleConfig.creditRaiseInput,
                                        validationMessage: styleConfig.errorMessage,
                                    }, inputConfig: {
                                        type: "text",
                                        placeholder: messages.inputPlaceholder,
                                        disabled: !isCustomerEligible,
                                        name: "withdrawAmount",
                                        value: form.data.withdrawAmount,
                                        onChange: (e) => {
                                            if ((0, utils_1.isNumber)(e.target.value)) {
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
                                    } })),
                            !isCustomerEligible && (react_1.default.createElement(component_fonts_1.Font, { styleConfig: { root: styleConfig.notEligibleText } }, notEligibleReason &&
                                notEligibleReasonMessages.get(notEligibleReason))),
                            !isValidAmount && react_1.default.createElement(Error, { field: "withdrawAmount" })))),
                react_1.default.createElement(component_button_1.StyledButton, { disabled: !isCustomerEligible, onClick: handleWithdrawal, styleConfig: {
                        root: isValidAmount
                            ? styleConfig.greenButtonStyles
                            : styleConfig.disabledButtonStyles,
                    } },
                    react_1.default.createElement(component_fonts_1.Font, { styleConfig: { root: styleConfig.buttonFontStyles } },
                        messages.buttonText,
                        " ",
                        react_1.default.createElement(component_icon_1.Icon, { icon: ["fa", "angle-double-right"] }),
                        " ")),
                !isLoanPage && (react_1.default.createElement(component_fonts_1.Font, { as: "p", styleConfig: { root: styleConfig.buttonInfo } }, messages.buttonInfo)),
                " ")),
            !isLoanPage && (react_1.default.createElement(component_grid_1.StyledGrid, { styleConfig: {
                    root: styleConfig.creditRaiseInfoColumn,
                } }, rules.map((item, index) => (react_1.default.createElement(component_grid_1.StyledGrid, { key: "item" + index, styleConfig: { root: styleConfig.rulesContainer } },
                react_1.default.createElement(component_icon_1.Icon, { icon: ["fas", "circle"], size: "xs" }),
                react_1.default.createElement(component_fonts_1.Font, { styleConfig: { root: styleConfig.creditRaiseText } }, item)))))))));
}
//# sourceMappingURL=StyledWithdraw.js.map
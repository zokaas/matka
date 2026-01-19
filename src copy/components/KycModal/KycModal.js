"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KycModal = void 0;
const react_1 = __importDefault(require("react"));
const react_intl_1 = require("react-intl");
const date_fns_1 = require("date-fns");
const locale_1 = require("date-fns/locale");
const component_modal_dialog_1 = require("@opr-finance/component-modal-dialog");
const component_grid_1 = require("@opr-finance/component-grid");
const component_fonts_1 = require("@opr-finance/component-fonts");
const component_button_1 = require("@opr-finance/component-button");
const component_icon_1 = require("@opr-finance/component-icon");
const messages_1 = require("./messages");
const KycModal = ({ isOpen, kycStatus, kycDueDate, onClose, onStartKyc, styleConfig, }) => {
    const { formatMessage: fm } = (0, react_intl_1.useIntl)();
    const { isOverdue, effectiveDueDate } = kycStatus;
    const displayDueDate = kycDueDate || effectiveDueDate;
    const title = isOverdue ? fm(messages_1.messages.overdueTitle) : fm(messages_1.messages.kycTitle);
    return (react_1.default.createElement(component_modal_dialog_1.Modal, { modalTitle: title, isOpen: isOpen, onClick: onClose, isCloseIconVisible: true, styleConfig: {
            closeIcon: styleConfig.modalCloseIcon,
            overlay: styleConfig.modalOverlay,
            content: styleConfig.modalContent,
            title: styleConfig.modalTitle,
            titleText: styleConfig.titleText,
        } },
        react_1.default.createElement(component_grid_1.StyledGrid, { styleConfig: { root: styleConfig.buttonContainer } },
            react_1.default.createElement(react_1.default.Fragment, null,
                "if ",
                isOverdue,
                react_1.default.createElement(component_fonts_1.Font, { styleConfig: { root: styleConfig.contentText }, as: "p" }, fm(messages_1.messages.overdueMessage)),
                react_1.default.createElement(component_fonts_1.Font, { styleConfig: { root: styleConfig.contentText }, as: "p" }, fm(messages_1.messages.dueDateWarningMessage)),
                react_1.default.createElement(component_fonts_1.Font, { styleConfig: { root: styleConfig.contentText }, as: "p" }, fm(messages_1.messages.kycReasonMessage)),
                react_1.default.createElement(component_fonts_1.Font, { styleConfig: { root: styleConfig.contentText }, as: "p" }, fm(messages_1.messages.creditConsentLabel)),
                displayDueDate && (react_1.default.createElement(component_fonts_1.Font, { styleConfig: { root: styleConfig.dateText }, as: "p" },
                    fm(messages_1.messages.dueDateLabel),
                    " ",
                    (0, date_fns_1.format)((0, date_fns_1.parseISO)(displayDueDate), "d MMMM yyyy", { locale: locale_1.sv })))),
            react_1.default.createElement(component_grid_1.StyledGrid, { styleConfig: {
                    root: {
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                        marginTop: "24px",
                    },
                } },
                react_1.default.createElement(component_button_1.StyledButton, { onClick: onStartKyc, styleConfig: { root: styleConfig.primaryButton } },
                    react_1.default.createElement(component_fonts_1.Font, { styleConfig: { root: styleConfig.buttonText } },
                        fm(messages_1.messages.updateNowButton),
                        " ",
                        react_1.default.createElement(component_icon_1.Icon, { icon: ["fa", "angle-double-right"] }))),
                react_1.default.createElement(component_button_1.StyledButton, { onClick: onClose, styleConfig: { root: styleConfig.secondaryButton } },
                    react_1.default.createElement(component_fonts_1.Font, { styleConfig: { root: styleConfig.buttonText } }, fm(messages_1.messages.remindLaterButton)))))));
};
exports.KycModal = KycModal;
//# sourceMappingURL=KycModal.js.map
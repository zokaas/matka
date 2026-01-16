"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RichContent = exports.ModalDialog = void 0;
exports.Modal = Modal;
const react_1 = __importDefault(require("react"));
const react_modal_1 = __importDefault(require("react-modal"));
const react_markdown_1 = __importDefault(require("react-markdown"));
const component_icon_1 = require("@opr-finance/component-icon");
const component_fonts_1 = require("@opr-finance/component-fonts");
const ModalDialog_styled_1 = require("./ModalDialog.styled");
react_modal_1.default.setAppElement("#root");
const modalStyles = {
    overlay: {
        backgroundColor: "rgba(0,0,0,0.4)",
        display: "flex",
        zIndex: 1500,
    },
};
const ModalDialog = (props) => {
    return (react_1.default.createElement(ModalDialog_styled_1.StyledModal, { style: modalStyles, isOpen: props.isOpen, variant: props.dialogVariant },
        react_1.default.createElement(ModalDialog_styled_1.StyledTitle, { variant: props.dialogVariant },
            props.modalTitle,
            react_1.default.createElement(ModalDialog_styled_1.StyledCloseIcon, { onClick: props.onClick },
                react_1.default.createElement(component_icon_1.Icon, { icon: ["fas", "times"], size: "lg" }))),
        props.children));
};
exports.ModalDialog = ModalDialog;
const RichContent = (props) => {
    return (react_1.default.createElement(react_1.default.Fragment, null,
        props.createdDate && react_1.default.createElement(component_fonts_1.Text, { variant: "small" }, props.createdDate),
        react_1.default.createElement(react_markdown_1.default, null, props.content)));
};
exports.RichContent = RichContent;
function Modal({ isCloseIconVisible = true, styleConfig, isOpen, children, onClick, modalTitle, }) {
    return (react_1.default.createElement(ModalDialog_styled_1.ModalStyled, { style: { overlay: styleConfig.overlay }, isOpen: isOpen, styleConfig: styleConfig },
        react_1.default.createElement(ModalDialog_styled_1.ModalTitle, { styleConfig: { title: styleConfig.title } },
            react_1.default.createElement(component_fonts_1.Font, { styleConfig: { root: styleConfig.titleText } }, modalTitle),
            isCloseIconVisible && (react_1.default.createElement(ModalDialog_styled_1.ModalCloseIcon, { onClick: onClick, styleConfig: { closeIcon: styleConfig.closeIcon } },
                react_1.default.createElement(component_icon_1.Icon, { icon: ["fas", "times"], size: "lg" })))),
        children));
}
//# sourceMappingURL=ModalDialog.js.map
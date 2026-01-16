"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModalCloseIcon = exports.ModalTitle = exports.ModalStyled = exports.StyledCloseIcon = exports.StyledTitle = exports.StyledModal = void 0;
const react_modal_1 = __importDefault(require("react-modal"));
const styled_components_1 = __importDefault(require("styled-components"));
const styled_system_1 = require("styled-system");
const css_1 = require("@styled-system/css");
const dialogVariants = (theme) => (Object.assign({}, theme.modal.dialog));
const titleVariants = (theme) => (Object.assign({}, theme.modal.title));
exports.StyledModal = (0, styled_components_1.default)(react_modal_1.default).attrs({
    className: "ModalDialog",
}) `
    ${(props) => (0, styled_system_1.variant)({ variants: dialogVariants(props.theme) })}
    ${styled_system_1.color}
    ${styled_system_1.flexbox}
    ${styled_system_1.layout}
    ${styled_system_1.position}
    ${styled_system_1.space}
    :focus {
        outline: none;
    }
`;
exports.StyledTitle = styled_components_1.default.p `
    ${(props) => (0, styled_system_1.variant)({ variants: titleVariants(props.theme) })}
    ${styled_system_1.color}
    ${styled_system_1.flexbox}
    ${styled_system_1.layout}
    ${styled_system_1.space}
    ${styled_system_1.typography}
`;
exports.StyledCloseIcon = styled_components_1.default.span `
    cursor: pointer;
    margin-left: auto;
`;
exports.ModalStyled = (0, styled_components_1.default)(react_modal_1.default).attrs({
    className: "StyledConfigModalDialog",
}) `
    ${(props) => {
    return (0, css_1.css)(props.styleConfig.content);
}}
    :focus {
        outline: none;
    }
`;
exports.ModalTitle = styled_components_1.default.div `
    ${(props) => (0, css_1.css)(props.styleConfig.title)}
`;
exports.ModalCloseIcon = styled_components_1.default.span `
    ${(props) => (0, css_1.css)(props.styleConfig.closeIcon)}
`;
//# sourceMappingURL=ModalDialog.styled.js.map
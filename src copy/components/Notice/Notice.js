"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notice = Notice;
const react_1 = __importDefault(require("react"));
const component_grid_1 = require("@opr-finance/component-grid");
const component_fonts_1 = require("@opr-finance/component-fonts");
function Notice(props) {
    return (react_1.default.createElement(component_grid_1.StyledGrid, { styleConfig: { root: props.styleConfig.noticeContainer } },
        react_1.default.createElement(component_fonts_1.Font, { styleConfig: { root: props.styleConfig.notice }, as: "p" }, props.notice)));
}
//# sourceMappingURL=Notice.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Item = exports.ItemContainer = exports.Container = exports.RootContent = exports.Root = void 0;
const styled_components_1 = __importDefault(require("styled-components"));
exports.Root = styled_components_1.default.div `
    display: flex;
    flex-direction: column;
    width: 100%;
`;
exports.RootContent = styled_components_1.default.div `
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: center;
    justify-content: center;
`;
exports.Container = styled_components_1.default.div `
    display: flex;
    flex-direction: row;
    width: 100%;
    align-items: center;
    justify-content: center;
`;
exports.ItemContainer = styled_components_1.default.div `
    display: flex;
    flex-direction: row;
    height: 34px;
    width: 70px;
    align-items: center;
    justify-content: center;
`;
exports.Item = styled_components_1.default.div `
    display: flex;
    flex-direction: row;
    height: 34px;
    align-items: center;
    justify-content: center;
`;
//# sourceMappingURL=Withdraw.styled.js.map
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KycNotice = void 0;
const react_1 = __importStar(require("react"));
const react_redux_1 = require("react-redux");
const component_grid_1 = require("@opr-finance/component-grid");
const feature_console_logger_1 = require("@opr-finance/feature-console-logger");
const KycModal_1 = require("../KycModal");
const Notice_1 = require("../Notice");
const general_1 = require("../../types/general");
const kyc_1 = require("../../types/kyc");
const utils_1 = require("../../utils");
const theme_flex_online_1 = require("@opr-finance/theme-flex-online");
const logger = new feature_console_logger_1.ConsoleLogger({ level: feature_console_logger_1.LOG_LEVEL });
const KycNotice = () => {
    const [showKycModal, setShowKycModal] = (0, react_1.useState)(false);
    const kycState = (0, react_redux_1.useSelector)((state) => state.kyc);
    const company = (0, react_redux_1.useSelector)((state) => state.customer.companyInfo.info);
    const session = (0, react_redux_1.useSelector)((state) => state.session);
    const authenticated = (0, react_redux_1.useSelector)((state) => state.session.authenticated);
    const kycStatus = (0, utils_1.checkKycStatus)(kycState);
    console.log('KYC State:', kycState);
    console.log('Should block withdrawals?', kycStatus);
    if (!authenticated || kycState.kycDone || !kycStatus) {
        return null;
    }
    const { isOverdue, daysRemaining } = kycStatus;
    const shouldShow = isOverdue || (daysRemaining !== null && daysRemaining <= 14);
    if (!shouldShow)
        return null;
    const handleStartKyc = () => __awaiter(void 0, void 0, void 0, function* () {
        logger.log("Starting KYC flow");
        if (!company) {
            logger.error("Company info not available");
            utils_1.history.push(general_1.E_Routes.ERROR);
            return;
        }
        const { organizationNumber, companyName, dynamicFields } = company;
        const { industryCode } = (dynamicFields === null || dynamicFields === void 0 ? void 0 : dynamicFields.kyc) || "";
        const companyData = (0, utils_1.mapCompanyDataForKyc)({
            organizationNumber,
            companyName,
            industryCode,
        });
        const started = yield (0, utils_1.startKyc)(companyData, session, kyc_1.kycFlow.EXISTING_CUSTOMER);
        if (!started) {
            logger.error("Failed to start KYC flow");
            utils_1.history.push(general_1.E_Routes.ERROR);
        }
    });
    const noticeText = isOverdue
        ? "⚠️ Din KYC-uppdatering är försenad! Klicka här för att uppdatera nu."
        : `⏰ Din KYC uppdatering krävs inom ${daysRemaining} dagar. Klicka här för att uppdatera.`;
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(KycModal_1.KycModal, { isOpen: showKycModal, kycStatus: kycStatus, onClose: () => {
                (0, utils_1.dismissKycModal)();
                setShowKycModal(false);
            }, onStartKyc: handleStartKyc, styleConfig: {
                modalCloseIcon: theme_flex_online_1.ModalStyles.modalCloseIcon(),
                modalOverlay: theme_flex_online_1.ModalStyles.modalOverlay(),
                modalContent: theme_flex_online_1.ModalStyles.modalContentScroll({ height: ["fit-content"] }),
                modalTitle: theme_flex_online_1.ModalStyles.modalTitle(),
                titleText: theme_flex_online_1.ModalStyles.titleText(),
                contentText: theme_flex_online_1.FontsStyles.fontContentText(),
                dateText: Object.assign(Object.assign({}, theme_flex_online_1.FontsStyles.fontContentText()), { marginTop: "16px", fontWeight: "bold" }),
                buttonContainer: theme_flex_online_1.FrontPageStyles.creditRaiseInfoColumn(),
                primaryButton: theme_flex_online_1.ButtonStyles.greenButtonStyles({ width: "100%" }),
                secondaryButton: theme_flex_online_1.ButtonStyles.grayButtonStyles({ width: "100%" }),
                buttonText: theme_flex_online_1.ButtonStyles.buttonFontStyles(),
            } }),
        react_1.default.createElement(component_grid_1.StyledGrid, { onClick: () => {
                (0, utils_1.clearKycModalDismissal)();
                setShowKycModal(true);
            }, styleConfig: { root: { cursor: "pointer" } } },
            react_1.default.createElement(Notice_1.Notice, { notice: noticeText, styleConfig: {
                    noticeContainer: theme_flex_online_1.StartPageStyles.startPageNoticeContainer({
                        label: "warning",
                    }),
                    notice: theme_flex_online_1.StartPageStyles.startPageNotice(),
                } }))));
};
exports.KycNotice = KycNotice;
//# sourceMappingURL=KycNotice.js.map
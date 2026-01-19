"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onComponentMounted = void 0;
const utils_1 = require("@opr-finance/utils");
const feature_console_logger_1 = require("@opr-finance/feature-console-logger");
const onComponentMounted = (boardMemberId) => {
    const logger = new feature_console_logger_1.ConsoleLogger({ level: feature_console_logger_1.LOG_LEVEL });
    const onPageLoad = () => {
        logger.log("PUSH user_id, pageview");
        (0, utils_1.sendUserIdEvent)(boardMemberId);
        (0, utils_1.sendGAEvent)({ event: "pageview" });
    };
    if (document.readyState === "complete") {
        onPageLoad();
    }
    else {
        window.addEventListener("load", onPageLoad);
        return () => window.removeEventListener("load", onPageLoad);
    }
};
exports.onComponentMounted = onComponentMounted;
//# sourceMappingURL=onComponentMounted.js.map
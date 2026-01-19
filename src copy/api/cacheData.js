"use strict";
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
exports.saveData = void 0;
const feature_console_logger_1 = require("@opr-finance/feature-console-logger");
const logger = new feature_console_logger_1.ConsoleLogger({ level: feature_console_logger_1.LOG_LEVEL });
const saveData = (data) => __awaiter(void 0, void 0, void 0, function* () {
    logger.log("saveData", data);
    const bffUrl = process.env.REACT_APP_BFF_URL;
    try {
        const response = yield fetch(`${bffUrl}/cache/session`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        logger.log(response.status);
        const result = yield response.json();
        return result.redisKey;
    }
    catch (error) {
        logger.log("data caching failed", error);
        return null;
    }
});
exports.saveData = saveData;
//# sourceMappingURL=cacheData.js.map
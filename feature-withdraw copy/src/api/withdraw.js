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
exports.withdraw = withdraw;
function withdraw(request) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = request.mockApiCalls ? `${request.gwUrl}?localDev=true` : request.gwUrl;
        const method = "POST";
        const result = yield fetch(url, {
            method,
            headers: {
                "content-type": "application/json",
                Authorization: request.token,
            },
            body: JSON.stringify(request.body),
        });
        if (result.status === 200) {
            return {
                status: result.status,
            };
        }
        const parseResponse = yield result.json();
        const response = {
            status: result.status,
            message: parseResponse.Message,
        };
        return response;
    });
}
//# sourceMappingURL=withdraw.js.map
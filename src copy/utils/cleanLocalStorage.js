"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanLocalStorage = cleanLocalStorage;
function cleanLocalStorage() {
    localStorage.removeItem("token");
    localStorage.removeItem("smeId");
}
//# sourceMappingURL=cleanLocalStorage.js.map
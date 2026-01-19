"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isIndividualGuarantor = isIndividualGuarantor;
exports.getApplicantSsnFromApplication = getApplicantSsnFromApplication;
function isIndividualGuarantor(g) {
    return !!g && "reference" in g;
}
function getApplicantSsnFromApplication(applicationState) {
    var _a, _b;
    const guarantees = (_a = applicationState === null || applicationState === void 0 ? void 0 : applicationState.application) === null || _a === void 0 ? void 0 : _a.guarantees;
    if (!guarantees || guarantees.length === 0)
        return undefined;
    const guarantor = (_b = guarantees[0]) === null || _b === void 0 ? void 0 : _b.guarantor;
    if (!isIndividualGuarantor(guarantor))
        return undefined;
    return guarantor.reference;
}
//# sourceMappingURL=guarantors.js.map
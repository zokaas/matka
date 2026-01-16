"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.watchKycValidation = watchKycValidation;
const effects_1 = require("redux-saga/effects");
const actions_1 = require("../actions/actions");
function* handleKycValidation() {
    try {
        yield (0, effects_1.put)(actions_1.kycActions.validationSuccess());
    }
    catch (error) {
        yield (0, effects_1.put)(actions_1.kycActions.validationFailed({ message: String(error) }));
    }
}
function* watchKycValidation() {
    yield (0, effects_1.takeLatest)(actions_1.E_KycActionConstants.VALIDATION_START, handleKycValidation);
}
//# sourceMappingURL=sagas.js.map
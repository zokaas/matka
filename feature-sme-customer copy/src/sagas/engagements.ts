import { takeEvery, put, call, select } from "redux-saga/effects";

import {
    T_Config,
    E_EngagementActionConstants,
    T_EngagementApiResponse,
    T_FeatureCustomerReducerState,
    T_EngagementBusinessIndividual,
} from "../types";
import { fetchEngagements, fetchEngagementsActAsCustomer } from "../api/engagements";
import { engagementActions } from "../actions";
import { getBusinessEngagements } from "../payload/engagement";

export function* watchEngagementTrigger() {
    yield takeEvery(E_EngagementActionConstants.GET_ENGAGEMENT_TRIGGER, handleEngagementTrigger);
}

export function* handleEngagementTrigger() {
    try {
        const config: T_Config = yield select((state: T_FeatureCustomerReducerState) => {
            return state.customer.engagement.config;
        });

        const { mock, token, gwUrl, role, reference, refType } = config;
        const referenceType = refType ?? "SSN";
        let engagements;
        if (role === "act-as-customer") {
            engagements = yield call(fetchEngagementsActAsCustomer, {
                mock,
                token,
                gwUrl,
                role,
                ssn: reference,
                refType: referenceType,
            });
        } else {
            engagements = yield call(fetchEngagements, {
                mock,
                token,
                gwUrl,
                role,
                refType,
            });
        }

        if (engagements) {
            const payload: Array<T_EngagementBusinessIndividual> =
                getBusinessEngagements(engagements);
            yield put(engagementActions.engagementSuccess(payload));
        }
    } catch (e) {
        yield put(engagementActions.engagementError({ message: "Engagements saga failed" + e }));
    }
}

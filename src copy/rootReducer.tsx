import { combineReducers } from "redux";
import { pageInitializerReducer } from "@opr-finance/features/Initializer/pageInitializer/reducers";
import { loginSessionReducer } from "@opr-finance/features/login-session";
import { applicationDataReducer } from "./reducers/applicationDataReducer";
import { sessionReducer } from "@opr-finance/features/refresh-session";

export const rootReducer = combineReducers({
    pageInitializer: pageInitializerReducer,
    login: loginSessionReducer,
    prefilledApplication: applicationDataReducer,
    userActivity: sessionReducer,
});

export type T_GlobalState = ReturnType<typeof rootReducer>;

import { combineReducers } from "redux";
import { T_customerReducer } from "../types";
import { engagementReducer } from "./engagement";
import { companyReducer } from "./company";
import { applicationReducer } from "./application";

export const customerReducer = combineReducers<T_customerReducer>({
    engagement: engagementReducer,
    companyInfo: companyReducer,
    application: applicationReducer,
});

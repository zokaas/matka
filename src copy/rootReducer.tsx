import { combineReducers } from "redux";
import { AppState } from "./types/general";
import { initializerReducer } from "@opr-finance/feature-initializer";

export const rootReducer = combineReducers<AppState>({
    initializer: initializerReducer,
});

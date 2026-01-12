import { createStore, compose, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import { rootReducer } from "./rootReducer";
import { rootSaga } from "./rootSagas";

const sagaMiddleware = createSagaMiddleware();

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const root = (state, action) => {
    /*
    if (action.type === LoginActionConstants.LOGOUT) {
        state = undefined
    }
*/
    return rootReducer(state, action as never);
};

export function configureStore() {
    return createStore(root, {}, composeEnhancers(applyMiddleware(sagaMiddleware)));
}

export const store = configureStore();

sagaMiddleware.run(rootSaga);

declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
    }
}

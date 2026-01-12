// Package imports
import React from "react";
import ReactDOM from "react-dom/client";
import { Router } from "react-router";
import { Provider, useSelector } from "react-redux";
import { ThemeProvider } from "styled-components";
import { IntlProvider } from "react-intl";
import CookieBot from "react-cookiebot";

// @OPR Imports
import { theme } from "@opr-finance/theme-flex-online";

// File Imports
import * as serviceWorker from "./serviceWorker";
import App from "./App";
import { store } from "./store";
import { AppState } from "./types/general";
import "./index.css";
import { history } from "./utils";

function TranslatedApp() {
    const messages = useSelector((state: AppState) => state.translation.messages);
    const locale = process.env.REACT_APP_LOCALE as string;

    return (
        <IntlProvider locale={locale} messages={messages}>
            <Router history={history}>
                <App />
            </Router>
        </IntlProvider>
    );
}

const domainGroupId = process.env.REACT_APP_COOKIEBOT_DOMAING_GROUP_ID as string;
const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
    <>
        <CookieBot domainGroupId={domainGroupId} />
        <ThemeProvider theme={theme}>
            <Provider store={store}>
                <TranslatedApp />
            </Provider>
        </ThemeProvider>
    </>
);

serviceWorker.unregister();

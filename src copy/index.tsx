import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { Provider } from "react-redux";
import { store } from "./store";
import { ThemeProvider } from "styled-components";
import { theme } from "@opr-finance/theme-flex";
import { BrowserRouter as Router } from "react-router-dom";
import CookieBot from "react-cookiebot";

const domainGroupId = process.env.REACT_APP_COOKIEBOT_DOMAING_GROUP_ID as string;
const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
    <>
        <CookieBot domainGroupId={domainGroupId} />
        <ThemeProvider theme={theme}>
            <Provider store={store}>
                <Router>
                    <App />
                </Router>
            </Provider>
        </ThemeProvider>
    </>
);

serviceWorker.unregister();

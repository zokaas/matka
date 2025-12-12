import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import CookieBot from "react-cookiebot";

import { ContextProvider } from "@opr-finance/features";

import App from "./App";
import "./index.css";

const queryClient = new QueryClient();

const domainGroupId = import.meta.env.VITE_COOKIEBOT_DOMAIN_GROUP_ID as string;
ReactDOM.createRoot(document.getElementById("root")!).render(
    // <React.StrictMode>
    <>
        <CookieBot domainGroupId={domainGroupId} />

        <QueryClientProvider client={queryClient}>
            <Provider store={store}>
                <ContextProvider>
                    <BrowserRouter>
                        <App />
                    </BrowserRouter>
                </ContextProvider>
            </Provider>
        </QueryClientProvider>
    </>

    // </React.StrictMode>
);

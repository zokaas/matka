import { PageInitializer } from "@opr-finance/features/Initializer";
import React from "react";
import { Routes, Route } from "react-router-dom";
import { AppActionConstants } from "./actions/index.actions";
import ApplicationPage from "./pages/ApplicationPage/ApplicationPage";
import { Authenticate } from "./pages/Authenticate/Authenticate";
import ErrorPage from "./pages/ErrorPage/ErrorPage";
import LandingRedirect from "./pages/LandingRedirect/LandingRedirect";
import PreviewPage from "./pages/PreviewPage/PreviewPage";
import StartPage from "./pages/StartPage/StartPage";
import StartRedirect from "./pages/StartRedirect/StartRedirect";
import ThankYouPage from "./pages/ThankYouPage/ThankYouPage";
import Placeholder from "./components/Placeholder/Placeholder";

import { E_Routes } from "./types";
import ExternalRedirect from "@opr-finance/features/Redirect/Redirect";

type T_AppRoutes = {};

function AppRoutes(props: T_AppRoutes) {
    const renderPaths = (paths: string[], Element: React.ReactNode) =>
        paths.map((path) => <Route key={path} path={path} element={Element} />);

    const marketingPageUrl = import.meta.env.VITE_MARKETING_PAGE as string;

    return (
        <Routes>
            {/* <Route path={E_Routes.ROOT} element={<PrePage />} /> */}
            <Route
                path={E_Routes.START}
                element={
                    <PageInitializer
                        id={"startPage"}
                        pageInitAction={AppActionConstants.START_PAGE_TRIGGER}
                        successfulActions={[AppActionConstants.START_PAGE_SUCCESS]}>
                        <StartPage />
                    </PageInitializer>
                }
            />
            <Route path={`${E_Routes.START}/:uuid`} element={<StartRedirect />} />
            <Route path={E_Routes.LANDING_PAGE} element={<LandingRedirect />} />
            <Route
                path={E_Routes.APPLICATION}
                element={
                    <PageInitializer
                        id={"applicationPage"}
                        pageInitAction={AppActionConstants.APPLICATION_PAGE_TRIGGER}
                        successfulActions={[AppActionConstants.APPLICATION_PAGE_SUCCESS]}>
                        <ApplicationPage />
                    </PageInitializer>
                }
            />
            <Route path={E_Routes.PREVIEW} element={<PreviewPage />} />
            <Route
                path={E_Routes.APPLICATION_UUID}
                element={<Placeholder>APPLICATION_UUID</Placeholder>}
            />
            <Route
                path={E_Routes.AUTHENTICATE}
                element={
                    <PageInitializer
                        id={"authenticate"}
                        pageInitAction={AppActionConstants.AUTHENTICATE_TRIGGER}
                        successfulActions={[AppActionConstants.AUTHENTICATE_SUCCESS]}>
                        <Authenticate />
                    </PageInitializer>
                }
            />
            <Route path={E_Routes.ROOT} element={<ExternalRedirect url={marketingPageUrl} />} />

            {renderPaths(
                [
                    E_Routes.APPLICATION_UUID_NULL,
                    E_Routes.FORBIDDEN,
                    E_Routes.EXPIRED,
                    E_Routes.ERROR,
                    E_Routes.ALL_OTHERS,
                ],
                <ErrorPage />
            )}

            <Route path={E_Routes.THANK_YOU} element={<ThankYouPage />} />
        </Routes>
    );
}

export default AppRoutes;

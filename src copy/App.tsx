import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { pageStyles, componentStyles } from "@opr-finance/themes/sweden-foretagslan-application";
import { Button, Container, iconLibrary, Image } from "@opr-finance/styled-components";
import { loginSessionActions, T_LoginState } from "@opr-finance/features/login-session";
import { ConsoleLogger, LOG_LEVEL } from "@opr-finance/features/console-logger";

import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import AppRoutes from "./routes";
import logo from "./images/Foretagslan_logo.svg";
import { endSession } from "./api/endSession";
import { E_Routes } from "./types";
import { useDispatch, useSelector } from "react-redux";
import { cleanLocalStorage } from "./utils";
import {
    ActivityTracker,
    sessionActions,
    useCountdown,
    UserNotificationModalDialog,
} from "@opr-finance/features/refresh-session";
import { modalStyles } from "@opr-finance/themes/sweden-foretagslan-application/componentsStyles";

iconLibrary.initForetagsLanSe();

function App() {
    const logger = new ConsoleLogger({ level: LOG_LEVEL });
    const { appStyles } = pageStyles;
    const { headerStyles, buttonStyles } = componentStyles;
    const {
        closeIcon,
        overlay,
        modalTitle,
        modalBody,
        modalLayout,
        modalButtonContainer,
        modalButton,
        buttonText,
    } = modalStyles;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector((state: T_LoginState) => {
        return state.login;
    });

    const handleLogout = useCallback(async () => {
        try {
            toggleSessionManagingModal(false);
            await endSession();
            cleanLocalStorage();
            dispatch(loginSessionActions.loginSessionEnd());
            navigate(E_Routes.ROOT);
        } catch (error) {
            logger.error("Failed to log out:", error);
        }
    }, [dispatch, navigate]);

    const { exp, maxSessionRefresh, sessionRefreshCount } = useSelector(
        (state: T_LoginState) => state.login
    );

    // settings for session management
    const sessionExpirationInterval = 60; // 60 sec between notification and logging user out
    const userInactivityInterval = 30; // 30 seconds idle time
    const isSessionRenewable = sessionRefreshCount < maxSessionRefresh;
    const ttl = exp - Math.floor(Date.now() / 1000);
    const { isUserActive, sessionTimerExpired } = useSelector(
        (state: T_LoginState) => state.userActivity
    );

    const [modalOpen, setModalOpen] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setInterval> | null>(null); // Ref to store timeout ID

    const toggleSessionManagingModal = (isOpen: boolean | ((prevState: boolean) => boolean)) =>
        setModalOpen(isOpen);

    useEffect(() => {
        if (modalOpen) {
            resetCountdown();
        } else {
            pauseCountdown();
        }
    }, [modalOpen]);

    const clearSessionTimeout = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    };

    // Using the useCountdown hook to manage the countdown for session expiration
    const { remaining, resetCountdown, pauseCountdown } = useCountdown(ttl, () => handleLogout);

    const startSessionTimeout = () => {
        clearSessionTimeout();
        timeoutRef.current = setTimeout(handleLogout, ttl * 1000);
    };

    const handlerefreshSession = () => {
        toggleSessionManagingModal(false);
        clearSessionTimeout();
        dispatch(sessionActions.refreshSession());
    };

    useEffect(() => {
        if (sessionTimerExpired && !isUserActive) {
            toggleSessionManagingModal(true);
            startSessionTimeout();
        }
        if (sessionTimerExpired && isUserActive && isSessionRenewable) {
            dispatch(sessionActions.refreshSession());
        }
    }, [sessionTimerExpired, isUserActive]);

    const activityTrackerReady = isAuthenticated && ttl;

    const remainingTimeText = remaining < 10 ? `0${remaining}` : remaining;
    const sessionModalTitle = `Din session håller på att löpa ut om ${remainingTimeText} sekunder.`;

    return (
        <>
            {activityTrackerReady && (
                <ActivityTracker<T_LoginState>
                    sessionState={(state: T_LoginState) => state.userActivity}
                    sessionTimeout={
                        ttl ? ttl - sessionExpirationInterval : sessionExpirationInterval
                    } // check user activity 1 min before session to be expired
                    userInactivityInterval={userInactivityInterval}
                />
            )}
            <UserNotificationModalDialog
                isOpen={modalOpen}
                isSessionRenewable={isSessionRenewable}
                handlerefreshSession={handlerefreshSession}
                toggleSessionManagingModal={toggleSessionManagingModal}
                handleLogout={handleLogout}
                styleConfig={{
                    modalCloseIcon: closeIcon,
                    modalOverlay: overlay,
                    modalTitle: modalTitle,
                    modalBody: modalBody,
                    modalLayout: modalLayout,
                    modalButtonContainer: modalButtonContainer,
                    modalButton: modalButton({
                        width: "200px",
                    }),
                    buttonText: buttonText,
                }}
                text={{
                    sessionModalTitle: sessionModalTitle,
                    sessionModalText: "Vill du förlänga din session?",
                    optionContinue: "Förläng",
                    optionOk: "OK",
                    optionLogout: "Logga ut",
                }}
            />
            <Container styles={appStyles.pageBackgroundStyles}></Container>
            <Container styles={appStyles.pageRootStyles}>
                <Header
                    logo={<Image styles={headerStyles.headerLogo} src={logo} alt="product_logo" />}
                    button={
                        isAuthenticated && (
                            <Button onClick={handleLogout} styles={buttonStyles.buttonStyles}>
                                Logga ut
                            </Button>
                        )
                    }
                />
                <AppRoutes />
                <Footer />
            </Container>
        </>
    );
}

export default App;

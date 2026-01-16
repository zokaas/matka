// Package imports
import React, { useEffect, useState, useRef } from "react";
import { Route, Switch, useHistory, useLocation, Redirect } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useIntl } from "react-intl";

// @OPR Imports
import { sendLoginEvent, sendUserIdEvent, useWindowSize } from "@opr-finance/utils";
import { iconLibrary } from "@opr-finance/feature-icon-library";
import { StyledLayout } from "@opr-finance/layout-flex-online";
import {
    ButtonStyles,
    HeaderStyles,
    FontsStyles,
    LayoutStyles,
    PageTitleStyles,
    FrontPageStyles,
    LogoutPageStyles,
    ModalStyles,
    LoanPageStyles,
} from "@opr-finance/theme-flex-online";
import { StyledFooter, StyledFooterContent } from "@opr-finance/component-footer/src/StyledFooter";
import { StyledButton } from "@opr-finance/component-button";
import { Logo } from "@opr-finance/component-logo";
import { MobileNavigation, MorePageLink } from "@opr-finance/component-navigation";
import { Icon } from "@opr-finance/component-icon";
import { Font } from "@opr-finance/component-fonts";
import { AppInitializer, PageInitializer } from "@opr-finance/feature-initializer";
import { AppLoader } from "@opr-finance/feature-loader";
import { ConsoleLogger, LOG_LEVEL } from "@opr-finance/feature-console-logger";

// File Imports
import logo from "./images/opr-fo-retagsla-n-flex.svg";
import { Header, MobileNavItems } from "./components/Header";
import { FrontPage } from "./pages/Frontpage/FrontPage";
import { LoanPage } from "./pages/LoanPage/LoanPage";
import { LogoutPage } from "./pages/LogoutPage/LogoutPage";
import { ErrorPage } from "./pages/ErrorPage/ErrorPage";
import { NoLoanPage } from "./pages/NoLoanPage/NoLoanPage";
import { ExpiredPage } from "./pages/ExpiredPage/ExpiredPage";
import { StartPage } from "./pages/StartPage/StartPage";
import { LoginPage } from "./pages/LoginPage";
import { UserPage } from "./pages/UserPage/UserPage";
import { NotFoundPage } from "./pages/NotFoundPage/NotFoundPage";
import { ContactPage } from "./pages/ContactPage/ContactPage";
import { TopupPage } from "./pages/TopupPage/TopupPage";
import { AccountListPage } from "./pages/AccountListPage/AccountListPage";

import { AppState, E_Page_Ids, E_Routes } from "./types/general";
import { AppActionConstants } from "./actions/actions";
import { messages, footerMessages, sessionModalMessages } from "./messages";
import "./index.css";
import { loginSessionActions } from "@opr-finance/feature-login-session";
import {
    ActivityTracker,
    sessionActions,
    useCountdown,
    UserNotificationModalDialog,
} from "@opr-finance/feature-session";
import { ApplicationPage } from "./pages/ApplicationPage/ApplicationPage";
import { ThankYouPage } from "./pages/ThankYouPage/ThankYouPage";
import { KycCompletedPage } from "./pages/KycCompletedPage/KycCompletedPage";

iconLibrary.initFlexOnline();

const isRescoringVisible = process.env.REACT_APP_IS_RESCORING_VISIBLE === "1" ? true : false;

const App: React.FC = () => {
    const logger = new ConsoleLogger({ level: LOG_LEVEL });
    const history = useHistory();
    const location = useLocation();
    const { width } = useWindowSize();
    const { formatMessage: fm } = useIntl();
    const dispatch = useDispatch();
    const { exp, maxSessionRefresh, sessionRefreshCount } = useSelector(
        (state: AppState) => state.session
    );

    // settings for session management
    const sessionExpirationInterval = 60; // 60 sec between notification and logging user out
    const userInactivityInterval = 30; // 30 seconds idle time
    const isSessionRenewable = sessionRefreshCount < maxSessionRefresh;
    const ttl = exp - Math.floor(Date.now() / 1000);

    const [activityTrackerReady, setActivityTrackerReady] = useState(false);

    const { isUserActive, sessionTimerExpired } = useSelector(
        (state: AppState) => state.userActivity
    );

    const [modalOpen, setModalOpen] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setInterval> | null>(null); // Ref to store timeout ID

    const [isMorePageVisible, setIsMorePageVisible] = useState(false);
    const authenticated = useSelector((state: AppState) => state.session.authenticated);

    const boardMemberId = useSelector((state: AppState) => {
        return state.customer?.companyInfo?.boardmembers
            ? state.customer?.companyInfo?.boardmembers[0].id
            : "";
    });

    const onUserLogin = () => {
        if (boardMemberId && authenticated) {
            logger.log("PUSH user_id, login");
            // Push Data Layer event every time a new page loads
            sendUserIdEvent(boardMemberId);

            // Push Data Layer event when a visitor logs in
            sendLoginEvent(boardMemberId);
        }
    };

    useEffect(() => {
        // Check if the page has already loaded
        if (document.readyState === "complete") {
            logger.log("COMPLETE", authenticated, boardMemberId);
            onUserLogin();
        } else {
            window.addEventListener("load", onUserLogin, false);
            // Remove the event listener when component unmounts
            return () => window.removeEventListener("load", onUserLogin);
        }
    }, [boardMemberId, authenticated]);

    const isPathMatched = (path: string) => location.pathname === path;

    const isLoading = useSelector((state: AppState) => state.loader.loading);

    const toggleSessionManagingModal = (isOpen: boolean | ((prevState: boolean) => boolean)) =>
        setModalOpen(isOpen);

    const handleLogout = () => {
        toggleSessionManagingModal(false);
        dispatch(
            loginSessionActions.loginSessionEnd({
                redirect: true,
            })
        );
    };

    // Using the useCountdown hook to manage the countdown for session expiration
    const { remaining, resetCountdown, pauseCountdown } = useCountdown(
        ttl,
        () => handleLogout,
        authenticated
    );

    useEffect(() => {
        if (modalOpen) {
            resetCountdown();
        } else if (authenticated) {
            pauseCountdown();
        }
    }, [modalOpen]);

    useEffect(() => {
        if (authenticated && ttl) setActivityTrackerReady(true);
    }, [authenticated, ttl]);

    const clearSessionTimeout = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    };

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

    if (isLoading) {
        return (
            <AppInitializer
                actionsRequired={[AppActionConstants.APPLICATION_SUCCESS]}
                initializerAction={AppActionConstants.APPLICATION_TRIGGER}>
                <AppLoader />
            </AppInitializer>
        );
    }

    const shouldShowLogin =
        isPathMatched(E_Routes.LOGOUT) ||
        isPathMatched(E_Routes.EXPIRED) ||
        isPathMatched(E_Routes.THANK_YOU) ||
        (isPathMatched(E_Routes.ERROR) && !authenticated);

    const loginButtonText = shouldShowLogin ? fm(messages.logIn) : fm(messages.logout);

    const baseNoSessionPages = [
        E_Routes.ROOT,
        E_Routes.CHOOSE_ACCOUNT,
        E_Routes.NO_LOAN,
        E_Routes.EXPIRED,
        E_Routes.ERROR,
        E_Routes.LOGOUT,
        E_Routes.THANK_YOU,
    ];

    const noNavPagesList = [...baseNoSessionPages, E_Routes.APPLICATION, E_Routes.KYC_COMPLETED];

    const noSessionPages = baseNoSessionPages.some((path) => path === window.location.pathname);
    const noNavPages = noNavPagesList.some((path) => path === window.location.pathname);

    const morePageLinks = [
        <MorePageLink
            key="mobile-item0"
            onClick={() => {
                history.push(`${E_Routes.USER}`);
                setIsMorePageVisible(false);
            }}>
            <Icon icon={["fas", "user"]} size="lg" />
            <Font styleConfig={{ root: HeaderStyles.mobileNavMoreItemText }}>
                {fm(messages.mobileUserInfo)}
            </Font>
        </MorePageLink>,
        <MorePageLink
            onClick={() => {
                history.push(`${E_Routes.CONTACT}`);
                setIsMorePageVisible(false);
            }}>
            <Icon icon={["fas", "comment-alt-dots"]} size="lg" />
            <Font styleConfig={{ root: HeaderStyles.mobileNavMoreItemText }}>
                {fm(messages.mobileCustomerService)}
            </Font>
        </MorePageLink>,
    ];

    const remainingTimeText = remaining < 10 ? `0${remaining}` : remaining;
    const sessionModalTitle = isSessionRenewable
        ? `${fm(sessionModalMessages.sessionModalTitle)} ${remainingTimeText} ${fm(
              sessionModalMessages.sessionModalTitleEnd
          )}`
        : `${fm(sessionModalMessages.sessionModalTitle)} ${remainingTimeText} ${fm(
              sessionModalMessages.sessionModalTitleEnd
          )}`;

    const {
        modalCloseIcon,
        modalOverlay,
        modalContentScroll,
        modalTitle,
        titleText,
        modalButtonContainer,
        modalButtonStyles,
        modalContent,
        modalButtonText,
    } = ModalStyles;
    return (
        <>
            {activityTrackerReady && !noSessionPages && (
                <ActivityTracker<AppState>
                    sessionState={(state: AppState) => state.userActivity}
                    sessionTimeout={
                        ttl ? ttl - sessionExpirationInterval : sessionExpirationInterval
                    } // check user activity 1 min before session to be expired
                    userInactivityInterval={userInactivityInterval}
                    authenticated={authenticated}
                />
            )}
            <UserNotificationModalDialog
                isOpen={modalOpen}
                isSessionRenewable={isSessionRenewable}
                handlerefreshSession={handlerefreshSession}
                toggleSessionManagingModal={toggleSessionManagingModal}
                handleLogout={handleLogout}
                styleConfig={{
                    modalCloseIcon: modalCloseIcon(),
                    modalOverlay: modalOverlay(),
                    modalContentScroll: modalContentScroll({ height: ["fit-content"] }),
                    modalTitle: modalTitle(),
                    titleText: titleText(),
                    modalLayout: LoanPageStyles.modalLayout(),
                    infoBody: FontsStyles.fontContentText(),
                    modalButtonContainer: modalButtonContainer(),
                    modalButton: modalButtonStyles({
                        width: "150px",
                    }),
                    buttonText: modalButtonText(),
                }}
                text={{
                    sessionModalTitle: sessionModalTitle,
                    modalSubtitle: fm(sessionModalMessages.sessionModalBody),
                    optionContinue: fm(sessionModalMessages.sessionModalButtonContinue),
                    optionOk: fm(sessionModalMessages.sessionModalButtonOk),
                    optionLogout: fm(sessionModalMessages.sessionModalButtonLogout),
                }}
            />
            <StyledLayout
                header={
                    <Header
                        navigationVisible={!noNavPages && width >= 786}
                        isTopupVisible={isRescoringVisible}
                        logo={
                            <Logo
                                logoSrc={logo}
                                width={[113, 130, 165]}
                                onClick={() => {
                                    if (authenticated) {
                                        window.location.href = "/front";
                                    } else {
                                        window.location.href = "/";
                                    }
                                }}></Logo>
                        }
                        button={
                            !isPathMatched(E_Routes.ROOT) ? (
                                <StyledButton
                                    onClick={() => {
                                        if (authenticated) {
                                            dispatch(
                                                loginSessionActions.loginSessionEnd({
                                                    redirect: true,
                                                })
                                            );
                                        } else {
                                            window.location.href = "/";
                                        }
                                    }}
                                    styleConfig={{ root: ButtonStyles.buttonStyles() }}>
                                    {loginButtonText}
                                </StyledButton>
                            ) : null
                        }
                        authenticated={authenticated}
                    />
                }
                footer={
                    <StyledFooter
                        columns={StyledFooterContent({
                            styleConfig: {
                                fontFooterText: FontsStyles.fontFooterText(),
                                fontFooterTitle: FontsStyles.fontFooterTitle(),
                            },
                            inputConfig: {
                                messages: {
                                    headingLinks: footerMessages.headingLinks,
                                    registrationDocumentLinkText:
                                        footerMessages.registrationDocumentLinkText,
                                    cookiesLinkText: footerMessages.cookiesLinkText,
                                    headingCustomerService: footerMessages.headingCustomerService,
                                    openingHours: footerMessages.openingHours,
                                    phoneNumber: footerMessages.phoneNumber,
                                    emailTextLink: footerMessages.emailTextLink,
                                    emailText: footerMessages.emailText,
                                    FAQLinkText: footerMessages.FAQLinkText,
                                    headingContactAddress: footerMessages.headingContactAddress,
                                    companyName: footerMessages.companyName,
                                    companyAddress: footerMessages.companyAddress,
                                    companyZip: footerMessages.companyZip,
                                    businessID: footerMessages.businessID,
                                },
                            },
                        })}
                    />
                }
                styleConfig={{
                    rootGrid: LayoutStyles.rootGrid(),
                    fullWidthGrid: LayoutStyles.fullWidthGrid(),
                    mainContentGrid: LayoutStyles.mainContentGrid(),
                    bodyBackgroundColor: "#f1faff",
                }}>
                <>
                    <Switch>
                        <Route
                            path={E_Routes.ROOT}
                            exact
                            render={() => {
                                return (
                                    <PageInitializer
                                        id={E_Page_Ids.START}
                                        successfulActions={[AppActionConstants.START_PAGE_SUCCESS]}
                                        pageInitAction={AppActionConstants.START_PAGE_TRIGGER}>
                                        <StartPage
                                            styleConfig={{
                                                titleBox: PageTitleStyles.titleBox(),
                                                pageTitle: PageTitleStyles.pageTitle(),
                                            }}
                                        />
                                    </PageInitializer>
                                );
                            }}
                        />
                        <Route
                            path={E_Routes.KYC}
                            render={({ match }) => {
                                const { id } = match.params as { id: string };
                                sessionStorage.setItem("applicationId", id);
                                // set app flow as kyc first flow
                                sessionStorage.setItem("flow", "kyc-ff");
                                return <Redirect to={E_Routes.ROOT} />;
                            }}
                        />
                        <Route
                            path={E_Routes.LOGIN}
                            render={() => {
                                return (
                                    <PageInitializer
                                        id={E_Page_Ids.LOGIN}
                                        successfulActions={[AppActionConstants.LOGIN_PAGE_SUCCESS]}
                                        pageInitAction={AppActionConstants.LOGIN_PAGE_TRIGGER}>
                                        <LoginPage />
                                    </PageInitializer>
                                );
                            }}
                        />
                        <Route
                            path={E_Routes.ERROR}
                            render={() => {
                                return <ErrorPage />;
                            }}
                        />
                        <Route
                            path={E_Routes.ACCOUNTS}
                            render={() => (
                                <PageInitializer
                                    id={E_Page_Ids.ACCOUNTS}
                                    successfulActions={[
                                        AppActionConstants.CHOOSE_ACCOUNT_PAGE_SUCCESS,
                                    ]}
                                    pageInitAction={AppActionConstants.CHOOSE_ACCOUNT_PAGE_TRIGGER}>
                                    <AccountListPage
                                        styleConfig={{
                                            titleBox: PageTitleStyles.titleBox(),
                                            pageTitle: PageTitleStyles.pageTitle(),
                                            textStyle: {
                                                boldedText: FontsStyles.fontBoldedText(),
                                                contentText: FontsStyles.fontContentText(),
                                                boxTitle: FontsStyles.fontBoxTitle(),
                                            },
                                        }}
                                    />
                                </PageInitializer>
                            )}
                        />
                        <Route
                            path={E_Routes.FRONT}
                            render={() => {
                                return (
                                    <PageInitializer
                                        id={E_Page_Ids.FRONT}
                                        successfulActions={[AppActionConstants.FRONT_PAGE_SUCCESS]}
                                        pageInitAction={AppActionConstants.FRONT_PAGE_TRIGGER}>
                                        <FrontPage
                                            styleConfig={{
                                                titleBox: PageTitleStyles.titleBox(),
                                                pageTitle: PageTitleStyles.pageTitle(),
                                                mainContentContainer:
                                                    FrontPageStyles.mainContentContainer(),
                                                loanInfoContainer:
                                                    FrontPageStyles.loanInfoContainer(),
                                                newsContainer: FrontPageStyles.newsContainer(),
                                                creditRaiseContainer:
                                                    FrontPageStyles.creditRaiseContainer(),
                                                nostoContainer: FrontPageStyles.nostoContainer(),
                                                nostoImage: FrontPageStyles.nostoImage(),
                                                nostoText: FrontPageStyles.nostoText(),
                                            }}
                                        />
                                    </PageInitializer>
                                );
                            }}
                        />
                        <Route
                            path={E_Routes.LOAN}
                            render={() => {
                                return (
                                    <PageInitializer
                                        id={E_Page_Ids.LOAN}
                                        successfulActions={[AppActionConstants.LOAN_PAGE_SUCCESS]}
                                        pageInitAction={AppActionConstants.LOAN_PAGE_TRIGGER}>
                                        <LoanPage
                                            styleConfig={{
                                                titleBox: PageTitleStyles.titleBox(),
                                                pageTitle: PageTitleStyles.pageTitle(),
                                                textStyle: {
                                                    boldedText: FontsStyles.fontBoldedText(),
                                                    contentText: FontsStyles.fontContentText(),
                                                    alertText: FontsStyles.fontContentText(true),
                                                    boxTitle: FontsStyles.fontBoxTitle(),
                                                    amountText: FontsStyles.fontAmountHeading(),
                                                    linkText: {},
                                                },
                                            }}
                                        />
                                    </PageInitializer>
                                );
                            }}
                        />
                        {isRescoringVisible && (
                            <Route
                                path={E_Routes.TOPUP}
                                render={() => {
                                    return (
                                        <PageInitializer
                                            id={E_Page_Ids.TOPUP}
                                            successfulActions={[
                                                AppActionConstants.TOPUP_PAGE_SUCCESS,
                                            ]}
                                            pageInitAction={AppActionConstants.TOPUP_PAGE_TRIGGER}>
                                            <TopupPage
                                                styleConfig={{
                                                    titleBox: PageTitleStyles.titleBox(),
                                                    pageTitle: PageTitleStyles.pageTitle(),
                                                    modalCloseIcon: modalCloseIcon(),
                                                    modalOverlay: modalOverlay(),
                                                    modalContent: modalContent(),
                                                    modalTitle: modalTitle(),
                                                    titleText: titleText(),
                                                }}
                                            />
                                        </PageInitializer>
                                    );
                                }}
                            />
                        )}
                        <Route
                            path={E_Routes.USER}
                            render={() => {
                                return (
                                    <PageInitializer
                                        id={E_Page_Ids.USER}
                                        successfulActions={[AppActionConstants.USER_PAGE_SUCCESS]}
                                        pageInitAction={AppActionConstants.USER_PAGE_TRIGGER}>
                                        <UserPage
                                            styleConfig={{
                                                titleBox: PageTitleStyles.titleBox(),
                                                pageTitle: PageTitleStyles.pageTitle(),
                                            }}
                                        />
                                    </PageInitializer>
                                );
                            }}
                        />
                        <Route
                            path={E_Routes.CONTACT}
                            render={() => (
                                <PageInitializer
                                    id={E_Page_Ids.CONTACT}
                                    successfulActions={[AppActionConstants.CONTACT_PAGE_SUCCESS]}
                                    pageInitAction={AppActionConstants.CONTACT_PAGE_TRIGGER}>
                                    <ContactPage
                                        styleConfig={{
                                            titleBox: PageTitleStyles.titleBox(),
                                            pageTitle: PageTitleStyles.pageTitle(),
                                            textStyle: {
                                                boldedText: FontsStyles.fontBoldedText(),
                                                contentText: FontsStyles.fontContentText(),
                                                boxTitle: FontsStyles.fontBoxTitle(),
                                                linkText: {},
                                            },
                                        }}
                                    />
                                </PageInitializer>
                            )}
                        />
                        <Route
                            path={E_Routes.THANK_YOU}
                            render={() => {
                                return (
                                    <ThankYouPage
                                        styleConfig={{
                                            titleBox: PageTitleStyles.titleBox(),
                                            pageTitle: PageTitleStyles.pageTitle(),
                                            textStyle: {
                                                boldedText: FontsStyles.fontBoldedText(),
                                                contentText: FontsStyles.fontContentText(),
                                                boxTitle: FontsStyles.fontBoxTitle(),
                                                linkText: {},
                                            },
                                        }}
                                    />
                                );
                            }}
                        />
                        <Route
                            path={E_Routes.KYC_COMPLETED}
                            render={() => {
                                return <KycCompletedPage />;
                            }}
                        />
                        <Route
                            path={E_Routes.LOGOUT}
                            render={() => {
                                return (
                                    <PageInitializer
                                        id={E_Page_Ids.LOGOUT}
                                        successfulActions={[AppActionConstants.LOGOUT_PAGE_SUCCESS]}
                                        pageInitAction={AppActionConstants.LOGOUT_PAGE_TRIGGER}>
                                        <LogoutPage
                                            styleConfig={{
                                                rootStyles: LogoutPageStyles.logoutPageRootStyles(),
                                                titleBox: PageTitleStyles.titleBox(),
                                                pageTitle: PageTitleStyles.pageTitle(),
                                                pageContent: LogoutPageStyles.pageContent(),
                                                content: LogoutPageStyles.content(),
                                                link: LogoutPageStyles.link(),
                                            }}
                                        />
                                    </PageInitializer>
                                );
                            }}
                        />
                        <Route
                            path={E_Routes.NOT_FOUND}
                            exact
                            render={() => {
                                return (
                                    <NotFoundPage
                                        styleConfig={{
                                            titleBox: PageTitleStyles.titleBox(),
                                            pageTitle: PageTitleStyles.pageTitle(),
                                        }}
                                    />
                                );
                            }}
                        />
                        <Route
                            path={E_Routes.NO_LOAN}
                            render={() => {
                                return (
                                    <NoLoanPage
                                        styleConfig={{
                                            titleBox: PageTitleStyles.titleBox(),
                                            pageTitle: PageTitleStyles.pageTitle(),
                                            textStyle: {
                                                boldedText: FontsStyles.fontBoldedText(),
                                                contentText: FontsStyles.fontContentText(),
                                                boxTitle: FontsStyles.fontBoxTitle(),
                                                linkText: {},
                                            },
                                        }}
                                    />
                                );
                            }}
                        />
                        <Route
                            path={E_Routes.EXPIRED}
                            render={() => {
                                return (
                                    <PageInitializer
                                        id={E_Page_Ids.LOGOUT}
                                        successfulActions={[
                                            AppActionConstants.EXPIRED_PAGE_SUCCESS,
                                        ]}
                                        pageInitAction={AppActionConstants.EXPIRED_PAGE_TRIGGER}>
                                        <ExpiredPage
                                            styleConfig={{
                                                titleBox: PageTitleStyles.titleBox(),
                                                pageTitle: PageTitleStyles.pageTitle(),
                                            }}
                                        />
                                    </PageInitializer>
                                );
                            }}
                        />
                        <Route
                            path={E_Routes.APPLICATION}
                            render={() => {
                                return (
                                    <PageInitializer
                                        id={E_Page_Ids.APPLICATION}
                                        successfulActions={[
                                            AppActionConstants.APPLICATION_PAGE_SUCCESS,
                                        ]}
                                        pageInitAction={
                                            AppActionConstants.APPLICATION_PAGE_TRIGGER
                                        }>
                                        <ApplicationPage
                                            styleConfig={{
                                                titleBox: PageTitleStyles.titleBox(),
                                                pageTitle: PageTitleStyles.pageTitle(),
                                                titleText: titleText(),
                                            }}
                                        />
                                    </PageInitializer>
                                );
                            }}
                        />
                        <Route path={E_Routes.ALL_OTHERS}>
                            <Redirect to="/error" />
                        </Route>
                    </Switch>
                </>
                {width < 786 && (
                    <MobileNavigation
                        isVisible={!noNavPages && authenticated}
                        isMorePageVisible={isMorePageVisible}
                        onCloseClick={() => setIsMorePageVisible(false)}
                        morePageTitle={"Mer"}
                        morePageLinksTitle={"Mina uppgifter och kundtjänst"}
                        morePageLinks={morePageLinks}
                        morePageHeader={
                            <Header
                                navigationVisible={false}
                                logo={
                                    <Logo
                                        logoSrc={logo}
                                        width={[113, 165]}
                                        onClick={() => {
                                            if (authenticated) {
                                                window.location.href = "/front";
                                            } else {
                                                window.location.href = "/";
                                            }
                                        }}
                                    />
                                }
                                button={
                                    !isPathMatched(E_Routes.ROOT) ? (
                                        <StyledButton
                                            onClick={() => {
                                                if (authenticated) {
                                                    dispatch(
                                                        loginSessionActions.loginSessionEnd({
                                                            redirect: true,
                                                        })
                                                    );
                                                } else {
                                                    window.location.href = "/";
                                                }
                                            }}
                                            styleConfig={{ root: ButtonStyles.buttonStyles() }}>
                                            {loginButtonText}
                                        </StyledButton>
                                    ) : null
                                }
                                authenticated={authenticated ? true : false}
                            />
                        }
                        morePageAfter={""}
                        icons={[
                            <MobileNavItems
                                isMorePageVisible={isMorePageVisible}
                                isTopupVisible={isRescoringVisible}
                                setIsMorePageVisible={setIsMorePageVisible}></MobileNavItems>,
                        ]}
                    />
                )}
            </StyledLayout>
        </>
    );
};

export default App;

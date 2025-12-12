import { useNavigate, useLocation } from "react-router-dom";
import { Button, Container, Font } from "@opr-finance/styled-components";
import { pageStyles } from "@opr-finance/themes/sweden-foretagslan-application";
import { buttonStyles } from "@opr-finance/themes/sweden-foretagslan-application/componentsStyles";
import { applicationPageStyles } from "@opr-finance/themes/sweden-foretagslan-application/pageStyles";

import ForbiddenPage from "./ForbiddenPage";
import { E_Routes } from "../../types";
import { T_ErrorPageContentProps } from "./ErrorPageContent.types";
import { T_LocationState } from "../../types";

const ErrorPageContent = (props: T_ErrorPageContentProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as T_LocationState | undefined;
    const { reason } = props;
    const history = state?.history;
    const rootPage = `/`;
    const navigateToLogin = () => {
        navigate(rootPage);
    };

    const navigateToMarketingPage = () =>
        (window.location.href = import.meta.env.VITE_MARKETING_PAGE);

    const navigateToPreview = () => navigate(E_Routes.PREVIEW, { state });
    const errorButtonText = history === "SUBMIT-ERROR" ? "Försök igen" : "Tillbaka till startsidan";
    switch (reason) {
        case "/error":
            return (
                <Container styles={applicationPageStyles.formBlock}>
                    <Font styles={pageStyles.applicationPageStyles.blockHeading}>
                        Något gick fel!
                    </Font>
                    <Font styles={pageStyles.applicationPageStyles.blockBody}>
                        Sidan du söker kan inte hittas.
                    </Font>

                    <Button
                        styles={buttonStyles.errorPageButtonStyles({ width: "200px" })}
                        onClick={history === "SUBMIT-ERROR" ? navigateToPreview : navigateToLogin}>
                        {errorButtonText}
                    </Button>
                </Container>
            );
        case "/forbidden":
            return (
                <ForbiddenPage
                    state={state}
                    navigateToLogin={navigateToLogin}
                    navigateToMarketingPage={navigateToMarketingPage}
                />
            );
        case "/expired":
            return (
                <Container styles={applicationPageStyles.formBlock}>
                    <Font styles={pageStyles.applicationPageStyles.blockHeading}>
                        Din session har löpt ut
                    </Font>
                    <Font styles={pageStyles.applicationPageStyles.blockBody}>
                        Du har blivit utloggad från systemet eftersom din session har löpt ut.
                    </Font>

                    <Button
                        styles={buttonStyles.errorPageButtonStyles({ width: "250px" })}
                        onClick={navigateToLogin}>
                        Tillbaka till Inloggningssidan
                    </Button>
                </Container>
            );
        default:
            return (
                <Container styles={applicationPageStyles.formBlock}>
                    <Font styles={pageStyles.applicationPageStyles.blockHeading}>404 error</Font>
                    <Font styles={pageStyles.applicationPageStyles.blockBody}>
                        Sidan du söker kan inte hittas.
                    </Font>

                    <Button
                        styles={buttonStyles.errorPageButtonStyles({ width: "200px" })}
                        onClick={navigateToMarketingPage}>
                        Tillbaka till startsidan
                    </Button>
                </Container>
            );
    }
};

export default ErrorPageContent;

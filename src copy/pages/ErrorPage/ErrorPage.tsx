import { Container } from "@opr-finance/styled-components";
import { applicationPageStyles } from "@opr-finance/themes/sweden-foretagslan-application/pageStyles";
import { useLocation } from "react-router-dom";
import ErrorPageContent from "../../components/ErrorPageContent/ErrorPageContent";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { onPageMount } from "../../utils";
import { T_GlobalState } from "../../rootReducer";

const ErrorPage = () => {
    const { gtm_userId } = useSelector((state: T_GlobalState) => {
        return state.login;
    });

    useEffect(() => {
        if (gtm_userId) onPageMount(gtm_userId);
    }, [gtm_userId]);

    const { pathname } = useLocation();

    return (
        <Container styles={applicationPageStyles.pageRootStyles}>
            <ErrorPageContent reason={pathname} />
        </Container>
    );
};

export default ErrorPage;

import React, { useCallback, useEffect, useMemo } from "react";
import { Button, Container, Font, Link } from "@opr-finance/styled-components";
import { ProgressBar } from "../../components/ProgressBar/ProgressBar";
import {
    applicationSteps,
    flowStatus,
    type T_FlowStatus,
    type T_LoginSessionDataForKyc,
} from "../../types";
import {
    TypedUseSelectorHook,
    useDispatch as useReduxDispatch,
    useSelector as useReduxSelector,
} from "react-redux";
import {
    onPageMount,
    cleanLocalStorage,
    isKYCServiceEnabled,
    mapCompanyDataForKyc,
    startKyc,
} from "../../utils";
import { loginSessionActions } from "@opr-finance/features/login-session";
import { T_GlobalState } from "../../rootReducer";
import { pageStyles } from "@opr-finance/themes/sweden-foretagslan-application";
import { applicationPageStyles } from "@opr-finance/themes/sweden-foretagslan-application/pageStyles";
import { buttonStyles } from "@opr-finance/themes/sweden-foretagslan-application/componentsStyles";
import { useLocation, useNavigate } from "react-router-dom";
import { businessProfile } from "../../constants";

const useAppSelector: TypedUseSelectorHook<T_GlobalState> = useReduxSelector;
const useAppDispatch = () => useReduxDispatch();

type MessageContent = {
    heading: string;
    subheading: React.ReactNode;
    bodyText: React.ReactNode;
};

const { phoneNumber, emailText, emailTextLink } = businessProfile;

const validFlowValues = new Set<T_FlowStatus>(Object.values(flowStatus) as T_FlowStatus[]);

const getFlowStatusFromQuery = (raw?: string | null): T_FlowStatus | undefined => {
    if (typeof raw !== "string") return undefined;
    return validFlowValues.has(raw as T_FlowStatus) ? (raw as T_FlowStatus) : undefined;
};

const kycButtonText = `Till frågorna om Kundkännedom`;

const SubheadingKYC: React.FC = () => (
    <>
        <span>
            Vi ser fram emot att ta nästa steg tillsammans med dig. För att processen ska gå så
            snabbt och smidigt som möjligt behöver vi att du besvarar frågorna om kundkännedom via
            knappen nedan
        </span>{" "}
        <i>{`\"${kycButtonText}\"`}</i>
        <br />
        <span>Vänligen svara så tydligt och utförligt som möjligt.</span>
    </>
);

const BodyKYC: React.FC = () => (
    <>
        <Font styles={pageStyles.applicationPageStyles.blockBody}>
            Kundkännedom är en viktig del av vår process och hjälper oss att förstå din verksamhet
            bättre. Enligt{" "}
            <b>Lag (2017:630) om åtgärder mot penningtvätt och finansiering av terrorism</b>
            är vi skyldiga att inhämta denna information.
        </Font>
        <Font styles={pageStyles.applicationPageStyles.blockBody}>
            När vi har mottagit dina svar skickar vi låneavtalet till din e-post för signering. Om
            lånet har en medborgensman kommer låneavtalet även att skickas till den person du
            angivit i ansökan för elektronisk signering. När alla avtal är undertecknade betalar vi
            ut lånet till det företagskonto du har angett.
        </Font>
    </>
);

const SubheadingKycRedirected: React.FC = () => (
    <>
        <span>Dina svar är viktiga för oss!</span>
        <br />
        <span>Din kredithandläggare kommer att återkomma till dig så snart som möjligt. </span>
    </>
);

const BodyKYCRedirected: React.FC = () => (
    <>
        <Font styles={pageStyles.applicationPageStyles.blockBody}>
            <span>Har du frågor under tiden är du välkommen att kontakta oss på:</span>
            <br />
            <span>
                <Link href={emailTextLink} styles={pageStyles.applicationPageStyles.link}>
                    {emailText}
                </Link>
            </span>
        </Font>
        <Font styles={pageStyles.applicationPageStyles.blockBody}>{phoneNumber}</Font>
    </>
);

const MESSAGES: Record<T_FlowStatus, MessageContent> = {
    [flowStatus.APPLICATION]: {
        heading: "Tack för din ansökan!",
        subheading: "Vi behandlar ansökningar på vardagar mellan 9.00 och 16.00.",
        bodyText: (
            <>
                Vi skickar kreditbeslutet, låneerbjudandet samt låneavtalet till din e-post så att
                du kan skriva under. Om ditt lån även har en annan borgensman , skickar vi
                låneavtalet till den borgensman du har angett för att tecknas elektroniskt. När alla
                nödvändiga låneavtal är undertecknade betalar vi ut lånet till ditt företag till
                kontot du angett.
            </>
        ),
    },
    [flowStatus.ONBOARDING]: {
        heading: "Tack för att du har valt OPR-Företagslån!",
        subheading: <SubheadingKYC />,
        bodyText: <BodyKYC />,
    },
    [flowStatus.COMPLETED]: {
        heading: "Tack!",
        subheading:
            "Du har besvarat allt som behövs för tillfället. Vi kontaktar dig om vi har några ytterligare frågor eller behöver mer information.",
        bodyText: "Ha en fortsatt fin dag!",
    },
    [flowStatus.REDIRECTED]: {
        heading: "Tack!",
        subheading: <SubheadingKycRedirected />,
        bodyText: <BodyKYCRedirected />,
    },
};

const KycButton: React.FC<{
    onClick: () => Promise<void> | void;
    disabled?: boolean;
}> = ({ onClick, disabled }) => (
    <Button
        onClick={onClick}
        styles={buttonStyles.buttonStyles({ width: "400px", alignSelf: "center" })}
        disabled={disabled}>
        {kycButtonText}
    </Button>
);

const ThankYouPage: React.FC = () => {
    const navigate = useNavigate();
    const { search } = useLocation();
    const params = useMemo(() => new URLSearchParams(search), [search]);

    const rawStatus = params.get("status");
    const status = useMemo(() => getFlowStatusFromQuery(rawStatus), [rawStatus]);

    useEffect(() => {
        if (!status) navigate("/error");
    }, [status, navigate]);

    if (!status) return null;

    const dispatch = useAppDispatch();
    const loginSession = useAppSelector((s) => s.login);
    const { gtm_userId, exp, sessionRefreshCount, maxSessionRefresh, auth } = loginSession;

    const { data } = useAppSelector((s) => s.prefilledApplication);
    const company = data?.company;
    const organizationNumber = company?.organizationNumber ?? "";
    const name = company?.name ?? "";

    const showKycButton = useMemo(() => {
        return (
            isKYCServiceEnabled() &&
            status === flowStatus.ONBOARDING &&
            Boolean(organizationNumber && name)
        );
    }, [status, organizationNumber, name]);

    useEffect(() => {
        dispatch(loginSessionActions.setSkipSessionRedirect(true));
        if (!showKycButton) {
            dispatch(loginSessionActions.loginSessionEnd());
            cleanLocalStorage();
        }
    }, [dispatch, showKycButton]);

    const handleStartKyc = useCallback(async () => {
        const sessionData: T_LoginSessionDataForKyc = {
            exp,
            sessionRefreshCount,
            maxSessionRefresh,
            kcUserId: gtm_userId ?? "",
            auth,
        };

        const companyData = mapCompanyDataForKyc(company);

        try {
            const ok = await startKyc(dispatch, companyData, sessionData);
            if (!ok) {
                console.warn(
                    "startKyc returned falsy — KYC flow not started due to missing or invalid params"
                );
            }
        } catch (err) {
            console.error("startKyc failed:", err);
        }
    }, [dispatch, exp, sessionRefreshCount, maxSessionRefresh, gtm_userId, auth, company]);

    useEffect(() => {
        if (gtm_userId) onPageMount(gtm_userId);
    }, [gtm_userId]);

    const { heading, subheading, bodyText } = MESSAGES[status];

    return (
        <Container styles={applicationPageStyles.pageRootStyles}>
            {status === flowStatus.APPLICATION && (
                <Container styles={applicationPageStyles.processBarThankYou}>
                    <ProgressBar title="Låneansökan" currentStep={applicationSteps.SENT} />
                </Container>
            )}

            <Container styles={applicationPageStyles.formBlock}>
                <Font styles={pageStyles.applicationPageStyles.blockHeading}>{heading}</Font>
                <Font styles={pageStyles.applicationPageStyles.blockBody}>{subheading}</Font>

                <Container styles={applicationPageStyles.textBlock}>{bodyText}</Container>

                {showKycButton && data && <KycButton onClick={handleStartKyc} />}
            </Container>
        </Container>
    );
};

export default ThankYouPage;

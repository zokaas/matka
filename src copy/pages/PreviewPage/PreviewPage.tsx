import { useState, useEffect } from "react";
import { Button, Container, Font, Loader } from "@opr-finance/styled-components";
import { pageStyles, componentStyles } from "@opr-finance/themes/sweden-foretagslan-application";

import { useNavigate, useLocation } from "react-router-dom";
import { ProgressBar } from "../../components/ProgressBar/ProgressBar";
import { applicationSteps, T_LocationState, E_Routes, T_ApplicationData } from "../../types";
import { PreviewBlock } from "../../components/PreviewBlock/PreviewBlock";
import { sendApplication } from "../../api/sendApplication";
import {
    applicationMapper,
    convertStringToNumber,
    isKYCServiceEnabled,
    onPageMount,
} from "../../utils";
import { sendGTMEvent } from "@opr-finance/utils";
import { useSelector } from "react-redux";
import { T_GlobalState } from "../../rootReducer";
import { flowStatus, T_FlowStatus } from "../../types/general";

const productName = import.meta.env.VITE_GA4_PRODUCT_NAME;

function PreviewPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as T_LocationState;
    const { gtm_userId } = useSelector((state: T_GlobalState) => {
        return state.login;
    });

    const { buttonStyles } = componentStyles;
    const { applicationPageStyles, previewPageStyles } = pageStyles;
    const returnData = { ...state, history: "BACK-FROM-PREVIEW" };

    const [errorCounter, setErrorCounter] = useState(0);
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigateBack = () => {
        navigate(E_Routes.APPLICATION, { state: returnData });
    };

    const handleSubmitApplication = async () => {
        if (!state?.fields) {
            setErrorMessage("Ett fel har uppstått i ansökan. Vänligen kontakta kundtjänst.");
            return;
        }

        setIsLoading(true);
        // await logApplicationData({ ...state.fields, stage: "Before send application" });

        const mappedData: T_ApplicationData = await applicationMapper(
            state.fields,
            state.secondGuarantorVisible,
            clientApplicationId
        );

        const flow: T_FlowStatus = isKYCServiceEnabled()
            ? flowStatus.ONBOARDING
            : flowStatus.APPLICATION;

        const response = await sendApplication(mappedData);
        if (response === 201) {
            setErrorCounter(0);
            pushDatalayerEvent();
            setIsLoading(false);
            const url = `${E_Routes.THANK_YOU}?status=${encodeURIComponent(flow)}`;
            navigate(url, { replace: true });
        } else handleError();
    };
    const handleError = () => {
        const message =
            errorCounter <= 1
                ? "Ett problem har uppstått med att skicka din ansökan. Försök att skicka den på nytt."
                : "Ett problem har uppstått och vi kan inte ta emot din ansökan. Vänligen kontakta vår kundservice.";
        setErrorMessage(message);
        setErrorCounter(errorCounter + 1);
        setIsLoading(false);
    };
    const clientApplicationId = (window as any).clientApplicationId;

    const pushDatalayerEvent = () => {
        if (!state?.fields) {
            console.error("Fields are missing from the state.");
            return;
        }
        sendGTMEvent({ ecommerce: null });
        const { loanAmount, campaignCode, repaymentPeriod, loanPurpose, loanPurposeDescription } =
            state.fields;
        const promotionalCode =
            campaignCode.trim().length > 0 ? campaignCode : "No promotional code";
        const loanAmountFormatted = convertStringToNumber(loanAmount);
        const dataLayerEventSubmit = createDataLayerEventSubmit(
            loanAmountFormatted,
            promotionalCode,
            repaymentPeriod,
            !isKYCServiceEnabled() ? loanPurpose : undefined,
            !isKYCServiceEnabled() ? loanPurposeDescription : undefined
        );
        sendGTMEvent(dataLayerEventSubmit);
        const dataLayerEventPurchase = createDataLayerEventPurcahse(loanAmountFormatted);
        sendGTMEvent(dataLayerEventPurchase);
    };

    const createDataLayerEventSubmit = (
        loanAmount: number,
        promotionalCode: string,
        repaymentPeriod: string,
        loanPurpose?: string,
        loanPurposeDescription?: string
    ) => {
        const event = {
            event: "submit_application_business_loan",
            application_id: clientApplicationId,
            loan_amount: loanAmount,
            loan_purpose: loanPurpose,
            loan_purpose_description: loanPurposeDescription,
            repayment_period: repaymentPeriod,
            promotional_code: promotionalCode,
            product: productName,
        };
        return event;
    };

    const createDataLayerEventPurcahse = (loanAmount: number) => {
        const event = {
            event: "purchase",
            ecommerce: {
                transaction_id: clientApplicationId,
                value: loanAmount,
                currency: "SEK",
                product: productName,
                items: [
                    {
                        item_id: "BL_1",
                        item_name: productName,
                        price: loanAmount,
                        quantity: 1,
                    },
                ],
            },
        };
        return event;
    };

    useEffect(() => {
        if (!state?.fields) {
            navigate(E_Routes.ERROR);
        } else {
            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        }
    }, []);

    useEffect(() => {
        if (gtm_userId) onPageMount(gtm_userId);
    }, [gtm_userId]);

    return (
        <Container styles={applicationPageStyles.pageRootStyles}>
            <Container styles={applicationPageStyles.processBar}>
                <ProgressBar title="Låneansökan" currentStep={applicationSteps.CHECK} />
            </Container>
            <Container styles={applicationPageStyles.form}>
                <Container styles={applicationPageStyles.blocksContainer}>
                    <PreviewBlock />
                    <Container styles={previewPageStyles.buttonBlockContainer}>
                        <Container styles={previewPageStyles.buttonBlock}>
                            <Button
                                onClick={navigateBack}
                                styles={buttonStyles.buttonStyles({
                                    width: "200px",
                                })}>
                                Redigera ansökan
                            </Button>
                            {errorCounter <= 2 ? (
                                <Button
                                    onClick={() => handleSubmitApplication()}
                                    disabled={isLoading}
                                    styles={buttonStyles.buttonStyles({
                                        variant: "secondary",
                                        width: "200px",
                                    })}>
                                    {isLoading ? (
                                        <Loader
                                            size={"1x"}
                                            color={"black"}
                                            icon={["far", "loader"]}
                                            styles={""}
                                        />
                                    ) : (
                                        "Skicka ansökan"
                                    )}
                                </Button>
                            ) : null}
                        </Container>
                        {errorCounter > 0 ? (
                            <Font styles={previewPageStyles.errorMessageStyles}>
                                {errorMessage}
                            </Font>
                        ) : null}
                    </Container>
                </Container>
            </Container>
        </Container>
    );
}

export default PreviewPage;

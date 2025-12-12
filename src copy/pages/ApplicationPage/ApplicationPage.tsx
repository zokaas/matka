import { useEffect, useMemo, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

import { Container, Button, Loader } from "@opr-finance/styled-components";
import { pageStyles, componentStyles } from "@opr-finance/themes/sweden-foretagslan-application";
import { ConsoleLogger, LOG_LEVEL } from "@opr-finance/features/console-logger";

import { BasicInfoBlock } from "../../components/BasicInfoBlock/BasicInfoBlock";
import { ApplicantInfoBlock } from "../../components/ApplicantInfoBlock/ApplicantInfoBlock";
import { CompanyInfoBlock } from "../../components/CompanyInfoBlock/CompanyInfoBlock";
import { Guarantor2InfoBlock } from "../../components/Guarantor2InfoBlock/Guarantor2InfoBlock";
import { GuarantorInfoBlock } from "../../components/GuarantorInfoBlock/GuarantorInfoBlock";
import { AttachmentBlock } from "../../components/AttachmentBlock/AttachmentBlock";
import { ProgressBar } from "../../components/ProgressBar/ProgressBar";
import { SideBar } from "../../components/SideBar/SideBar";
import {
    applicationSteps,
    E_RequiredFormBlock,
    T_EventType,
    T_LocationState,
    E_Routes,
    T_PrefilledApplicationData,
    T_LoginSessionDataForKyc,
    flowStatus,
} from "../../types";

import { schemas, T_FormSchema } from "../../validation";
import { useForm } from "../../hooks/useForm";
import { useValidation } from "../../hooks/useValidation";
import { sendGaEvent, sendGTMEvent, formatThousand, isValidDate } from "@opr-finance/utils";
import { T_FormFields } from "../../hooks/types";
import { T_GlobalState } from "../../rootReducer";
import {
    evaluateKycRedirection,
    validateApplicantAccess,
    mapCompanyDataForKyc,
    startKyc,
} from "../../utils";

/*******  MOCK DATA *********/
const applicationPreviewVisible: boolean = true;
const productName = import.meta.env.VITE_GA4_PRODUCT_NAME;

function ApplicationPage() {
    const logger = new ConsoleLogger({ level: LOG_LEVEL });
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const state = location.state as T_LocationState | undefined;
    const { buttonStyles } = componentStyles;
    const { applicationPageStyles } = pageStyles;
    const [activeBlock, setActiveBlock] = useState<string | null>(null);
    const [requiredFormBlocks, setRequiredFormBlocks] = useState<string[]>([
        E_RequiredFormBlock.BASIC_INFO,
        E_RequiredFormBlock.COMPANY_INFO,
        E_RequiredFormBlock.APPLICANT_INFO,
        E_RequiredFormBlock.GUARANTOR_INFO,
    ]);
    const [secondGuarantorVisible, setSecondGuarantorVisible] = useState<boolean>(false);
    const [validateAll, setValidateAll] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [isPartnerApplication, setIsPartnerApplication] = useState<boolean>(false);
    const checkFirstRender = useRef(false);
    const { fields, setFields, fieldErrors, setFieldErrors, errs, setErrs } = useForm();
    const { validBlocks, invalidBlocks } = useValidation(errs, fields);
    const {
        name,
        ssn,
        gtm_userId,
        logoutInProgress,
        exp,
        sessionRefreshCount,
        maxSessionRefresh,
        auth,
    } = useSelector((state: T_GlobalState) => {
        return state.login;
    });
    const { data } = useSelector((state: T_GlobalState) => {
        return state.prefilledApplication;
    });

    const company = data?.company;
    const dataFromLS = localStorage.getItem("company-info");
    const companyData = useMemo(() => dataFromLS && JSON.parse(dataFromLS), [dataFromLS]);

    useEffect(() => {
        // refresh Application page to restore Tag manager connection to website
        if (reloadsCounter === "0") {
            localStorage.setItem("reloads", "1");
            window.location.reload();
        } else {
            const reloads = Number(reloadsCounter) + 1;
            localStorage.setItem("reloads", reloads.toString());
        }
    }, []);

    useEffect(() => {
        // Check if the page has already loaded
        if (document.readyState === "complete") {
            onApplicationPageLoad();
        } else {
            window.addEventListener("load", onApplicationPageLoad, false);
            // Remove the event listener when component unmounts
            return () => window.removeEventListener("load", onApplicationPageLoad);
        }
    }, [gtm_userId]);

    useEffect(() => {
        const cleanAmount: string = fields.loanAmount.replace(/\s\D*/g, "");
        if (Number(fields.loanAmount) === 0) return;
        if (Number(cleanAmount) > 200000) {
            setRequiredFormBlocks([
                E_RequiredFormBlock.BASIC_INFO,
                E_RequiredFormBlock.COMPANY_INFO,
                E_RequiredFormBlock.APPLICANT_INFO,
                E_RequiredFormBlock.GUARANTOR_INFO,
                E_RequiredFormBlock.SECOND_GUARANTOR_INFO,
            ]);
            setSecondGuarantorVisible(true);
        } else {
            setRequiredFormBlocks([
                E_RequiredFormBlock.BASIC_INFO,
                E_RequiredFormBlock.COMPANY_INFO,
                E_RequiredFormBlock.APPLICANT_INFO,
                E_RequiredFormBlock.GUARANTOR_INFO,
            ]);
            setSecondGuarantorVisible(false);
        }
    }, [fields.loanAmount]);

    useEffect(() => {
        if (logoutInProgress) {
            navigate(E_Routes.ROOT);
            return;
        }

        if (!uuid) {
            navigate(E_Routes.ERROR);
            return;
        }

        if (state?.fields) {
            handlePrefilledFields();
        } else if (data) {
            (async function fetchData() {
                await handleGetData();
            })();
        }
    }, [name, ssn, companyData, data]);

    useEffect(() => {
        if (checkFirstRender.current) {
            const guarantorInfoBlockError = validateFirstGuarantor(fields);
            setErrs({ ...errs, guarantorInfoBlockError });
            logger.log(guarantorInfoBlockError);
            return;
        }

        checkFirstRender.current = true;
    }, [
        fields.selfGuarantor,
        fields.otherAsFirstGuarantor,
        fields.guarantorEmail,
        fields.guarantorName,
        fields.guarantorPhone,
    ]);

    useEffect(() => {
        if (state?.history === "BACK-FROM-PREVIEW" && validateAll && state.fields) {
            Object.entries(state.fields).forEach(([key, value]) => {
                try {
                    const schema = schemas[key as keyof T_FormSchema];
                    if (schema && value !== undefined) {
                        schema.parse(value);
                        errs[key] = "";
                    }
                } catch (error: any) {
                    errs[key] = error?.issues?.[0]?.message ?? "";
                }
            });
            setValidateAll(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state]);

    const rawUuid = localStorage.getItem("applicationUuid");
    const uuid = rawUuid ?? null;
    const reloadsCounter = localStorage.getItem("reloads") ?? "0";

    const handleSubmit = () => {
        const fieldData = fields.otherAsFirstGuarantor
            ? { ...fields, businessCheck: true }
            : {
                  ...fields,
                  guarantorName: fields.applicantName,
                  guarantorEmail: fields.emailAddress,
                  guarantorPhone: fields.applicantPhone,
                  businessCheck: true,
              };

        navigate(E_Routes.PREVIEW, { state: { fields: fieldData, secondGuarantorVisible } });
    };

    const handleFieldChange = (e: T_EventType) => {
        const { name, value } = e;
        if (name === "attachments") {
            setFields({ ...fields, [e.name]: e.value });
        }
        setFields({ ...fields, [name]: value });
    };

    const areRequiredFieldsValidated = requiredFormBlocks.every((element) => {
        return validBlocks.indexOf(element) !== -1;
    });

    const onApplicationPageLoad = () => {
        //Push Data Layer event when a page refreshed
        if (gtm_userId) {
            if (reloadsCounter === "1") {
                //Push Data Layer event when a visitor logs in
                sendGTMEvent({
                    event: "login",
                    userId: gtm_userId,
                    product: productName,
                });
            }
            if (reloadsCounter !== "0") {
                sendGTMEvent({
                    event: "user_id",
                    userId: gtm_userId,
                    product: productName,
                });
            }
        }
    };

    const handlePrefilledFields = () => {
        if (state?.fields) setFields(state.fields);
        setIsLoading(false);
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const handleGetData = async () => {
        if (!data) return navigate(E_Routes.ERROR);
        const organizationNumber = data?.company.organizationNumber;
        if (!organizationNumber || !ssn) return navigate(E_Routes.ERROR);
        const applicantSsn = data?.applicant.ssn;

        const allowed = await validateApplicantAccess(
            ssn,
            applicantSsn,
            organizationNumber,
            navigate
        );
        if (!allowed) return;
        //Push Data Layer event when a visitor begins an application for a business loan
        handlePushDataLayerEvent();

        if (data?.brokerApplicationId) setIsPartnerApplication(true);

        const { kycFormFilled, state } = data;
        const isKycCompleted = isValidDate(kycFormFilled);
        logger.debug("app state:", state);
        logger.debug("kycFormFilled:", kycFormFilled);
        logger.debug("KYC completed:", isKycCompleted);
        const appFlow = evaluateKycRedirection(state, isKycCompleted);

        logger.debug("appFlow:", appFlow);
        if (appFlow === flowStatus.ONBOARDING) {
            const sessionData: T_LoginSessionDataForKyc = {
                exp,
                sessionRefreshCount,
                maxSessionRefresh,
                kcUserId: gtm_userId ?? "",
                auth,
            };
            const companyData = mapCompanyDataForKyc(company);

            const started = await startKyc(dispatch, companyData, sessionData);
            if (!started) {
                navigate(E_Routes.ERROR);
                return;
            }
        } else if (appFlow === flowStatus.COMPLETED) {
            return navigate(E_Routes.THANK_YOU, { state: { status: appFlow } });
        }

        if (reloadsCounter !== "0") setIsLoading(false);
        setFormattedFields(data);
        validateAutoFillData(data);
    };

    const handlePushDataLayerEvent = () => {
        sendGaEvent("begin_application_business_loan");
    };

    const setFormattedFields = (prefilledData: T_PrefilledApplicationData) => {
        const formattedLoanAmount = prefilledData
            ? `${formatThousand(prefilledData.amount.toString())} kr`
            : "";
        const companyData = prefilledData?.company || {};
        const applicantData = prefilledData?.applicant || {};
        const guarantorData = prefilledData?.guarantor || {};

        setFields({
            ...fields,
            applicantName: name!,
            ssn: ssn!,
            applicationUuid: prefilledData?.applicationUuid || "",
            loanAmount: formattedLoanAmount,
            businessId: companyData.organizationNumber || "",
            companyName: companyData.name || "",
            organizationNumber: companyData.organizationNumber || "",
            streetAddress: companyData.streetAddress || "",
            zipCode: companyData.zipcode || "",
            city: companyData.city || "",
            disburismentAccount: companyData.accountNumber || "",
            emailAddress: applicantData.email || "",
            applicantPhone: applicantData.phoneNumber || "",
            repaymentPeriod: prefilledData?.maturity
                ? `${prefilledData.maturity.toString()} månader`
                : "",
            source: prefilledData?.source || "own_channel",
            guarantorName: guarantorData.name || "",
            guarantorEmail: guarantorData.email || "",
            guarantorPhone: guarantorData.phoneNumber || "",
        });
    };

    const validateAutoFillData = (prefilledData: T_PrefilledApplicationData) => {
        const companyData = prefilledData?.company || {};
        const applicantData = prefilledData?.applicant || {};
        const guarantorData = prefilledData?.guarantor || {};

        const autoFillData = {
            loanAmount: prefilledData?.amount.toString(),
            emailAddress: applicantData.email,
            applicantPhone: applicantData.phoneNumber,
            repaymentPeriod: prefilledData?.maturity?.toString() + " månader",
            applicantName: name,
            ssn: ssn,
            streetAddress: companyData.streetAddress,
            zipCode: companyData.zipcode,
            city: companyData.city,
            guarantorName: guarantorData.name,
            guarantorEmail: guarantorData.email,
            guarantorPhone: guarantorData.phoneNumber,
        };

        Object.entries(autoFillData).forEach(([key, value]) => {
            try {
                const schema = schemas[key as keyof T_FormSchema];
                if (schema && value !== undefined) {
                    schema.parse(value);
                    errs[key] = "";
                }
            } catch (error: any) {
                const message = error.issues[0].message;
                errs[key] = message;
            }
        });
    };

    const validateFirstGuarantor = (fields: T_FormFields) => {
        if (!fields.selfGuarantor && !fields.otherAsFirstGuarantor) {
            return "Ange en borgensman"; // "Specify a guarantor"
        }
        if (
            fields.otherAsFirstGuarantor &&
            (!fields.guarantorEmail || !fields.guarantorName || !fields.guarantorPhone)
        ) {
            return "Vänligen ange namn och kontaktuppgifter till borgensmannen"; // Please provide the name and contact details of the guarantor
        }
        return "";
    };

    const handleBlur = (e: T_EventType) => {
        const name = e.name;
        const value = e.value;
        try {
            const schema = schemas[name as keyof T_FormSchema];
            if (schema && value !== undefined) {
                schema.parse(value);
                setErrs({ ...errs, [name]: "" });
            }
        } catch (error: any) {
            const message = error.issues[0].message;
            setErrs({ ...errs, [name]: message });
        }
        setActiveBlock(null);
    };

    const handleFocus = (block: string) => {
        setActiveBlock(block);
    };

    const getErrorMsg = (name: string) => {
        return errs[name];
    };

    if (isLoading) {
        return (
            <Container styles={applicationPageStyles.pageRootStyles}>
                <Container styles={applicationPageStyles.loaderStyles}>
                    <Loader size={"3x"} color={"black"} icon={["far", "loader"]} styles={""} />
                </Container>
            </Container>
        );
    }

    return (
        <Container styles={applicationPageStyles.pageRootStyles}>
            <Container styles={applicationPageStyles.processBar}>
                <ProgressBar title="Låneansökan" currentStep={applicationSteps.FILL} />
            </Container>
            <Container styles={applicationPageStyles.form}>
                <Container styles={applicationPageStyles.blocksContainer}>
                    <BasicInfoBlock
                        fields={fields}
                        setFields={setFields}
                        fieldErrors={fieldErrors}
                        setFieldErrors={setFieldErrors}
                        formId="basicInfo"
                        handleFieldChange={handleFieldChange}
                        handleBlur={handleBlur}
                        handleFocus={handleFocus}
                        getErrorMessage={getErrorMsg}
                        secondGuarantorVisible={secondGuarantorVisible}
                        isPartnerApplication={isPartnerApplication}
                    />
                    <CompanyInfoBlock
                        formId="companyInfo"
                        fields={fields}
                        setFields={setFields}
                        fieldErrors={fieldErrors}
                        setFieldErrors={setFieldErrors}
                        handleFieldChange={handleFieldChange}
                        handleBlur={handleBlur}
                        handleFocus={handleFocus}
                        getErrorMessage={getErrorMsg}
                    />
                    <ApplicantInfoBlock
                        formId="applicantInfo"
                        fields={fields}
                        setFields={setFields}
                        fieldErrors={fieldErrors}
                        setFieldErrors={setFieldErrors}
                        handleFieldChange={handleFieldChange}
                        handleBlur={handleBlur}
                        handleFocus={handleFocus}
                        getErrorMessage={getErrorMsg}
                    />
                    <GuarantorInfoBlock
                        formId="guarantorInfo"
                        fields={fields}
                        setFields={setFields}
                        fieldErrors={fieldErrors}
                        setFieldErrors={setFieldErrors}
                        handleFieldChange={handleFieldChange}
                        handleBlur={handleBlur}
                        handleFocus={handleFocus}
                        getErrorMessage={getErrorMsg}
                    />
                    {secondGuarantorVisible ? (
                        <Guarantor2InfoBlock
                            formId="secondGuarantorInfo"
                            fields={fields}
                            setFields={setFields}
                            fieldErrors={fieldErrors}
                            setFieldErrors={setFieldErrors}
                            handleFieldChange={handleFieldChange}
                            handleBlur={handleBlur}
                            handleFocus={handleFocus}
                            getErrorMessage={getErrorMsg}
                        />
                    ) : (
                        ""
                    )}

                    <AttachmentBlock
                        formId="attachments"
                        fields={fields}
                        fieldErrors={fieldErrors}
                        setFieldErrors={setFieldErrors}
                        handleFieldChange={handleFieldChange}
                        handleBlur={handleBlur}
                        handleFocus={handleFocus}
                        getErrorMessage={getErrorMsg}
                    />
                    <Container
                        id="verification"
                        styles={pageStyles.applicationPageStyles.formBlock}>
                        <Button
                            onClick={() => handleSubmit()}
                            disabled={!areRequiredFieldsValidated}
                            styles={buttonStyles.buttonStyles({
                                width: "180px",
                                alignSelf: "flex-end",
                            })}>
                            Förhandsgranska
                        </Button>
                        <br />
                    </Container>
                </Container>

                <Container styles={applicationPageStyles.sideBar}>
                    <SideBar
                        currentForm={activeBlock}
                        validForms={validBlocks}
                        blurredForms={invalidBlocks}
                        secondGuarantorVisible={secondGuarantorVisible}
                        applicationPreviewVisible={applicationPreviewVisible}
                    />
                </Container>
            </Container>
        </Container>
    );
}

export default ApplicationPage;

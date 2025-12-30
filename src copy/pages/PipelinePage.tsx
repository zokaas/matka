import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import * as yup from "yup";

import { Font } from "@opr-finance/component-fonts";
import {
    TextField,
    SelectField,
    CheckboxField,
    ButtonField,
    useForm,
    SelectOption,
    getOption,
    option,
} from "@opr-finance/component-forms";
import { pickOff, sendGAConversion, sendGAEvent } from "@opr-finance/utils";
import { Icon } from "@opr-finance/component-icon";
import { Loader } from "@opr-finance/component-loader";
import { isValidEmail, isValidPhoneNumberSe, validateZipCode } from "@opr-finance/validators";
import { currency, CurrencyFormat, CurrencyLocale } from "@opr-finance/component-currency";
import { Link } from "@opr-finance/component-link-to";
import { Tooltip } from "@opr-finance/component-tooltip";
import { ConsoleLogger, LOG_LEVEL } from "@opr-finance/feature-console-logger";

import { sendApplication } from "../api/flex";
import { validateDisbursementAccount } from "../api/validateDisbursementAccount";
import { T_Application, T_PipelinePageProps, T_ApplicationSent } from "../types/general";
import {
    applicationMapper,
    createDataLayerEventPurchase,
    createDataLayerEventSubmit,
} from "../utils";

const Form = styled.form`
    display: flex;
    flex-direction: column;
`;

const Checkboxes = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: flex-start;
`;
const CheckboxContainer = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: flex-start;
    margin: 12px 0 0 0;
    &:last-of-type {
        margin-bottom: 12px;
    }
`;
const LoaderContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
`;
const TooltipLabel = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
`;

export function PipelinePage(props: Readonly<T_PipelinePageProps>) {
    const logger = new ConsoleLogger({ level: LOG_LEVEL });
    const history = useHistory();

    const amountOptions = [
        option("Välj"),
        option(
            currency({
                value: 20000,
                locale: CurrencyLocale.Sweden,
                currency: CurrencyFormat.Sweden,
            })
        ),
        option(
            currency({
                value: 50000,
                locale: CurrencyLocale.Sweden,
                currency: CurrencyFormat.Sweden,
            })
        ),
        option(
            currency({
                value: 100000,
                locale: CurrencyLocale.Sweden,
                currency: CurrencyFormat.Sweden,
            })
        ),
        option(
            currency({
                value: 150000,
                locale: CurrencyLocale.Sweden,
                currency: CurrencyFormat.Sweden,
            })
        ),
        option(
            currency({
                value: 200000,
                locale: CurrencyLocale.Sweden,
                currency: CurrencyFormat.Sweden,
            })
        ),
    ];
    const reasonOptions = [
        option("Välj"),
        option("Köpa utrustning"),
        option("Anställa personal"),
        option("Finansiera skuld"),
        option("Marknadsföring"),
        option("Inköp av inventarier"),
        option("Oväntad utgift"),
        option("Expansion"),
        option("Betala leverantörsfakturor"),
        option("Annat"),
    ];
    const pepOptions = [option("Välj"), option("Ja"), option("Nej")];

    const validAmounts: string[] = pickOff(
        amountOptions,
        (option: SelectOption) => option.value === "Välj"
    ).map((option: SelectOption) => {
        return option.value;
    });

    const validReasons: string[] = pickOff(
        reasonOptions,
        (option: SelectOption) => option.value === "Välj"
    ).map((option: SelectOption) => {
        return option.value;
    });

    const validPepOptions: string[] = pickOff(
        pepOptions,
        (option: SelectOption) => option.value === "Välj"
    ).map((option: SelectOption) => {
        return option.value;
    });

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const schema = yup.object().shape({
        amount: yup
            .string()
            .oneOf(validAmounts, "Kreditgräns saknas")
            .required("Kreditgräns saknas"),
        reason: yup.string().oneOf(validReasons, "Lånesyfte saknas").required("Lånesyfte saknas"),
        reasonDescription: yup
            .string()
            .min(1, "Ange en mer detaljerad beskrivning av syftet med lånet")
            .required("Ange en mer detaljerad beskrivning av syftet med lånet"),
        ssn: yup.string().min(1, "Personnummer saknas").required("Personnummer saknas"),
        companyName: yup.string().min(3, "Företagsnamn saknas").required("Företagsnamn saknas"),
        companyId: yup.string().required("Organisationsnummer saknas"),
        iban: yup
            .string()
            .test(
                "isValidDisbursementAccount",
                "Felaktigt kontonummer",
                validateDisbursementAccount
            )
            .notRequired(),
        companyAddressStreet: yup.string().notRequired(),
        companyAddressCity: yup.string().notRequired(),
        companyAddressZip: yup
            .string()
            .test("looksLikeZipCode", "Angivet postnummer är felaktigt", validateZipCode)
            .notRequired(),
        turnover: yup
            .string()
            .required("Företagets månadsomsättning saknas")
            .matches(/^\d+([.,]\d+)?$/, "Fel format, endast siffror är tillåtna"),
        applicantGivenName: yup.string().required("Förnamn saknas"),
        applicantSurname: yup.string().required("Efternamn saknas"),
        applicantEmail: yup
            .string()
            .required("Email saknas")
            .test("validateEmailFormat", "Angiven emailadress är felaktig", isValidEmail),
        applicantPhone: yup
            .string()
            .test("isValidPhone", "Angivet telefonnummer är felaktigt", isValidPhoneNumberSe)
            .required("Telefonnummer saknas"),
        creditCheck: yup
            .boolean()
            .oneOf([true], "Credit check saknas")
            .required("Credit check saknas"),
        isPep: yup
            .string()
            .oneOf(validPepOptions, "Pep check saknas")
            .required("Credit check saknas"),
        campaignCode: yup.string().notRequired(),
    });

    const { form, processChange, processBlur, processSubmit, Error } = useForm<T_Application>({
        initial: {
            ssn: "",
            amount: "Välj",
            reason: "Välj",
            reasonDescription: "",
            companyName: "",
            companyId: "",
            iban: "",
            companyAddressStreet: "",
            companyAddressCity: "",
            companyAddressZip: "",
            isPep: "Välj",
            turnover: "",
            applicantName: "",
            applicantBirthday: "",
            applicantGivenName: "",
            applicantSurname: "",
            applicantEmail: "",
            applicantPhone: "",
            creditCheck: false,
            campaignCode: "",
        },
        schema,
        styleConfig: {
            body: props.styleConfig.body,
            bodyTitle: props.styleConfig.bodyTitle,
            button: props.styleConfig.button,
            buttonText: props.styleConfig.buttonText,
            checkbox: props.styleConfig.checkbox,
            checkboxText: props.styleConfig.checkboxText,
            formError: props.styleConfig.formError,
            select: props.styleConfig.select,
            textField: props.styleConfig.textField,
        },
        onChange: () => {
            logger.log("on change!");
        },
        onError: () => {
            logger.log("on error!");
        },
        onSubmit: async (data: T_Application) => {
            const mappedData = await applicationMapper(data);
            logger.log("got form result:", mappedData);
            setIsLoading(true);
            const result = await sendApplication(mappedData);
            sendGAConversion(mappedData.amount);
            logger.log("got result", result);
            const dataLayerEventSubmit = createDataLayerEventSubmit(mappedData);
            sendGAEvent(dataLayerEventSubmit);
            sendGAEvent({ ecommerce: null });
            const dataLayerEventPurchase = createDataLayerEventPurchase(mappedData);
            sendGAEvent(dataLayerEventPurchase);
            logger.log("send DLE events ", dataLayerEventSubmit, dataLayerEventPurchase);
            setIsLoading(false);
            const sendState: T_ApplicationSent = { status: result.status };
            history.push("/completed", sendState);
        },
    });

    useEffect(() => {
        const onPageLoad = () => {
            sendGAEvent({ event: "start" });
            // Push Data Layer event when a visitor visit a page or the page reloads.
            sendGAEvent({ event: "pageview" });
            // TODO: should it be separated event? "... partner"?
            // Push Data Layer event when a visitor begins a application for a business credit
            sendGAEvent({ event: "begin_application_business_credit" });
        };

        // Check if the page has already loaded
        if (document.readyState === "complete") {
            onPageLoad();
        } else {
            window.addEventListener("load", onPageLoad, false);
            // Remove the event listener when component unmounts
            return () => window.removeEventListener("load", onPageLoad);
        }
    }, []);

    if (isLoading) {
        return (
            <LoaderContainer>
                <Loader isLoading={true} />
            </LoaderContainer>
        );
    }
    return (
        <div>
            <Form>
                <Font styleConfig={{ root: props.styleConfig.pageTitle }}>
                    Ansök om OPR-Företagslån Flex
                </Font>
                <Font styleConfig={{ root: props.styleConfig.body }}>
                    Ansökan tar enbart 1 minut och du får ditt kreditbesked redan samma dag. Nedan
                    väljer du den kreditgräns som passar företagets behov samt bifogar företagets
                    uppgifter och dina kontaktuppgifter.
                </Font>
                <Font styleConfig={{ root: props.styleConfig.body }}>
                    Vi handlägger sedan din ansökan och skickar ditt krediterbjudande för signering
                    med mobilt BankID via e-post. Efter signering har du fri möjlighet att nyttja
                    din nya företagskredit. Således kan du ha pengarna ditt företag behöver redan
                    idag.
                </Font>
                <Font styleConfig={{ root: props.styleConfig.body }}>
                    Vi efterfrågar borgensåtagande från ansökande.
                </Font>
                <Font styleConfig={{ root: props.styleConfig.body }}>
                    Uppgifterna markerade med asterisk * i formuläret är obligatoriska.
                </Font>
                <Font styleConfig={{ root: props.styleConfig.bodyTitle }}>
                    Uppgifter om krediten
                </Font>
                <Font styleConfig={{ root: props.styleConfig.body }}>Kreditgräns *</Font>
                <SelectField
                    name="amount"
                    icon={null}
                    value={getOption(amountOptions, form.data.amount)}
                    inputConfig={{
                        select: {
                            value: form.data.amount,
                            onChange: (e) => {
                                processChange({
                                    field: "amount",
                                    value: e?.value,
                                    validate: true,
                                    touched: true,
                                    blurred: true,
                                });
                            },
                        },
                    }}
                    options={amountOptions}
                    styleConfig={{
                        select: props.styleConfig.select,
                        singleValue: {
                            fontFamily: "arial",
                            fontSize: "16px",
                            color: "#0c445c",
                            fontWeight: "bold",
                        },
                        option: {
                            fontFamily: "arial",
                            fontSize: "16px",
                            color: "#0c445c",
                            fontWeight: "bold",
                        },
                    }}
                />
                <Font styleConfig={{ root: props.styleConfig.body }}>Lånesyfte *</Font>
                <SelectField
                    name="reason"
                    icon={null}
                    value={getOption(reasonOptions, form.data.reason)}
                    inputConfig={{
                        select: {
                            value: form.data.reason,
                            onChange: (e) => {
                                processChange({
                                    field: "reason",
                                    value: e?.value,
                                    validate: true,
                                    blurred: true,
                                    touched: true,
                                });
                            },
                        },
                    }}
                    options={reasonOptions}
                    styleConfig={{
                        select: props.styleConfig.select,
                        singleValue: {
                            fontFamily: "arial",
                            fontSize: "16px",
                            color: "#0c445c",
                            fontWeight: "bold",
                        },
                        option: {
                            fontFamily: "arial",
                            fontSize: "16px",
                            color: "#0c445c",
                            fontWeight: "bold",
                        },
                    }}
                />
                <Error field="reason" />
                <Font styleConfig={{ root: props.styleConfig.body }}>
                    Vänligen förklara mer ingående vad lånet är avsett för *
                </Font>
                <TextField
                    inputConfig={{
                        name: "reasonDescription",
                        value: form.data.reasonDescription,
                        onChange: (e) => {
                            processChange({
                                field: "reasonDescription",
                                value: e.target.value,
                            });
                        },
                        onBlur: () => {
                            processBlur("reasonDescription");
                        },
                    }}
                    styleConfig={{ root: props.styleConfig.textField }}
                />
                <Error field="reasonDescription" />
                <Font styleConfig={{ root: props.styleConfig.bodyTitle }}>
                    Uppgifter om företaget
                </Font>
                <Font styleConfig={{ root: props.styleConfig.body }}>Företagets namn *</Font>
                <TextField
                    inputConfig={{
                        name: "companyName",
                        value: form.data.companyName,
                        onChange: (e) => {
                            processChange({
                                field: "companyName",
                                value: e.target.value,
                            });
                        },
                        onBlur: () => {
                            processBlur("companyName");
                        },
                    }}
                    styleConfig={{ root: props.styleConfig.textField }}
                />
                <Error field="companyName" />
                <Font styleConfig={{ root: props.styleConfig.body }}>Organisationsnummer *</Font>
                <TextField
                    inputConfig={{
                        name: "companyId",
                        placeholder: "Ange organisationsnummer i formatet 123456-1234",
                        value: form.data.companyId,
                        onChange: (e) => {
                            processChange({
                                field: "companyId",
                                value: e.target.value,
                            });
                        },
                        onBlur: () => {
                            processBlur("companyId");
                        },
                    }}
                    styleConfig={{ root: props.styleConfig.textField }}
                />
                <Error field="companyId" />
                <Font styleConfig={{ root: props.styleConfig.body }}>
                    Företagets månadsomsättning *
                </Font>
                <TextField
                    inputConfig={{
                        name: "turnover",
                        value: form.data.turnover,
                        onChange: (e) => {
                            const value = e.target.value;
                            // allow empty string, digits, dot and comma
                            if (/^\d*([.,]\d*)?$/.test(value)) {
                                processChange({
                                    field: "turnover",
                                    value: e.target.value,
                                });
                            }
                        },
                        onBlur: () => {
                            processBlur("turnover");
                        },
                    }}
                    styleConfig={{ root: props.styleConfig.textField }}
                />
                <Error field="turnover" />
                <TooltipLabel>
                    <Font styleConfig={{ root: props.styleConfig.body }}>
                        Kontonummer (kontonummer kan tillhandahållas i ett senare skede)
                    </Font>
                    <Tooltip
                        icon={<Icon icon={["far", "question-circle"]} />}
                        styleConfig={{
                            root: {
                                margin: "10px 0 0 0",
                            },
                        }}>
                        Använd vanligt kontonummer (inte PG/BG) och bindestreck mellan clearing och
                        kontonummer. Exempelvis: CCCC-012345678.
                        <br />
                        <br />
                        Om du har Sparbanken/Swedbank och ditt clearingnummer börjar på 8 ska du
                        ange 5-siffrig clearingnummer och totalt 15 siffror. Exempelvis:
                        CCCCC-0123456789.
                    </Tooltip>
                </TooltipLabel>
                <TextField
                    inputConfig={{
                        name: "iban",
                        value: form.data.iban,
                        onChange: (e) => {
                            processChange({
                                field: "iban",
                                value: e.target.value,
                            });
                        },
                        onBlur: () => {
                            processBlur("iban");
                        },
                    }}
                    styleConfig={{ root: props.styleConfig.textField }}
                />
                <Error field="iban" />
                <Font styleConfig={{ root: props.styleConfig.body }}>Adress</Font>
                <TextField
                    inputConfig={{
                        name: "companyAddressStreet",
                        value: form.data.companyAddressStreet,
                        onChange: (e) => {
                            processChange({
                                field: "companyAddressStreet",
                                value: e.target.value,
                            });
                        },
                        onBlur: () => {
                            processBlur("companyAddressStreet");
                        },
                    }}
                    styleConfig={{ root: props.styleConfig.textField }}
                />
                <Error field="companyAddressStreet" />
                <Font styleConfig={{ root: props.styleConfig.body }}>Postnummer</Font>
                <TextField
                    inputConfig={{
                        name: "companyAddressZip",
                        value: form.data.companyAddressZip,
                        onChange: (e) => {
                            processChange({
                                field: "companyAddressZip",
                                value: e.target.value,
                            });
                        },
                        onBlur: () => {
                            processBlur("companyAddressZip");
                        },
                    }}
                    styleConfig={{ root: props.styleConfig.textField }}
                />
                <Error field="companyAddressZip" />
                <Font styleConfig={{ root: props.styleConfig.body }}>Postort</Font>
                <TextField
                    inputConfig={{
                        name: "companyAddressCity",
                        value: form.data.companyAddressCity,
                        onChange: (e) => {
                            processChange({
                                field: "companyAddressCity",
                                value: e.target.value,
                            });
                        },
                        onBlur: () => {
                            processBlur("companyAddressCity");
                        },
                    }}
                    styleConfig={{ root: props.styleConfig.textField }}
                />
                <Error field="companyAddressCity" />
                <Font styleConfig={{ root: props.styleConfig.bodyTitle }}>
                    Uppgifter om sökanden
                </Font>
                <Font styleConfig={{ root: props.styleConfig.body }}>Personnummer *</Font>
                <TextField
                    inputConfig={{
                        name: "ssn",
                        value: form.data.ssn,
                        onChange: (e) => {
                            processChange({
                                field: "ssn",
                                value: e.target.value,
                            });
                        },
                        onBlur: () => {
                            processBlur("ssn");
                        },
                    }}
                    styleConfig={{ root: props.styleConfig.textField }}
                />
                <Error field="ssn" />
                <Font styleConfig={{ root: props.styleConfig.body }}>Förnamn *</Font>
                <TextField
                    inputConfig={{
                        name: "applicantGivenName",
                        value: form.data.applicantGivenName,
                        onChange: (e) => {
                            processChange({
                                field: "applicantGivenName",
                                value: e.target.value,
                            });
                        },
                        onBlur: () => {
                            processBlur("applicantGivenName");
                        },
                    }}
                    styleConfig={{ root: props.styleConfig.textField }}
                />
                <Error field="applicantGivenName" />
                <Font styleConfig={{ root: props.styleConfig.body }}>Efternamn *</Font>
                <TextField
                    inputConfig={{
                        name: "applicantSurname",
                        value: form.data.applicantSurname,
                        onChange: (e) => {
                            processChange({
                                field: "applicantSurname",
                                value: e.target.value,
                            });
                        },
                        onBlur: () => {
                            processBlur("applicantSurname");
                        },
                    }}
                    styleConfig={{ root: props.styleConfig.textField }}
                />
                <Error field="applicantSurname" />
                <Font styleConfig={{ root: props.styleConfig.body }}>Email *</Font>
                <TextField
                    inputConfig={{
                        name: "email",
                        placeholder: "Ange email i formatet adress@domain.com",
                        value: form.data.applicantEmail,
                        onChange: (e) => {
                            processChange({
                                field: "applicantEmail",
                                value: e.target.value,
                            });
                        },
                        onBlur: () => {
                            processBlur("applicantEmail");
                        },
                    }}
                    styleConfig={{ root: props.styleConfig.textField }}
                />
                <Error field="applicantEmail" />
                <Font styleConfig={{ root: props.styleConfig.body }}>Telefonnummer *</Font>
                <TextField
                    inputConfig={{
                        name: "phone",
                        placeholder: "Ange telefonnumret i formatet +46 12 345 67 89",
                        value: form.data.applicantPhone,
                        onChange: (e) => {
                            processChange({
                                field: "applicantPhone",
                                value: e.target.value,
                            });
                        },
                        onBlur: () => {
                            processBlur("applicantPhone");
                        },
                    }}
                    styleConfig={{ root: props.styleConfig.textField }}
                />
                <Error field="applicantPhone" />
                <Font styleConfig={{ root: props.styleConfig.body }}>Kampanjkod</Font>
                <TextField
                    inputConfig={{
                        name: "campaignCode",
                        placeholder: "Kampanjkod",
                        value: form.data.campaignCode,
                        onChange: (e) => {
                            processChange({
                                field: "campaignCode",
                                value: e.target.value,
                            });
                        },
                        onBlur: () => {
                            processBlur("campaignCode");
                        },
                    }}
                    styleConfig={{ root: props.styleConfig.textField }}
                />
                <Error field="campaignCode" />
                <Font styleConfig={{ root: props.styleConfig.body }}>
                    Är du en PEP (Person i politiskt utsatt ställning) och/eller har en
                    familjemedlem som klassas som PEP? *
                </Font>
                <SelectField
                    name="isPep"
                    icon={null}
                    value={getOption(pepOptions, form.data.isPep)}
                    inputConfig={{
                        select: {
                            value: form.data.isPep,
                            onChange: (e) => {
                                processChange({
                                    field: "isPep",
                                    value: e?.value,
                                    validate: true,
                                    blurred: true,
                                    touched: true,
                                });
                            },
                        },
                    }}
                    options={pepOptions}
                    styleConfig={{
                        select: props.styleConfig.select,
                        singleValue: {
                            fontFamily: "arial",
                            fontSize: "16px",
                            color: "#0c445c",
                            fontWeight: "bold",
                        },
                        option: {
                            fontFamily: "arial",
                            fontSize: "16px",
                            color: "#0c445c",
                            fontWeight: "bold",
                        },
                    }}
                />
                <Error field="isPep" />
                <Checkboxes>
                    <div>
                        <CheckboxContainer>
                            <CheckboxField
                                checked={form.data.creditCheck}
                                checkedIcon={<Icon icon={["fa", "check"]} />}
                                onClick={async () => {
                                    processChange({
                                        field: "creditCheck",
                                        value: !form.data.creditCheck,
                                        validate: true,
                                        blurred: true,
                                        touched: true,
                                    });
                                }}
                                styleConfig={{
                                    root: props.styleConfig.checkbox,
                                    checked: {},
                                }}
                            />
                            <Font styleConfig={{ root: props.styleConfig.checkboxText }}>
                                Jag förstår att OPR-Finance AB sparar och behandlar mina
                                personuppgifter för att utföra en korrekt kreditbedömning och för
                                att efterleva gällande lagar och förordningar. För mer information,
                                se OPR-Företagslåns{" "}
                                <Link
                                    styleConfig={{ root: props.styleConfig.contractLink }}
                                    target="_blank"
                                    href={`${process.env.REACT_APP_MARKETING_PAGE_URL}/integritetspolicy/`}>
                                    integritetspolicy
                                </Link>
                                . *
                            </Font>
                        </CheckboxContainer>
                    </div>
                    <div>
                        <Error field="creditCheck" />
                    </div>
                </Checkboxes>
                <ButtonField
                    type="submit"
                    styleConfig={{
                        root: props.styleConfig.button,
                    }}
                    onClick={async (e) => {
                        e.preventDefault();
                        processSubmit();
                    }}>
                    <Font styleConfig={{ root: props.styleConfig.buttonText }}>Skicka ansökan</Font>
                </ButtonField>
            </Form>
        </div>
    );
}

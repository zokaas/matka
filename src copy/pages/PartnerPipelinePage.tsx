import { useState, useEffect } from "react";
import { Font } from "@opr-finance/component-fonts";
import {
    TextField,
    SelectField,
    CheckboxField,
    ButtonField,
    useForm,
    getOption,
    option,
    SelectOption,
} from "@opr-finance/component-forms";
import styled from "styled-components";
import * as yup from "yup";
import {
    FontStyleProps,
    InputStyleProps,
    onPageLoad,
    pickOff,
    sendGAConversion,
} from "@opr-finance/utils";
import { useHistory } from "react-router-dom";
import { sendBrokerApplication } from "../api/flex";
import { Icon } from "@opr-finance/component-icon";
import { Loader } from "@opr-finance/component-loader";
import { isValidFinnishCompanyId, isValidPhoneNumberFi } from "@opr-finance/validators";
import { currency, CurrencyFormat, CurrencyLocale } from "@opr-finance/component-currency";
import { T_BrokerApplication } from "../types/partner";
import {
    handleSubmit,
    mapBrokerApplication,
    onPageFullyLoaded,
    sendAnalyticsEvents,
} from "../utils";
import { BrokerName } from "../api/brokerConfig";

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

export type PipelinePageProps = {
    brokerName: BrokerName;
    styleConfig: {
        body: FontStyleProps;
        bodyTitle: FontStyleProps;
        pageTitle: FontStyleProps;
        textField: InputStyleProps;
        select: InputStyleProps;
        checkbox: InputStyleProps;
        checkboxText: FontStyleProps;
        button: InputStyleProps;
        buttonText: FontStyleProps;
        formError: FontStyleProps;
    };
};

export function PartnerPipelinePage(props: PipelinePageProps) {
    const history = useHistory();

    const amountOptions = [
        option("Valitse"),
        option(
            currency({
                value: 2000,
                locale: CurrencyLocale.Finland,
                currency: CurrencyFormat.Finland,
            })
        ),
        option(
            currency({
                value: 5000,
                locale: CurrencyLocale.Finland,
                currency: CurrencyFormat.Finland,
            })
        ),
        option(
            currency({
                value: 8000,
                locale: CurrencyLocale.Finland,
                currency: CurrencyFormat.Finland,
            })
        ),
        option(
            currency({
                value: 10000,
                locale: CurrencyLocale.Finland,
                currency: CurrencyFormat.Finland,
            })
        ),
        option(
            currency({
                value: 15000,
                locale: CurrencyLocale.Finland,
                currency: CurrencyFormat.Finland,
            })
        ),
        option(
            currency({
                value: 20000,
                locale: CurrencyLocale.Finland,
                currency: CurrencyFormat.Finland,
            })
        ),
    ];

    const validAmounts: string[] = pickOff(
        amountOptions,
        (option: SelectOption) => option.value === "Valitse"
    ).map((option: SelectOption) => {
        return option.value;
    });

    const handlePartnerApplicationSubmit = async (data: T_BrokerApplication) => {
        await handleSubmit(data, {
            mapper: mapBrokerApplication,
            sender: sendBrokerApplication(props.brokerName),
            analytics: sendAnalyticsEvents,
            conversion: sendGAConversion,
            setIsLoading,
            onCompleted: (result) =>
                history.push("/completed", {
                    status: result.status,
                    type: result.type,
                    partner: true,
                }),
        });
    };

    const schema = yup.object().shape({
        amount: yup.string().oneOf(validAmounts, "pakollinen kenttä").required("pakollinen kenttä"),
        companyName: yup
            .string()
            .min(3, "pienin sallittu pituus on 3 merkkiä")
            .required("pakollinen kenttä"),
        companyId: yup
            .string()
            .required("pakollinen kenttä")
            .test("isValidCompanyId", "virheellinen Y-tunnus", isValidFinnishCompanyId),
        turnover: yup.string().required("pakollinen kenttä"),
        applicantSurname: yup.string().required("pakollinen kenttä"),
        applicantGivenName: yup.string().required("pakollinen kenttä"),
        applicantEmail: yup.string().email("virheellinen sähköposti").required("pakollinen kenttä"),
        applicantPhone: yup
            .string()
            .test("isValidPhone", "virheellinen puhelinnumero", isValidPhoneNumberFi)
            .required("pakollinen kenttä"),
        allowMarketing: yup.boolean().notRequired(),
        consentGiven: yup
            .boolean()
            .oneOf([true], "pakollinen kenttä")
            .required("pakollinen kenttä"),
        campaignCode: yup.string().notRequired(),
    });

    const { form, processChange, processBlur, processSubmit, Error } = useForm<T_BrokerApplication>(
        {
            initial: {
                amount: "Valitse",
                companyName: "",
                companyId: "",
                turnover: "",
                applicantGivenName: "",
                applicantSurname: "",
                applicantEmail: "",
                applicantPhone: "",
                allowMarketing: false,
                consentGiven: false,
                campaignCode: "",
                clientApplicationId: (window as any).clientApplicationId,
                externalReference: (window as any).clientApplicationId,
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
            onChange: () => {},
            onError: () => {},
            onSubmit: async (data: T_BrokerApplication) => handlePartnerApplicationSubmit(data),
        }
    );

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const cleanup = onPageLoad(() => onPageFullyLoaded());
        return cleanup;
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
                    Hae Yritysluotto Flex joustoluottoa
                </Font>
                <Font styleConfig={{ root: props.styleConfig.body }}>
                    Aloita joustoluoton hakeminen täyttämällä hakulomake. Valitse haluamasi
                    luottolimiitin summa ja täytä tiedot yrityksestäsi sekä yhteystietosi.
                    Huomioithan, että käytät hakemuksen sähköpostiosoitteena osoitetta, josta
                    jatkossakin hoidat luottolimiittiäsi. Esimerkiksi nostopyynnöt tulee tehdä
                    sähköpostiosoittesta, joka on lisätty hakemukselle.
                </Font>
                <Font styleConfig={{ root: props.styleConfig.body }}>
                    Lähetämme lainapäätöksen sekä lainasopimuksen ilmoittamaasi sähköpostiin. Voit
                    allekirjoittaa lainasopimuksen sähköisesti, jonka jälkeen Yritysluotto Flex
                    joustoluotto on käytettävissäsi ja voit nostaa haluamasi summan yrityksesi
                    tilille luottorajasi puitteissa.
                </Font>
                <Font styleConfig={{ root: props.styleConfig.body }}>
                    Tähdellä (*) merkityt tiedot ovat pakollisia.
                </Font>
                <Font styleConfig={{ root: props.styleConfig.bodyTitle }}>Joustoluoton tiedot</Font>
                <Font styleConfig={{ root: props.styleConfig.body }}>Luottolimiitin summa *</Font>
                <SelectField
                    name="amount"
                    icon={null}
                    value={getOption(amountOptions, form.data.amount)}
                    inputConfig={{
                        select: {
                            value: form.data.amount,
                            onChange: async (e) => {
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
                <Error field="amount" />
                <Font styleConfig={{ root: props.styleConfig.bodyTitle }}>Yrityksen tiedot</Font>
                <Font styleConfig={{ root: props.styleConfig.body }}>Yrityksen nimi *</Font>
                <TextField
                    inputConfig={{
                        name: "companyName",
                        value: form.data.companyName,
                        onChange: async (e) => {
                            processChange({
                                field: "companyName",
                                value: e.target.value,
                            });
                        },
                        onBlur: async () => {
                            processBlur("companyName");
                        },
                    }}
                    styleConfig={{ root: props.styleConfig.textField }}
                />
                <Error field="companyName" />
                <Font styleConfig={{ root: props.styleConfig.body }}>Y-tunnus *</Font>
                <TextField
                    inputConfig={{
                        name: "companyId",
                        value: form.data.companyId,
                        onChange: async (e) => {
                            processChange({
                                field: "companyId",
                                value: e.target.value,
                            });
                        },
                        onBlur: async () => {
                            processBlur("companyId");
                        },
                    }}
                    styleConfig={{ root: props.styleConfig.textField }}
                />
                <Error field="companyId" />
                <Font styleConfig={{ root: props.styleConfig.body }}>
                    Yrityksen kuukausittainen liikevaihto *
                </Font>
                <TextField
                    inputConfig={{
                        name: "turnover",
                        value: form.data.turnover,
                        onChange: async (e) => {
                            processChange({
                                field: "turnover",
                                value: e.target.value,
                            });
                        },
                        onBlur: async () => {
                            processBlur("turnover");
                        },
                    }}
                    styleConfig={{ root: props.styleConfig.textField }}
                />
                <Error field="turnover" />
                <Font styleConfig={{ root: props.styleConfig.body }}>Sähköposti *</Font>
                <TextField
                    inputConfig={{
                        name: "email",
                        placeholder: "Kirjoita sähköposti muodossa osoite@domain.com",
                        value: form.data.applicantEmail,
                        onChange: async (e) => {
                            processChange({
                                field: "applicantEmail",
                                value: e.target.value,
                            });
                        },
                        onBlur: async () => {
                            processBlur("applicantEmail");
                        },
                    }}
                    styleConfig={{ root: props.styleConfig.textField }}
                />
                <Error field="applicantEmail" />
                <Font styleConfig={{ root: props.styleConfig.bodyTitle }}>Hakijan tiedot</Font>
                <Font styleConfig={{ root: props.styleConfig.body }}>Hakijan etunimi *</Font>
                <TextField
                    inputConfig={{
                        name: "applicantGivenName",
                        value: form.data.applicantGivenName,
                        onChange: async (e) => {
                            processChange({
                                field: "applicantGivenName",
                                value: e.target.value,
                            });
                        },
                        onBlur: async () => {
                            processBlur("applicantGivenName");
                        },
                    }}
                    styleConfig={{ root: props.styleConfig.textField }}
                />
                <Error field="applicantGivenName" />
                <Font styleConfig={{ root: props.styleConfig.body }}>Hakijan sukunimi *</Font>
                <TextField
                    inputConfig={{
                        name: "applicantSurname",
                        value: form.data.applicantSurname,
                        onChange: async (e) => {
                            processChange({
                                field: "applicantSurname",
                                value: e.target.value,
                            });
                        },
                        onBlur: async () => {
                            processBlur("applicantSurname");
                        },
                    }}
                    styleConfig={{ root: props.styleConfig.textField }}
                />
                <Error field="applicantSurname" />
                <Font styleConfig={{ root: props.styleConfig.body }}>Puhelinnumero *</Font>
                <TextField
                    inputConfig={{
                        name: "phone",
                        placeholder: "Kirjoita puhelinnumero muodossa +358 50 123 456",
                        value: form.data.applicantPhone,
                        onChange: async (e) => {
                            processChange({
                                field: "applicantPhone",
                                value: e.target.value,
                            });
                        },
                        onBlur: async () => {
                            processBlur("applicantPhone");
                        },
                    }}
                    styleConfig={{ root: props.styleConfig.textField }}
                />
                <Error field="applicantPhone" />
                <Font styleConfig={{ root: props.styleConfig.body }}>Kampanjakoodi</Font>
                <TextField
                    inputConfig={{
                        name: "campaignCode",
                        placeholder: "Kampanjakoodi",
                        value: form.data.campaignCode,
                        onChange: async (e) => {
                            processChange({
                                field: "campaignCode",
                                value: e.target.value,
                            });
                        },
                        onBlur: async () => {
                            processBlur("campaignCode");
                        },
                    }}
                    styleConfig={{ root: props.styleConfig.textField }}
                />
                <Error field="campaignCode" />
                <Checkboxes>
                    <CheckboxContainer>
                        <CheckboxField
                            checked={form.data.allowMarketing}
                            checkedIcon={<Icon icon={["fa", "check"]} size="1x" />}
                            onClick={async () => {
                                processChange({
                                    field: "allowMarketing",
                                    value: !form.data.allowMarketing,
                                    touched: true,
                                    blurred: true,
                                    validate: true,
                                });
                            }}
                            styleConfig={{
                                root: props.styleConfig.checkbox,
                                checked: {},
                            }}
                        />
                        <Font styleConfig={{ root: props.styleConfig.checkboxText }}>
                            Yritysluotto Flex saa lähettää minulle ajankohtaista tietoa ja
                            tarjouksia
                        </Font>
                        <Error field="allowMarketing" />
                    </CheckboxContainer>
                    <CheckboxContainer>
                        <CheckboxField
                            checked={form.data.consentGiven}
                            checkedIcon={<Icon icon={["fa", "check"]} size="1x" />}
                            onClick={async () => {
                                processChange({
                                    field: "consentGiven",
                                    value: !form.data.consentGiven,
                                    touched: true,
                                    blurred: true,
                                    validate: true,
                                });
                            }}
                            styleConfig={{
                                root: props.styleConfig.checkbox,
                                checked: {},
                            }}
                        />
                        <Font styleConfig={{ root: props.styleConfig.checkboxText }}>
                            Ymmärrän, että Yritysluotto tallentaa ja käsittelee henkilötietojani.{" "}
                            <a
                                href="https://flex.yritysluotto.fi/yritysluotto-flex/rekisteriseloste/"
                                target="_blank"
                                rel="noreferrer">
                                Lue lisää rekisteriselosteesta.
                            </a>
                            *
                        </Font>
                        <Error field="consentGiven" />
                    </CheckboxContainer>
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
                    <Font styleConfig={{ root: props.styleConfig.buttonText }}>Lähetä hakemus</Font>
                </ButtonField>
            </Form>
        </div>
    );
}

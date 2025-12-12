import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
    Button,
    Checkbox,
    Container,
    Font,
    Input,
    Link,
    Select,
} from "@opr-finance/styled-components";
import { pageStyles, componentStyles } from "@opr-finance/themes/sweden-foretagslan-application";
import { ConsoleLogger, LOG_LEVEL } from "@opr-finance/features/console-logger";

import { useForm } from "../../hooks/useForm";
import { useValidation } from "../../hooks/useValidation";
import { T_EventType, E_Routes } from "../../types";
import { schemas, T_FormSchema } from "../../validation";
import { amountOptions, paymentTimeOptions } from "../../components/BasicInfoBlock/options";
import { buttonStyles } from "@opr-finance/themes/sweden-foretagslan-application/componentsStyles";
import { T_PrePageFields } from "./prePage.types";
import { saveBasicInfo } from "../../api/saveBasicInfo";

export const PrePage = () => {
    const logger = new ConsoleLogger({ level: LOG_LEVEL });
    const { fields, setFields, errs, setErrs } = useForm();
    const { validBlocks } = useValidation(errs, fields);

    const navigate = useNavigate();
    const { inputStyles, tooltipStyles } = componentStyles;
    const { prePageStyles } = pageStyles;

    const handleSubmit = async () => {
        const basicData: T_PrePageFields = {
            loanAmount: fields.loanAmount.replace(/\s/g, ""),
            repaymentPeriod: fields.repaymentPeriod,
            organizationNumber: fields.organizationNumber,
            emailAddress: fields.emailAddress,
            applicantPhone: fields.applicantPhone,
            businessCheck: fields.businessCheck,
        };
        logger.log("basic data", basicData);
        const uuid = await saveBasicInfo(basicData);
        navigate(`${E_Routes.START}/${uuid}`);
    };

    const handleFieldChange = (e: T_EventType) => {
        const name = e.name;
        const value = e.value;
        if (name === "attachments") {
            setFields({ ...fields, [e.name]: e.value });
        }
        setFields({ ...fields, [name]: value });
    };

    const getErrorMsg = (name: string) => {
        return errs[name];
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
    };

    useEffect(() => {
        localStorage.removeItem("applicationUuid");
        localStorage.removeItem("id");
        localStorage.removeItem("company-info");
    }, []);

    return (
        <Container styles={prePageStyles.pageRootStyles}>
            <Container styles={prePageStyles.fieldsContainer}>
                <Container styles={prePageStyles.doubleColumnContainer}>
                    <Select
                        styles={{
                            containerStyles: inputStyles.containerStyles,
                            labelStyles: inputStyles.labelStyles,
                            inputStyles: inputStyles.selectStyles,
                            errorMessageStyles: inputStyles.errorMessageStyles,
                        }}
                        isMulti={false}
                        label="Lånebelopp *"
                        errorMessage={getErrorMsg("loanAmount") || ""}
                        onChange={(newValue: any) => {
                            handleFieldChange({
                                name: "loanAmount",
                                value: newValue.value,
                            });
                        }}
                        onBlur={() => handleBlur({ name: "loanAmount", value: fields.loanAmount })}
                        name="loanAmount"
                        options={amountOptions}
                        value={
                            fields.loanAmount
                                ? { value: fields.loanAmount, label: fields.loanAmount }
                                : null
                        }
                    />
                    <Select
                        styles={{
                            containerStyles: inputStyles.containerStyles,
                            labelStyles: inputStyles.labelStyles,
                            inputStyles: inputStyles.selectStyles,
                            errorMessageStyles: inputStyles.errorMessageStyles,
                        }}
                        errorMessage={getErrorMsg("repaymentPeriod") || ""}
                        isMulti={false}
                        label="Återbetalningstid *"
                        onChange={(newValue: any) => {
                            handleFieldChange({
                                name: "repaymentPeriod",
                                value: newValue.value,
                            });
                        }}
                        onBlur={() =>
                            handleBlur({ name: "repaymentPeriod", value: fields.repaymentPeriod })
                        }
                        name="repaymentPeriod"
                        options={paymentTimeOptions(fields.loanAmount)}
                        value={
                            fields.repaymentPeriod
                                ? {
                                      value: fields.repaymentPeriod,
                                      label: fields.repaymentPeriod,
                                  }
                                : null
                        }
                    />
                </Container>
                <Container styles={prePageStyles.doubleColumnContainer}>
                    <Input
                        styles={{
                            containerStyles: inputStyles.containerStyles,
                            labelStyles: inputStyles.labelStyles,
                            inputStyles: inputStyles.inputStyles,
                            errorMessageStyles: inputStyles.errorMessageStyles,
                        }}
                        label="Organisationsnummer *"
                        errorMessage={getErrorMsg("organizationNumber") || ""}
                        placeholder="Organisationsnummer"
                        onChange={(e) =>
                            handleFieldChange({
                                name: e.currentTarget.name,
                                value: e.currentTarget.value,
                            })
                        }
                        onBlur={() =>
                            handleBlur({
                                name: "organizationNumber",
                                value: fields.organizationNumber,
                            })
                        }
                        type={"input"}
                        name={"organizationNumber"}
                        value={fields.organizationNumber ?? ""}
                    />
                    <Input
                        styles={{
                            containerStyles: inputStyles.containerStyles,
                            labelStyles: inputStyles.labelStyles,
                            inputStyles: inputStyles.inputStyles,
                            errorMessageStyles: inputStyles.errorMessageStyles,
                        }}
                        label="Telefonnummer *"
                        errorMessage={getErrorMsg("applicantPhone") || ""}
                        placeholder="Your Phone Number"
                        onChange={(e) =>
                            handleFieldChange({
                                name: e.currentTarget.name,
                                value: e.currentTarget.value,
                            })
                        }
                        onBlur={() =>
                            handleBlur({ name: "applicantPhone", value: fields.applicantPhone })
                        }
                        type={"input"}
                        name={"applicantPhone"}
                        value={fields.applicantPhone ?? ""}
                    />
                </Container>
                <Input
                    styles={{
                        containerStyles: inputStyles.containerStyles,
                        labelStyles: inputStyles.labelStyles,
                        inputStyles: inputStyles.inputStyles,
                        errorMessageStyles: inputStyles.errorMessageStyles,
                    }}
                    label="Mailadress *"
                    errorMessage={getErrorMsg("emailAddress") || ""}
                    placeholder="E.g. example@mail.com"
                    onChange={(e) =>
                        handleFieldChange({
                            name: e.currentTarget.name,
                            value: e.currentTarget.value,
                        })
                    }
                    onBlur={() => handleBlur({ name: "emailAddress", value: fields.emailAddress })}
                    type={"input"}
                    name={"emailAddress"}
                    value={fields.emailAddress ?? ""}
                />

                <Checkbox
                    styles={{
                        containerStyles: inputStyles.checkboxContainerStyles,
                        checkboxErrorMsgWrapperStyles: inputStyles.checkboxErrorMsgWrapperStyles,
                        labelStyles: inputStyles.checkboxLabelStyles,
                        checkboxStyles: inputStyles.checkboxStyles,
                        errorMessageStyles: inputStyles.errorMessageStyles,
                        iconStyles: inputStyles.iconStyles,
                        tooltipStyles: tooltipStyles,
                    }}
                    label={
                        <>
                            Jag förstår att OPR-Finance AB sparar och behandlar mina personuppgifter
                            för att utföra en korrekt kreditbedömning och för att efterleva gällande
                            lagar och förordningar. För mer information, se OPR-Företagslåns
                            <Link href="#" target="_blank" styles={{ marginLeft: "7px" }}>
                                datasekretessförfarande.
                            </Link>{" "}
                            *
                        </>
                    }
                    errorMessage={getErrorMsg("businessCheck") || ""}
                    onClick={(e: any) => {
                        handleFieldChange({
                            name: "businessCheck",
                            value: !fields.businessCheck,
                        });
                        handleBlur({ name: "businessCheck", value: !fields.businessCheck });
                    }}
                    type="checkbox"
                    name="businessCheck"
                    value={fields.businessCheck}
                    checkboxIcon={["fas", "check"]}
                    checkboxSize={"1x"}
                    checked={fields.businessCheck}
                />

                <Container styles={prePageStyles.loginContainer}>
                    <Font styles={prePageStyles.loginText}>
                        Verifirera med Bank-ID för att slutföra ansökan{" "}
                    </Font>
                    <Button
                        onClick={() => handleSubmit()}
                        disabled={validBlocks.includes("pre-info")}
                        styles={buttonStyles.buttonStyles({ width: "200px" })}>
                        Logga in
                    </Button>
                </Container>
            </Container>
        </Container>
    );
};

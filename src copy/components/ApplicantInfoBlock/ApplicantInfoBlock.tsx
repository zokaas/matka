import React from "react";

import { Container, Font, Input, Select } from "@opr-finance/styled-components";
import { componentStyles, pageStyles } from "@opr-finance/themes/sweden-foretagslan-application";

import { T_ApplicantInfoBlockProps } from "./applicantInfoBlock.types";
import { isKYCServiceEnabled } from "../../utils";

export const ApplicantInfoBlock = (props: T_ApplicantInfoBlockProps) => {
    const { inputStyles, tooltipStyles } = componentStyles;
    const { fields, handleFieldChange, handleBlur, handleFocus, getErrorMessage } = props;

    const handleOnFocus = () => {
        handleFocus("applicantInfo");
    };

    return (
        <Container id={props.formId} styles={pageStyles.applicationPageStyles.formBlock}>
            <Font styles={pageStyles.applicationPageStyles.blockHeading}>Sökandeuppgifter</Font>
            <Font styles={pageStyles.applicationPageStyles.dataRowLabel}>Namn</Font>
            <Font styles={pageStyles.applicationPageStyles.dataRow}>{fields.applicantName}</Font>
            <Font styles={pageStyles.applicationPageStyles.dataRowLabel}>Personnummer</Font>
            <Font styles={pageStyles.applicationPageStyles.dataRow}>{fields.ssn}</Font>

            <Input
                styles={{
                    containerStyles: inputStyles.containerStyles,
                    labelStyles: inputStyles.labelStyles,
                    inputStyles: inputStyles.inputStyles,
                    errorMessageStyles: inputStyles.errorMessageStyles,
                }}
                label="Mailadress *"
                placeholder="E.g. yesmail@nomail.com"
                errorMessage={getErrorMessage("emailAddress") ?? ""}
                onChange={(e: any) => {
                    handleFieldChange({
                        name: e.currentTarget.name,
                        value: e.currentTarget.value,
                    });
                }}
                onBlur={() => handleBlur({ name: "emailAddress", value: fields.emailAddress })}
                onFocus={() => handleOnFocus()}
                type={"input"}
                name={"emailAddress"}
                value={fields.emailAddress}
            />
            <Input
                styles={{
                    containerStyles: inputStyles.containerStyles,
                    labelStyles: inputStyles.labelStyles,
                    inputStyles: inputStyles.inputStyles,
                    errorMessageStyles: inputStyles.errorMessageStyles,
                }}
                label="Telefonnummer *"
                placeholder="Your Phone Number"
                errorMessage={getErrorMessage("applicantPhone") ?? ""}
                onChange={(e: any) => {
                    handleFieldChange({
                        name: e.currentTarget.name,
                        value: e.currentTarget.value,
                    });
                }}
                onBlur={() => handleBlur({ name: "applicantPhone", value: fields.applicantPhone })}
                onFocus={() => handleOnFocus()}
                type={"input"}
                name={"applicantPhone"}
                value={fields.applicantPhone}
            />
            {!isKYCServiceEnabled() && (
                <Select
                    styles={{
                        containerStyles: inputStyles.containerStyles,
                        labelStyles: inputStyles.labelStyles,
                        inputStyles: inputStyles.selectStyles,
                        errorMessageStyles: inputStyles.errorMessageStyles,
                        tooltipStyles: tooltipStyles,
                    }}
                    isMulti={false}
                    label="Är du en PEP (Person i politiskt utsatt ställning) och/eller har en familjemedlem som klassas som PEP? *"
                    errorMessage={getErrorMessage("PEP") ?? ""}
                    onChange={(newValue: any) => {
                        handleFieldChange({
                            name: "PEP",
                            value: newValue.value,
                        });
                    }}
                    onBlur={() => handleBlur({ name: "PEP", value: fields.PEP })}
                    onFocus={() => handleOnFocus()}
                    name="PEP"
                    options={[
                        { value: "Ja", label: "Ja" },
                        { value: "Nej", label: "Nej" },
                    ]}
                    value={fields.PEP ? { value: fields.PEP, label: fields.PEP } : null}
                    tooltipDelay={3000}
                    tooltipMessage="En person i politiskt utsatt ställning är en person som har eller
                har haft viktiga offentliga funktioner i en stat eller i en internationell organisation."
                    placeholder="Välj"
                />
            )}
        </Container>
    );
};

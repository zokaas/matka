import React from "react";
import { Container, Font, Input } from "@opr-finance/styled-components";
import { componentStyles } from "@opr-finance/themes/sweden-foretagslan-application";

import { T_CompanyInfoBlockProps } from "./companyInfoBlock.types";
import { applicationPageStyles } from "@opr-finance/themes/sweden-foretagslan-application/pageStyles";

export const CompanyInfoBlock = (props: T_CompanyInfoBlockProps) => {
    const { inputStyles, tooltipStyles } = componentStyles;
    const { fields, handleFieldChange, handleBlur, handleFocus, getErrorMessage } = props;

    const handleOnFocus = () => {
        handleFocus("companyInfo");
    };

    return (
        <Container id={props.formId} styles={applicationPageStyles.formBlock}>
            <Font styles={applicationPageStyles.blockHeading}>Företagsuppgifter</Font>
            <Font styles={applicationPageStyles.dataRowLabel}>Organisationsnummer</Font>
            <Font styles={applicationPageStyles.dataRow}>{fields.organizationNumber}</Font>
            <Font styles={applicationPageStyles.dataRowLabel}>Företagsnamn</Font>
            <Font styles={applicationPageStyles.dataRow}>{fields.companyName}</Font>
            <Input
                styles={{
                    containerStyles: inputStyles.containerStyles,
                    labelStyles: inputStyles.labelStyles,
                    inputStyles: inputStyles.inputStyles,
                    errorMessageStyles: inputStyles.errorMessageStyles,
                }}
                label="Adress *"
                errorMessage={getErrorMessage("streetAddress") ?? ""}
                placeholder="Adress"
                onChange={(e) =>
                    handleFieldChange({
                        name: e.currentTarget.name,
                        value: e.currentTarget.value,
                    })
                }
                onBlur={() => handleBlur({ name: "streetAddress", value: fields.streetAddress })}
                onFocus={() => handleOnFocus()}
                type={"input"}
                name={"streetAddress"}
                value={fields.streetAddress}
            />
            <Input
                styles={{
                    containerStyles: inputStyles.containerStyles,
                    labelStyles: inputStyles.labelStyles,
                    inputStyles: inputStyles.inputStyles,
                    errorMessageStyles: inputStyles.errorMessageStyles,
                }}
                label="Postnummer *"
                errorMessage={getErrorMessage("zipCode") ?? ""}
                placeholder="Postnummer"
                onChange={(e) =>
                    handleFieldChange({
                        name: e.currentTarget.name,
                        value: e.currentTarget.value,
                    })
                }
                onBlur={() => handleBlur({ name: "zipCode", value: fields.zipCode })}
                onFocus={() => handleOnFocus()}
                type={"input"}
                name={"zipCode"}
                value={fields.zipCode}
            />
            <Input
                styles={{
                    containerStyles: inputStyles.containerStyles,
                    labelStyles: inputStyles.labelStyles,
                    inputStyles: inputStyles.inputStyles,
                    errorMessageStyles: inputStyles.errorMessageStyles,
                }}
                label="Ort *"
                errorMessage={getErrorMessage("city") ?? ""}
                placeholder="Ort"
                onChange={(e) =>
                    handleFieldChange({
                        name: e.currentTarget.name,
                        value: e.currentTarget.value,
                    })
                }
                onBlur={() => handleBlur({ name: "city", value: fields.city })}
                onFocus={() => handleOnFocus()}
                type={"input"}
                name={"city"}
                value={fields.city}
            />

            <Input
                styles={{
                    containerStyles: inputStyles.containerStyles,
                    labelStyles: inputStyles.labelStyles,
                    inputStyles: inputStyles.inputStyles,
                    errorMessageStyles: inputStyles.errorMessageStyles,
                    tooltipStyles: tooltipStyles,
                }}
                label="Bankgiro/Kontonummer *"
                errorMessage={getErrorMessage("disburismentAccount") ?? ""}
                placeholder="Kontonummer"
                onChange={(e) =>
                    handleFieldChange({
                        name: e.currentTarget.name,
                        value: e.currentTarget.value,
                    })
                }
                onBlur={() =>
                    handleBlur({ name: "disburismentAccount", value: fields.disburismentAccount })
                }
                onFocus={() => handleOnFocus()}
                type={"input"}
                name={"disburismentAccount"}
                value={fields.disburismentAccount}
                tooltipMessage="Skriv in det kontonummer du önskar få lånet utbetalt till."
                tooltipDelay={2000}
            />
        </Container>
    );
};

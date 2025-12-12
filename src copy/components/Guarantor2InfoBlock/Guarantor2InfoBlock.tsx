import React from "react";
import { Container, Font, Input } from "@opr-finance/styled-components";
import { componentStyles } from "@opr-finance/themes/sweden-foretagslan-application";

import { T_Guarantor2InfoBlockProps } from "./guarantor2Info.types";
import { applicationPageStyles } from "@opr-finance/themes/sweden-foretagslan-application/pageStyles";

export const Guarantor2InfoBlock = (props: T_Guarantor2InfoBlockProps) => {
    const { inputStyles } = componentStyles;
    const { fields, handleFieldChange, handleBlur, handleFocus, getErrorMessage } = props;

    const handleOnFocus = () => {
        handleFocus("secondGuarantorInfo");
    };

    return (
        <Container id={props.formId} styles={applicationPageStyles.formBlock}>
            <Font styles={applicationPageStyles.blockHeading}>
                Uppgifter till ytterligare en borgensman
            </Font>
            <Font styles={applicationPageStyles.infoBox}>
                Om vi ska kunna bevilja lånebeloppet som du har ansökt om behöver vi en till
                borgensman. Vi kommer att kontakta den angivna borgensmannen med informationen du
                lämnar nedan. Avtalet för borgensmannen kommer att skickas för digital signering.
            </Font>
            <Input
                styles={{
                    containerStyles: inputStyles.containerStyles,
                    labelStyles: inputStyles.labelStyles,
                    inputStyles: inputStyles.inputStyles,
                    errorMessageStyles: inputStyles.errorMessageStyles,
                }}
                label="Namn *"
                placeholder="Namn"
                errorMessage={getErrorMessage("secondGuarantorName") ?? ""}
                onChange={(e: any) => {
                    handleFieldChange({
                        name: e.currentTarget.name,
                        value: e.currentTarget.value,
                    });
                }}
                onBlur={() =>
                    handleBlur({ name: "secondGuarantorName", value: fields.secondGuarantorName })
                }
                onFocus={() => handleOnFocus()}
                type={"input"}
                name={"secondGuarantorName"}
                value={fields.secondGuarantorName}
            />
            <Input
                styles={{
                    containerStyles: inputStyles.containerStyles,
                    labelStyles: inputStyles.labelStyles,
                    inputStyles: inputStyles.inputStyles,
                    errorMessageStyles: inputStyles.errorMessageStyles,
                }}
                label="Mailadress *"
                placeholder="Mailadress"
                errorMessage={getErrorMessage("secondGuarantorEmail") ?? ""}
                onChange={(e: any) => {
                    handleFieldChange({
                        name: e.currentTarget.name,
                        value: e.currentTarget.value,
                    });
                }}
                onBlur={() =>
                    handleBlur({ name: "secondGuarantorEmail", value: fields.secondGuarantorEmail })
                }
                onFocus={() => handleOnFocus()}
                type={"input"}
                name={"secondGuarantorEmail"}
                value={fields.secondGuarantorEmail}
            />
            <Input
                styles={{
                    containerStyles: inputStyles.containerStyles,
                    labelStyles: inputStyles.labelStyles,
                    inputStyles: inputStyles.inputStyles,
                    errorMessageStyles: inputStyles.errorMessageStyles,
                }}
                label="Telefonnummer *"
                placeholder="Telefonnummer"
                errorMessage={getErrorMessage("secondGuarantorPhone") ?? ""}
                onChange={(e: any) => {
                    handleFieldChange({
                        name: e.currentTarget.name,
                        value: e.currentTarget.value,
                    });
                }}
                onBlur={() =>
                    handleBlur({ name: "secondGuarantorPhone", value: fields.secondGuarantorPhone })
                }
                onFocus={() => handleOnFocus()}
                type={"input"}
                name={"secondGuarantorPhone"}
                value={fields.secondGuarantorPhone}
            />
        </Container>
    );
};

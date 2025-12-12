import { Checkbox, Container, Font, Input } from "@opr-finance/styled-components";
import { componentStyles, pageStyles } from "@opr-finance/themes/sweden-foretagslan-application";

import { T_GuaerantorInfoBlockProps } from "./guarantorInfoBlock.types";

export const GuarantorInfoBlock = (props: T_GuaerantorInfoBlockProps) => {
    const { inputStyles, tooltipStyles } = componentStyles;
    const { applicationPageStyles } = pageStyles;

    const { fields, setFields, handleFieldChange, handleBlur, handleFocus, getErrorMessage } =
        props;

    const handleOnFocus = () => {
        handleFocus("guarantorInfo");
    };

    return (
        <Container id={props.formId} styles={pageStyles.applicationPageStyles.formBlock}>
            <Font styles={pageStyles.applicationPageStyles.blockHeading}>
                Uppgifter om borgensman
            </Font>
            <Font styles={inputStyles.errorMessageStyles}>
                {getErrorMessage("guarantorInfoBlockError") ?? ""}
            </Font>
            {fields.selfGuarantor && !fields.otherAsFirstGuarantor && (
                <>
                    <Font styles={applicationPageStyles.dataRowLabel}>Namn</Font>
                    <Font styles={applicationPageStyles.dataRow}>{fields.applicantName}</Font>
                    <Font styles={applicationPageStyles.dataRowLabel}>Personnummer</Font>
                    <Font styles={applicationPageStyles.dataRow}>{fields.ssn}</Font>
                </>
            )}

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
                label="Jag kommer själv att stå som borgensman. Jag godkänner att ni tar en kreditupplysning på mig som privatperson."
                onClick={() => {
                    setFields({
                        ...fields,
                        otherAsFirstGuarantor: false,
                        selfGuarantor: !fields.selfGuarantor,
                    });

                    handleOnFocus();
                    handleBlur({ name: "selfGuarantor", value: !fields.selfGuarantor });
                }}
                type="checkbox"
                name="selfGuarantor"
                value={fields.selfGuarantor}
                checkboxIcon={["fas", "check"]}
                checkboxSize={"1x"}
                checked={fields.selfGuarantor}
                tooltipMessage={
                    <span>
                        Borgensansvarets omfattning och definitioner av borgen <br />
                        1 Borgen innebär en förbindelse genom vilken den som lämnar förbindelsen
                        (borgensmannen) åtar sig att gentemot borgenären svara för någon annans
                        (gäldenärens) förpliktelse (huvudförpliktelsen). <br />2 Med
                        huvudförpliktelse avses kapitalet för en eller flera skulder eller
                        kreditgivarens annan fordran, räntor, dröjsmålsräntor, avgifter och
                        provisioner enligt kreditgivarens prislista samt övriga kostnader och
                        betalningsförpliktelser.
                    </span>
                }
                tooltipDelay={8000}
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
                label="Jag vill ange en annan borgensman"
                onClick={() => {
                    setFields({
                        ...fields,
                        selfGuarantor: false,
                        otherAsFirstGuarantor: !fields.otherAsFirstGuarantor,
                    });

                    handleOnFocus();
                    handleBlur({
                        name: "otherAsFirstGuarantor",
                        value: !fields.otherAsFirstGuarantor,
                    });
                }}
                type="checkbox"
                name="otherAsFirstGuarantor"
                value={fields.otherAsFirstGuarantor}
                checkboxIcon={["fas", "check"]}
                checkboxSize={"1x"}
                checked={fields.otherAsFirstGuarantor}
                tooltipMessage="Du behöver ange en annan privatperson som kan tänka sig att vara borgensman för
                detta Företagslån. Fyll i korrekta uppgifter så att vi lätt kan komma i kontakt med
                din borgensman."
                tooltipDelay={2000}
            />

            {fields.otherAsFirstGuarantor && (
                <>
                    <Input
                        styles={{
                            containerStyles: inputStyles.containerStyles,
                            labelStyles: inputStyles.labelStyles,
                            inputStyles: inputStyles.inputStyles,
                            errorMessageStyles: inputStyles.errorMessageStyles,
                        }}
                        label="Namn *"
                        errorMessage={getErrorMessage("guarantorName") ?? ""}
                        placeholder="Namn"
                        onChange={(e: any) => {
                            handleFieldChange({
                                name: e.currentTarget.name,
                                value: e.currentTarget.value,
                            });
                        }}
                        onBlur={() =>
                            handleBlur({
                                name: "guarantorName",
                                value: fields.guarantorName,
                            })
                        }
                        onFocus={() => handleOnFocus()}
                        type={"input"}
                        name={"guarantorName"}
                        value={fields.guarantorName}
                    />
                    <Input
                        styles={{
                            containerStyles: inputStyles.containerStyles,
                            labelStyles: inputStyles.labelStyles,
                            inputStyles: inputStyles.inputStyles,
                            errorMessageStyles: inputStyles.errorMessageStyles,
                        }}
                        label="Mailadress *"
                        errorMessage={getErrorMessage("guarantorEmail") ?? ""}
                        placeholder="Mailadress"
                        onChange={(e: any) => {
                            handleFieldChange({
                                name: e.currentTarget.name,
                                value: e.currentTarget.value,
                            });
                        }}
                        onBlur={() =>
                            handleBlur({
                                name: "guarantorEmail",
                                value: fields.guarantorEmail,
                            })
                        }
                        onFocus={() => handleOnFocus()}
                        type={"input"}
                        name={"guarantorEmail"}
                        value={fields.guarantorEmail}
                    />
                    <Input
                        styles={{
                            containerStyles: inputStyles.containerStyles,
                            labelStyles: inputStyles.labelStyles,
                            inputStyles: inputStyles.inputStyles,
                            errorMessageStyles: inputStyles.errorMessageStyles,
                        }}
                        label="Telefonnummer *"
                        errorMessage={getErrorMessage("guarantorPhone") ?? ""}
                        placeholder="Telefonnummer"
                        onChange={(e: any) => {
                            handleFieldChange({
                                name: e.currentTarget.name,
                                value: e.currentTarget.value,
                            });
                        }}
                        onBlur={() =>
                            handleBlur({
                                name: "guarantorPhone",
                                value: fields.guarantorPhone,
                            })
                        }
                        onFocus={() => handleOnFocus()}
                        type={"input"}
                        name={"guarantorPhone"}
                        value={fields.guarantorPhone}
                    />
                </>
            )}
        </Container>
    );
};

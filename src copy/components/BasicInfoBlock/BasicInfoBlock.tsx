import React, { useState } from "react";

import { Container, Font, Input, Select, Button, Textarea } from "@opr-finance/styled-components";
import { componentStyles, pageStyles } from "@opr-finance/themes/sweden-foretagslan-application";

import { T_BasicInfoBlockProps } from "./basicInfoBlock.types";
import { amountOptions, loanPurposeOptions, paymentTimeOptions } from "./options";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import { isKYCServiceEnabled } from "../../utils";

export const BasicInfoBlock = (props: T_BasicInfoBlockProps) => {
    const { basicInfoBlockStyles, inputStyles, buttonStyles } = componentStyles;
    const {
        fields,
        handleFieldChange,
        handleBlur,
        handleFocus,
        getErrorMessage,
        secondGuarantorVisible,
        isPartnerApplication,
    } = props;

    const handleOnFocus = () => {
        handleFocus("basicInfo");
    };

    let guarantorsCount = "-";

    if (secondGuarantorVisible === true) {
        guarantorsCount = "2";
    } else if (secondGuarantorVisible === false) {
        guarantorsCount = "1";
    }

    const { width } = useWindowDimensions();
    const itemsPerRow = width && width > 786 ? 7 : 4;
    const btnValues = Array.from({ length: 28 }, (_, i) => i + 1);
    let [dueDateSuffix, setDueDateSuffix] = useState(":e varje månad");
    const beginsWith12 = [1, 2, 21, 22];

    const handleItemClick = (item: number) => {
        handleDueDateSelection(item);
    };

    const renderItems = () => {
        const items = [...btnValues];
        const chunks = [];

        while (items.length) {
            chunks.push(items.splice(0, itemsPerRow));
        }

        return chunks.map((chunk, index) => (
            <div key={chunk.join("-")}>
                {chunk.map((item) => (
                    <Button
                        key={item}
                        active={fields.invoiceDueDate === item}
                        onClick={() => handleItemClick(item)}
                        styles={buttonStyles.tableButtonStyles({
                            width: "50px",
                            active: fields.invoiceDueDate === item,
                        })}>
                        {item}
                    </Button>
                ))}
            </div>
        ));
    };

    const handleDueDateSelection = (item: number) => {
        handleFieldChange({
            name: "invoiceDueDate",
            value: item,
        });
        if (beginsWith12.includes(item)) setDueDateSuffix(":a varje månad");
        else setDueDateSuffix(":e varje månad");
    };

    return (
        <Container id={props.formId} styles={pageStyles.applicationPageStyles.formBlock}>
            <Font styles={basicInfoBlockStyles.blockHeading}>Låneuppgifter</Font>
            <Select
                styles={{
                    containerStyles: inputStyles.containerStyles,
                    labelStyles: inputStyles.labelStyles,
                    inputStyles: inputStyles.selectStyles,
                    errorMessageStyles: inputStyles.errorMessageStyles,
                }}
                isMulti={false}
                label="Lånebelopp *"
                errorMessage={getErrorMessage("loanAmount") ?? ""}
                onChange={(newValue: any) => {
                    handleFieldChange({
                        name: "loanAmount",
                        value: newValue.value,
                    });
                }}
                onBlur={() => handleBlur({ name: "loanAmount", value: fields.loanAmount })}
                onFocus={() => handleOnFocus()}
                name="loanAmount"
                options={amountOptions}
                value={
                    fields.loanAmount
                        ? { value: fields.loanAmount, label: fields.loanAmount }
                        : null
                }
                disabled={isPartnerApplication}
            />
            <Select
                styles={{
                    containerStyles: inputStyles.containerStyles,
                    labelStyles: inputStyles.labelStyles,
                    inputStyles: inputStyles.selectStyles,
                    errorMessageStyles: inputStyles.errorMessageStyles,
                }}
                errorMessage={getErrorMessage("repaymentPeriod") ?? ""}
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
                onFocus={() => handleOnFocus()}
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
                disabled={isPartnerApplication}
            />
            <Container styles={inputStyles.buttonGroupContainerStyles}>
                <Font styles={pageStyles.applicationPageStyles.dataRowLabel}>
                    Välj önskat förfallodatum för dina fakturor *
                </Font>
                <Container
                    styles={inputStyles.buttonGroupStyles}
                    onMouseEnter={() => handleOnFocus()}
                    onMouseLeave={() =>
                        handleBlur({ name: "invoiceDueDate", value: fields.invoiceDueDate })
                    }>
                    {renderItems()}
                </Container>
                {fields?.invoiceDueDate &&
                fields?.invoiceDueDate >= 1 &&
                fields?.invoiceDueDate <= 28 ? (
                    <Font styles={pageStyles.applicationPageStyles.buttonGroupData}>
                        {`Ditt önskade förfallodatum är den ${fields.invoiceDueDate}${dueDateSuffix}`}
                    </Font>
                ) : null}
                {!fields?.invoiceDueDate ||
                fields?.invoiceDueDate <= 1 ||
                fields?.invoiceDueDate >= 28 ? (
                    <Font styles={inputStyles.errorMessageStyles}>
                        {getErrorMessage("invoiceDueDate") ?? ""}
                    </Font>
                ) : null}
            </Container>
            <Font styles={basicInfoBlockStyles.guarantorsCountLabel}>Antal borgensmän</Font>
            <Font styles={basicInfoBlockStyles.guarantorsCount}>{guarantorsCount}</Font>

            {!isKYCServiceEnabled() && (
                <>
                    <Select
                        styles={{
                            containerStyles: inputStyles.containerStyles,
                            labelStyles: inputStyles.labelStyles,
                            inputStyles: inputStyles.selectStyles,
                            errorMessageStyles: inputStyles.errorMessageStyles,
                        }}
                        errorMessage={getErrorMessage("loanPurpose") ?? ""}
                        isMulti={false}
                        label="Syfte med lånet *"
                        onChange={(newValue: any) => {
                            handleFieldChange({
                                name: "loanPurpose",
                                value: newValue.value,
                            });
                        }}
                        placeholder="Välj"
                        onBlur={() =>
                            handleBlur({ name: "loanPurpose", value: fields.loanPurpose })
                        }
                        onFocus={() => handleOnFocus()}
                        name="loanPurpose"
                        options={loanPurposeOptions}
                        value={
                            fields.loanPurpose
                                ? {
                                      value: fields.loanPurpose,
                                      label: fields.loanPurpose,
                                  }
                                : null
                        }
                    />

                    <Textarea
                        styles={{
                            containerStyles: inputStyles.containerStyles,
                            labelStyles: inputStyles.labelStyles,
                            inputStyles: inputStyles.textareaStyles,
                            errorMessageStyles: inputStyles.errorMessageStyles,
                        }}
                        label="Vänligen förklara mer ingående vad lånet är avsett för *"
                        errorMessage={getErrorMessage("loanPurposeDescription") ?? ""}
                        placeholder="Ange vad lånet ska användas till"
                        onChange={(e) =>
                            handleFieldChange({
                                name: e.currentTarget.name,
                                value: e.currentTarget.value,
                            })
                        }
                        onBlur={() =>
                            handleBlur({
                                name: "loanPurposeDescription",
                                value: fields.loanPurposeDescription,
                            })
                        }
                        onFocus={() => handleOnFocus()}
                        type={"textarea"}
                        name={"loanPurposeDescription"}
                        value={fields.loanPurposeDescription}
                    />
                    <Textarea
                        styles={{
                            containerStyles: inputStyles.containerStyles,
                            labelStyles: inputStyles.labelStyles,
                            inputStyles: inputStyles.textareaStyles,
                            errorMessageStyles: inputStyles.errorMessageStyles,
                        }}
                        label="Beskriv kort om din verksamhet"
                        errorMessage={getErrorMessage("businessSector") ?? ""}
                        placeholder="Verksamhetsbeskrivning"
                        onChange={(e) =>
                            handleFieldChange({
                                name: e.currentTarget.name,
                                value: e.currentTarget.value,
                            })
                        }
                        onBlur={() =>
                            handleBlur({ name: "businessSector", value: fields.businessSector })
                        }
                        onFocus={() => handleOnFocus()}
                        type={"textarea"}
                        name={"businessSector"}
                        value={fields.businessSector}
                    />
                </>
            )}

            <Input
                styles={{
                    containerStyles: inputStyles.containerStyles,
                    labelStyles: inputStyles.labelStyles,
                    inputStyles: inputStyles.inputStyles,
                    errorMessageStyles: inputStyles.errorMessageStyles,
                }}
                label="Kampanjkod"
                errorMessage=""
                placeholder="Kampanjkod"
                onChange={(e) =>
                    handleFieldChange({
                        name: e.currentTarget.name,
                        value: e.currentTarget.value,
                    })
                }
                onBlur={() => handleBlur({ name: "campaignCode", value: fields.campaignCode })}
                onFocus={() => handleOnFocus()}
                type={"input"}
                name={"campaignCode"}
                value={fields.campaignCode}
            />
        </Container>
    );
};

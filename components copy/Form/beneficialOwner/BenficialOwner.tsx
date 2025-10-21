import React, { useState } from "react";
import { T_BeneficialOwnerProps, T_BoFieldParams } from "./types";
import { Container } from "@ui/container";
import { Popover } from "@ui/popover";
import {
    addBoFormButton,
    boCloseIcon,
    boComponentContainer,
    boPopoverButton,
    boQuestionContainer,
    boLabelButtonRow,
    boLabelContainer,
    boButtonContainer,
    boResultAndButton,
    removeBoFormButton,
} from "~/styles";
import { BeneficialOwnerForm } from "./BeneficialOwnerForm";
import { BeneficialOwnerResult } from "./BeneficialOwnerResult";
import { Button } from "@ui/button";
import { Icon } from "@ui/icon";
import { Label } from "@ui/label";
import { ErrorMessage } from "@ui/error";

export const BeneficialOwner: React.FC<T_BeneficialOwnerProps> = ({
    label,
    fieldName,
    classNames,
    beneficialOwnerFieldsData,
    beneficialOwnersMaxCount,
    countryList,
    error,
    errorClassNames,
    infoItems,
    handleChange,
}) => {
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [entriesIndex, setEntriesIndex] = useState(0);

    /**
     * Use map for easier iteration in component
     */
    const [fieldsMap, setFieldsMap] = useState<Map<string, Array<T_BoFieldParams>>>(new Map());

    const convertMapToValue = (map: Map<string, Array<T_BoFieldParams>>): string => {
        if (map.size === 0) return "";

        const beneficialOwnersData = Array.from(map.values()).map((fields) => {
            const dataObj: Record<string, string | string[]> = {};
            for (const field of fields) {
                dataObj[field.fieldname] = field.value;
            }
            return dataObj;
        });

        return JSON.stringify(beneficialOwnersData);
    };


    const updateFieldsMap = (newMap: Map<string, Array<T_BoFieldParams>>) => {
        setFieldsMap(newMap);
        const valueToSend = convertMapToValue(newMap);
        handleChange(fieldName, valueToSend);
    };

    const handleAddBo = (
        name: T_BoFieldParams,
        ssn: T_BoFieldParams,
        ownership: T_BoFieldParams,
        countries: T_BoFieldParams
    ) => {
        const newMap = new Map(fieldsMap);
        newMap.set(`owner_${entriesIndex}`, [name, ssn, ownership, countries]);
        setEntriesIndex(entriesIndex + 1);
        updateFieldsMap(newMap);
    };

    const handleRemoveBo = (mapKey: string) => {
        const newMap = new Map(fieldsMap);
        newMap.delete(mapKey);
        updateFieldsMap(newMap);
    };

    return (
        <Container className={boComponentContainer}>
            <Container className={boQuestionContainer}>
                <Container className={boLabelButtonRow}>
                    <Container className={boLabelContainer}>
                        <Label
                            htmlFor={fieldName}
                            labelClassName={classNames?.beneficialOwnerLabel}
                            infoItems={infoItems}>
                            {label}
                        </Label>
                    </Container>

                    {fieldsMap.size < beneficialOwnersMaxCount && (
                        <Container className={boButtonContainer}>
                            <Popover
                                popoverOpen={popoverOpen}
                                setPopoverOpen={setPopoverOpen}
                                classNames={{
                                    popoverButton: boPopoverButton,
                                    popoverCloseIcon: boCloseIcon,
                                }}>
                                <BeneficialOwnerForm
                                    classNames={{ fromButton: addBoFormButton }}
                                    formData={beneficialOwnerFieldsData}
                                    onButtonClick={(name, ssn, ownership, countries) => {
                                        handleAddBo(name, ssn, ownership, countries);
                                        setPopoverOpen(false);
                                    }}
                                    countryList={countryList}
                                />
                            </Popover>
                        </Container>
                    )}
                </Container>
            </Container>

            {fieldsMap.size > 0 &&
                Array.from(fieldsMap.entries()).map(([key, fieldArray]) => {
                    return (
                        <Container key={`parent_${key}`} className={boResultAndButton}>
                            <BeneficialOwnerResult id={key} fieldArray={fieldArray} />
                            <Button
                                type={"button"}
                                className={removeBoFormButton}
                                label={<Icon iconName="trash" iconPrefix="fas" />}
                                onClick={() => handleRemoveBo(key)}
                            />
                        </Container>
                    );
                })}

            {error && fieldsMap.size === 0 && (
                <ErrorMessage error={error} classNames={errorClassNames} />
            )}
        </Container>
    );
};
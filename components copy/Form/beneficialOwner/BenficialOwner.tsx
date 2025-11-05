import React, { useState, useEffect } from "react";
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
import { convertMapToOwnersArray } from "./utils";

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
    onChange,
    currentValue,
}) => {
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [entriesIndex, setEntriesIndex] = useState(0);

    /**
     * Use map for easier iteration in component
     */
    const [fieldsMap, setFieldsMap] = useState<Map<string, Array<T_BoFieldParams>>>(new Map());

    // Initialize from currentValue when component mounts or currentValue changes
    useEffect(() => {
        if (!currentValue || !Array.isArray(currentValue) || currentValue.length === 0) return;
        
        const newMap = new Map<string, Array<T_BoFieldParams>>();
        let maxIndex = 0;
        
        currentValue.forEach((owner, index) => {
            if (typeof owner !== 'object' || owner === null) return;
            
            const entries: Array<T_BoFieldParams> = [];
            const fields = beneficialOwnerFieldsData.fieldName;
            const labels = beneficialOwnerFieldsData.label;
            
            // Name
            if (owner[fields.beneficialOwnerName]) {
                entries.push({
                    fieldname: fields.beneficialOwnerName,
                    label: labels.beneficialOwnerName,
                    value: owner[fields.beneficialOwnerName]
                });
            }
            
            // SSN
            if (owner[fields.beneficialOwnerSsn]) {
                entries.push({
                    fieldname: fields.beneficialOwnerSsn,
                    label: labels.beneficialOwnerSsn,
                    value: owner[fields.beneficialOwnerSsn]
                });
            }
            
            // Ownership
            if (owner[fields.beneficialOwnerOwnership]) {
                entries.push({
                    fieldname: fields.beneficialOwnerOwnership,
                    label: labels.beneficialOwnerOwnership,
                    value: owner[fields.beneficialOwnerOwnership]
                });
            }
            
            // Country
            if (owner[fields.beneficialOwnerCountry]) {
                entries.push({
                    fieldname: fields.beneficialOwnerCountry,
                    label: labels.beneficialOwnerCountry,
                    value: owner[fields.beneficialOwnerCountry]
                });
            }
            
            // Only add if we have all 4 fields
            if (entries.length === 4) {
                const key = `owner_${index + 1}`;
                newMap.set(key, entries);
                maxIndex = Math.max(maxIndex, index + 1);
            }
        });
        
        setFieldsMap(newMap);
        setEntriesIndex(maxIndex);
    }, [currentValue, beneficialOwnerFieldsData]);

    /**
     * Preserve immutability with this helper function
     */
    const updateMap = (key: string, value: Array<T_BoFieldParams>) => {
        const tempMap = new Map(fieldsMap);
        tempMap.set(key, value);
        setFieldsMap(tempMap);

        const owners = convertMapToOwnersArray(tempMap);

        if (onChange) {
            onChange(fieldName, owners);
        }
    };

    const handleAddBo = (
        name: T_BoFieldParams,
        ssn: T_BoFieldParams,
        ownership: T_BoFieldParams,
        countries: T_BoFieldParams
    ) => {
        const valueArray: Array<T_BoFieldParams> = [name, ssn, ownership, countries];
        const nextIndex = entriesIndex + 1;
        setEntriesIndex(nextIndex);
        updateMap(`owner_${nextIndex}`, valueArray);
    };

    const handleRemoveBo = (mapKey: string) => {
        const tempMap = new Map(fieldsMap);
        tempMap.delete(mapKey);
        setFieldsMap(tempMap);

        const owners = convertMapToOwnersArray(tempMap);

        if (onChange) {
            onChange(fieldName, owners);
        }
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
                            <BeneficialOwnerResult key={key} fieldArray={fieldArray} />
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
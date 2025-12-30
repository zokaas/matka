import React, { useEffect, useState } from "react";
import { T_BeneficialOwnerProps, T_BoFieldParams } from "./types";
import { Container } from "@ui/container";
import { Popover } from "@ui/popover";
import {
    addBoFormButton,
    boCloseIcon,
    boComponentContainer,
    boPopoverButton,
    boLabelAndButtonContainer,
    boLabelButtonRow,
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
import { T_BeneficialOwner } from "~/types";

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
    const [fieldsMap, setFieldsMap] = useState<Map<string, Array<T_BoFieldParams>>>(() => {
        if (!Array.isArray(currentValue) || currentValue.length === 0) {
            return new Map();
        }

        const map = new Map<string, Array<T_BoFieldParams>>();
        const fieldConfig = beneficialOwnerFieldsData.fields;

        currentValue.forEach((item, index) => {
            const ownerKey = `owner_${index + 1}`;
            const fields: Array<T_BoFieldParams> = [];

            if (typeof item === "object" && item !== null) {
                const owner = item as T_BeneficialOwner;

                Object.keys(owner).forEach((key) => {
                    const fieldNameKey = key.replace(/^owner_\d+_/, "");
                    const value = owner[key];

                    const labelMap: Record<string, string> = {
                        [fieldConfig.name.parameter]: fieldConfig.name.label,
                        [fieldConfig.ssn.parameter]: fieldConfig.ssn.label,
                        [fieldConfig.ownership.parameter]: fieldConfig.ownership.label,
                        [fieldConfig.country.parameter]: fieldConfig.country.label,
                        [fieldConfig.pep.parameter]: fieldConfig.pep.label,
                    };

                    const fieldLabel = labelMap[fieldNameKey] ?? "";

                    fields.push({
                        fieldname: fieldNameKey,
                        value: String(value),
                        label: fieldLabel,
                        text:
                            fieldNameKey === fieldConfig.country.parameter
                                ? String(value)
                                : undefined,
                    });
                });
            }

            if (fields.length > 0) {
                map.set(ownerKey, fields);
            }
        });

        return map;
    });

    useEffect(() => {
        setEntriesIndex(fieldsMap.size);
    }, []);

    const transformOwners = (
        map: Map<string, Array<T_BoFieldParams>>
    ): Array<T_BeneficialOwner> => {
        const owners = convertMapToOwnersArray(map);

        return owners.map((owner, index) => {
            const ownerNumber = index + 1;
            const transformed: T_BeneficialOwner = {};

            Object.keys(owner).forEach((key) => {
                transformed[`owner_${ownerNumber}_${key}`] = owner[key];
            });

            return transformed;
        });
    };

    const updateMap = (key: string, value: Array<T_BoFieldParams>) => {
        const tempMap = new Map(fieldsMap);
        tempMap.set(key, value);
        setFieldsMap(tempMap);

        const transformedOwners = transformOwners(tempMap);

        if (onChange) {
            onChange(fieldName, transformedOwners);
        }
    };

    const handleAddBo = (
        name: T_BoFieldParams,
        ssn: T_BoFieldParams,
        ownership: T_BoFieldParams,
        countries: T_BoFieldParams,
        pep: T_BoFieldParams
    ) => {
        const valueArray: Array<T_BoFieldParams> = [name, ssn, ownership, countries, pep];
        const nextIndex = entriesIndex + 1;
        setEntriesIndex(nextIndex);
        updateMap(`owner_${nextIndex}`, valueArray);
        setPopoverOpen(false);
    };

    const handleRemoveBo = (mapKey: string) => {
        const tempMap = new Map(fieldsMap);
        tempMap.delete(mapKey);
        setFieldsMap(tempMap);

        const transformedOwners = transformOwners(tempMap);

        if (onChange) {
            onChange(fieldName, transformedOwners);
        }
    };

    return (
        <Container className={boComponentContainer}>
            <Container className={boLabelAndButtonContainer}>
                <Container className={boLabelButtonRow}>
                    <Label
                        htmlFor={fieldName}
                        labelClassName={classNames?.beneficialOwnerLabel}
                        infoItems={infoItems}>
                        {label}
                    </Label>

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
                                    classNames={{ formButton: addBoFormButton }}
                                    formData={beneficialOwnerFieldsData}
                                    onButtonClick={(name, ssn, ownership, countries, pep) => {
                                        handleAddBo(name, ssn, ownership, countries, pep);
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
            <ErrorMessage error={error} classNames={errorClassNames} />
        </Container>
    );
};

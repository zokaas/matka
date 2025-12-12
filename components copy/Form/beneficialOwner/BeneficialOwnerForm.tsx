import React, { useEffect, useState } from "react";
import { Container } from "@ui/container";
import { T_BeneficialOwnerFormProps, T_BoFieldParams } from "./types";
import { InputText } from "@ui/input";
import { Button } from "@ui/button";
import { DropDown } from "@ui/dropdown";
import { Radiogroup } from "@ui/radiogroup";
import {
    b2bRadiogroupRootStyle,
    b2bRadioIndicatorStyle,
    b2bRadioItemLabelStyle,
    b2bRadioItemStyle,
    boQuestionsStyle,
} from "~/styles";

export const BeneficialOwnerForm: React.FC<T_BeneficialOwnerFormProps> = ({
    formData,
    onButtonClick,
    countryList,
    classNames,
}) => {
    const { addButton, fields } = formData;

    const [name, setName] = useState<T_BoFieldParams>({
        fieldname: "",
        value: "",
        label: "",
    });
    const [ssn, setSsn] = useState<T_BoFieldParams>({
        fieldname: "",
        value: "",
        label: "",
    });
    const [ownership, setOwnership] = useState<T_BoFieldParams>({
        fieldname: "",
        value: "",
        label: "",
    });
    const [country, setCountry] = useState<T_BoFieldParams>({
        fieldname: "",
        value: "",
        label: "",
        text: "",
    });
    const [pep, setPep] = useState<T_BoFieldParams>({
        fieldname: "",
        value: "",
        label: "",
        text: "",
    });

    const [addButtonDisabled, setAddButtonDisabled] = useState(true);

    useEffect(() => {
        setAddButtonDisabled(
            !(name.value && ssn.value && ownership.value && country.value && pep.value)
        );
    }, [name.value, ssn.value, ownership.value, country.value, pep.value]);

    return (
        <Container>
            <Container className={boQuestionsStyle}>
                <InputText
                    label={fields.name.label}
                    fieldName={fields.name.parameter}
                    placeholder={fields.name.placeholder}
                    classNames={{
                        fieldClassName: classNames.formInputField || "",
                        labelClassName: classNames.formLabelFields || "",
                    }}
                    onChange={(value) => {
                        setName({
                            fieldname: fields.name.parameter,
                            label: fields.name.label,
                            value: value.trim(),
                        });
                    }}
                    onBlur={() => {}}
                    error=""
                />
            </Container>
            <Container className={boQuestionsStyle}>
                <InputText
                    fieldName={fields.ssn.parameter}
                    label={fields.ssn.label}
                    placeholder={fields.ssn.placeholder}
                    classNames={{
                        fieldClassName: classNames.formInputField || "",
                        labelClassName: classNames.formLabelFields || "",
                    }}
                    onChange={(value) => {
                        setSsn({
                            fieldname: fields.ssn.parameter,
                            label: fields.ssn.label,
                            value: value.trim(),
                        });
                    }}
                    onBlur={() => {}}
                    error=""
                />
            </Container>
            <Container className={boQuestionsStyle}>
                <InputText
                    label={fields.ownership.label}
                    fieldName={fields.ownership.parameter}
                    placeholder={fields.ownership.placeholder}
                    classNames={{
                        fieldClassName: classNames.formInputField || "",
                        labelClassName: classNames.formLabelFields || "",
                    }}
                    onChange={(value) => {
                        setOwnership({
                            fieldname: fields.ownership.parameter,
                            label: fields.ownership.label,
                            value: value.trim(),
                        });
                    }}
                    onBlur={() => {}}
                    error=""
                />
            </Container>
            <Container className={boQuestionsStyle}>
                <DropDown
                    label={fields.country.label}
                    fieldName={fields.country.parameter}
                    placeholder={fields.country.placeholder}
                    value={country.value}
                    searchEnabled
                    options={countryList || null}
                    showSelectedItemIcon={true}
                    onChange={(selectedCountry) => {
                        const countryOption = countryList?.find(
                            (c) => String(c.value) === String(selectedCountry)
                        );

                        setCountry({
                            fieldname: fields.country.parameter,
                            label: fields.country.label,
                            value: String(selectedCountry),
                            text: countryOption?.text,
                        });
                    }}
                    onBlur={() => {}}
                />
            </Container>
            <Container className={boQuestionsStyle}>
                <Radiogroup
                    fieldName={fields.pep.parameter}
                    label={fields.pep.label}
                    onChange={(value) => {
                        const pepOption = fields.pep.options?.find(
                            (opt) => String(opt.value) === String(value)
                        );

                        setPep({
                            fieldname: fields.pep.parameter,
                            label: fields.pep.label,
                            value: value,
                            text: pepOption?.text,
                        });
                    }}
                    onBlur={() => {}}
                    options={fields.pep.options || []}
                    defaultValue={pep.value}
                    error=""
                    classNames={{
                        radioRoot: b2bRadiogroupRootStyle,
                        radioItemContainer: b2bRadiogroupRootStyle,
                        radioItem: b2bRadioItemStyle,
                        radioIndicator: b2bRadioIndicatorStyle,
                        radioLabel: b2bRadioItemLabelStyle,
                    }}
                />
            </Container>
            <Button
                type="button"
                label={addButton}
                disabled={addButtonDisabled}
                className={classNames.formButton || ""}
                onClick={() => onButtonClick(name, ssn, ownership, country, pep)}
            />
        </Container>
    );
};

import React, { useEffect, useState } from "react";
import { Container } from "@ui/container";
import { T_BeneficialOwnerFormProps, T_BoFieldParams } from "./types";
import { InputText } from "@ui/inputField";
import { Button } from "@ui/button";
import { DropDown } from "@ui/dropdown";

export const BeneficialOwnerForm: React.FC<T_BeneficialOwnerFormProps> = ({
    formData,
    onButtonClick,
    countryList,
    classNames,
}) => {
    const { addButton, fieldName, label, placeholder } = formData;

    const [name, setName] = useState<T_BoFieldParams>({ fieldname: "", value: "", label: "" });
    const [ssn, setSsn] = useState<T_BoFieldParams>({ fieldname: "", value: "", label: "" });
    const [ownership, setOwnership] = useState<T_BoFieldParams>({
        fieldname: "",
        value: "",
        label: "",
    });
    const [country, setCountry] = useState<T_BoFieldParams>({
        fieldname: "",
        value: "",
        label: "",
    });

    const [addButtonDisabled, setAddButtonDisabled] = useState(true);

    const enableButton = () => {
        if (!name.value || !ssn.value || !ownership.value || !country.value) {
            setAddButtonDisabled(true);
        } else {
            setAddButtonDisabled(false);
        }
    };

    useEffect(() => {
        setAddButtonDisabled(!(name.value && ssn.value && ownership.value && country.value));
    }, [name.value, ssn.value, ownership.value, country.value]);
    
    return (
        <Container>
            <InputText
                label={label.beneficialOwnerName}
                fieldName={fieldName.beneficialOwnerName}
                placeholder={placeholder.beneficialOwnerName}
                classNames={{
                    fieldClassName: classNames.formInputField || "",
                    labelClassName: classNames.formLabelFields || "",
                }}
                onChange={(value) => {
                    setName({
                        fieldname: fieldName.beneficialOwnerName,
                        label: label.beneficialOwnerName,
                        value: value.trim(),
                    });
                    enableButton();
                }}
                onBlur={() => {
                    enableButton();
                }}
                error={""}
            />
            <InputText
                fieldName={fieldName.beneficialOwnerSsn}
                label={label.beneficialOwnerSsn}
                placeholder={placeholder.beneficialOwnerSsn}
                classNames={{
                    fieldClassName: classNames.formInputField || "",
                    labelClassName: classNames.formLabelFields || "",
                }}
                onChange={(value) => {
                    setSsn({
                        fieldname: fieldName.beneficialOwnerSsn,
                        label: label.beneficialOwnerSsn,
                        value: value.trim(),
                    });
                    enableButton();
                }}
                onBlur={() => {
                    enableButton();
                }}
                error={""}
            />
            <InputText
                label={label.beneficialOwnerOwnership}
                fieldName={fieldName.beneficialOwnerOwnership}
                placeholder={placeholder.beneficialOwnerOwnership}
                classNames={{
                    fieldClassName: classNames.formInputField || "",
                    labelClassName: classNames.formLabelFields || "",
                }}
                onChange={(value) => {
                    setOwnership({
                        fieldname: fieldName.beneficialOwnerOwnership,
                        label: label.beneficialOwnerOwnership,
                        value: value.trim(),
                    });
                    enableButton();
                }}
                onBlur={() => {
                    enableButton();
                }}
                error={""}
            />
            <DropDown
                label={label.beneficialOwnerCountry}
                fieldName={fieldName.beneficialOwnerCountry}
                placeholder={placeholder.beneficialOwnerCountry}
                searchEnabled
                options={countryList || null}
                showSelectedItemIcon={true}
                onChange={(country) => {
                    setCountry({
                        fieldname: fieldName.beneficialOwnerCountry,
                        label: label.beneficialOwnerCountry,
                        value: `${country}`,
                    });
                    enableButton();
                }}
                onBlur={() => {
                    enableButton();
                }}
                error={""}
            />
            <Button
                type={"button"}
                label={addButton}
                disabled={addButtonDisabled}
                className={classNames.fromButton || ""}
                onClick={() => onButtonClick(name, ssn, ownership, country)}
            />
        </Container>
    );
};

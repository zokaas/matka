import { Input, Select, Button } from "@ui-components/index";
import React, { useState } from "react";
import BeneficialOwnerCard from "./BeneficialOwnerCard";
import { T_BeneficialOwnerForm, T_BeneficialOwner } from "./beneficialOwnerFormTypes";
import { z } from "zod";
import { beneficialOwnerSchema } from "apps/kyc/validation/beneficialOwnerSchema";

export const BeneficialOwnerForm: React.FC<T_BeneficialOwnerForm> = ({
    label,
    name,
    beneficialOwners,
    setBeneficialOwner,
    countryList,
    beneficialOwnerLabels,
    errorMessage,
    errors,
}) => {
    const [newOwner, setNewOwner] = useState<Partial<T_BeneficialOwner>>({});
    const [boCountry, setBoCountry] = useState<string>("");
    const [localErrors, setLocalErrors] = useState<{
        name?: string;
        ssn?: string;
        ownership?: string;
        country?: string;
    }>({});

    const handleAddOwner = () => {
        const ownerData = { ...newOwner, country: boCountry };

        try {
            beneficialOwnerSchema.parse(ownerData);

            setLocalErrors({});
            setBeneficialOwner([...beneficialOwners, ownerData as T_BeneficialOwner]);

            setNewOwner({});
            setBoCountry("");
        } catch (error) {
            if (error instanceof z.ZodError) {
                const errors: { [key: string]: string } = {};
                error.errors.forEach((err) => {
                    if (err.path.length > 0) {
                        const fieldName = err.path[0] as string;
                        errors[fieldName] = err.message;
                    }
                });
                setLocalErrors(errors);
            } else {
                console.error("Unexpected validation error:", error);
            }
        }
    };

    const handleDeleteOwner = (index: number) => {
        const updatedOwners = beneficialOwners.filter((_, i) => i !== index);
        setBeneficialOwner(updatedOwners);
    };

    const getOwnerError = (index: number, field: string) => {
        const path = `${name}.${index}.${field}`;
        return errors && errors[path] ? errors[path] : null;
    };

    return (
        <div className="mb-4">
            <label className="block mb-4 font-medium text-base-content">{label}</label>

            {beneficialOwners.length > 0 && (
                <div className="mb-6">
                    {beneficialOwners.map((owner, index) => (
                        <div key={index}>
                            <BeneficialOwnerCard
                                owner={owner}
                                onDelete={() => handleDeleteOwner(index)}
                            />
                            {["name", "ssn", "ownership", "country"].map((field) => {
                                const error = getOwnerError(index, field);
                                return (
                                    error && (
                                        <span key={field} className="text-red-500 text-sm">
                                            {error}
                                        </span>
                                    )
                                );
                            })}
                        </div>
                    ))}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="col-span-1 md:col-span-2">
                    <Input
                        label={beneficialOwnerLabels?.nameLabelText || "Name"}
                        placeholder="Name of owner"
                        value={newOwner.name || ""}
                        onChange={(value: string) => setNewOwner({ ...newOwner, name: value })}
                        name="name"
                        errorMessage={localErrors.name}
                    />
                </div>

                <div className="col-span-1 md:col-span-2">
                    <Input
                        label={beneficialOwnerLabels?.ssnLabelText || "SSN"}
                        placeholder="SSN"
                        value={newOwner.ssn || ""}
                        onChange={(value: string) => setNewOwner({ ...newOwner, ssn: value })}
                        name="ssn"
                        errorMessage={localErrors.ssn}
                    />
                </div>

                <div className="col-span-1 md:col-span-2">
                    <Input
                        label={beneficialOwnerLabels?.ownershipLabelText || "Ownership (%)"}
                        placeholder="Ownership (%)"
                        value={newOwner.ownership || ""}
                        onChange={(value: string) => setNewOwner({ ...newOwner, ownership: value })}
                        name="ownership"
                        errorMessage={localErrors.ownership}
                    />
                </div>

                <div className="col-span-1 md:col-span-2">
                    <Select
                        label={beneficialOwnerLabels?.countryLabelText || "Country"}
                        placeholder="Select a country"
                        options={countryList.map((country) => ({
                            id: country.id || "",
                            value: country.value,
                        }))}
                        selectedValue={boCountry}
                        onChange={setBoCountry}
                        name="country"
                        errorMessage={localErrors.country}
                    />
                </div>
            </div>
            <div className="col-span-1 md:col-span-2">
                {errorMessage && <span className="text-red-500 text-sm mt-3">{errorMessage}</span>}
                <div className="flex justify-end">
                    <Button variant="greenBeneficialOwner" onClick={handleAddOwner}>
                        {beneficialOwnerLabels?.addBObutton}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default BeneficialOwnerForm;

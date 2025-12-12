import { useEffect, useState } from "react";
import { getRequiredFields } from "./requiredBlockItems";
import { T_FormFields } from "./types";

export const useValidation = (fieldErrors: any, fields: T_FormFields) => {
    const [validBlocks, setValidBlocks] = useState<string[]>([]);
    const [invalidBlocks, setInvalidBlocks] = useState<string[]>([]);

    useEffect(() => {
        let errors: string[] = [];
        let success: string[] = [];
        Object.entries(fieldErrors).forEach(([key, value]) => {
            if (value === "") {
                success.push(key);
            } else if (value) {
                errors.push(key);
            }
        });

        getRequiredFields(fields).forEach((block) => {
            const { blockName, fields: blockFields } = block;
            const isValid = blockFields.every((field) => success.includes(field));
            const isInvalid = blockFields.some((field) => errors.includes(field));

            if (isValid) {
                setValidBlocks((prev) => (prev.includes(blockName) ? prev : [...prev, blockName]));
                setInvalidBlocks((prev) =>
                    prev.includes(blockName) ? prev.filter((b) => b !== blockName) : prev
                );
            }

            if (isInvalid) {
                setInvalidBlocks((prev) =>
                    prev.includes(blockName) ? prev : [...prev, blockName]
                );
                setValidBlocks((prev) =>
                    prev.includes(blockName) ? prev.filter((b) => b !== blockName) : prev
                );
            }
        });
    }, [fieldErrors, fields]);

    return { validBlocks, invalidBlocks };
};

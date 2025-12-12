import React, { useEffect } from "react";

export type T_HiddenInputProps = {
    fieldName: string;
    value?: string | boolean;
    onChange: (value: string | boolean) => void;
};

export const HiddenInput: React.FC<T_HiddenInputProps> = ({
    fieldName,
    value,
    onChange,
}) => {
    useEffect(() => {
        // Handle DistanceAgreement - always set to true
        if (fieldName === "DistanceAgreement") {
            onChange(true);
        }

        // Handle SNICode - get from session cookie
        if (fieldName === "SNICode") {
            const sniCode = getSNICodeFromSession();
            if (sniCode) {
                onChange(sniCode);
            }
        }
    }, [fieldName, onChange]);

    return (
        <input
            type="hidden"
            name={fieldName}
            id={fieldName}
            value={value !== undefined ? String(value) : ""}
        />
    );
};

/**
 * Extracts SNI code from session cookie
 * @returns SNI code string or null if not found
 */
const getSNICodeFromSession = (): string | null => {
    if (typeof document === "undefined") return null;

    const cookies = document.cookie.split(";");

    for (const cookie of cookies) {
        const [name, value] = cookie.trim().split("=");

        // Look for session cookie (adjust cookie name as needed)
        if (name === "session" || name === "sessionData") {
            try {
                // Try to parse if it's JSON
                const sessionData = JSON.parse(decodeURIComponent(value));
                return sessionData.sni || sessionData.SNICode || null;
            } catch {
                // If not JSON, check if the value itself is the SNI code
                // You might need to adjust this logic based on your cookie structure
                return value;
            }
        }

        // Direct SNI cookie (if stored separately)
        if (name === "sni" || name === "SNICode") {
            return decodeURIComponent(value);
        }
    }

    return null;
};

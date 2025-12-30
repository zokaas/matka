import { Container } from "@ui/container";
import { Text } from "@ui/text";
import React from "react";
import { T_BeneficialOwnerResultProps } from "./types";
import { boResultContainer, boResultValueContainer, boResultValueLabelContainer } from "~/styles";

export const BeneficialOwnerResult: React.FC<T_BeneficialOwnerResultProps> = ({ fieldArray }) => {
    return (
        <Container className={boResultContainer}>
            {fieldArray.map((item, index) => {
                const displayValue = item.text || item.value;

                return (
                    <Container key={`${index}-${item.fieldname}`}>
                        <Text className={boResultValueLabelContainer}>{item.label}</Text>
                        <Text className={boResultValueContainer}>{displayValue}</Text>
                    </Container>
                );
            })}
        </Container>
    );
};

import { Container } from "@ui/container";
import { Text } from "@ui/text";
import React from "react";
import { T_BeneficialOwnerResultProps } from "./types";
import {
    boResultContainer,
    boResultValueContainer,
    boResultValueLabelContainer,
    boResultValuesContainer,
} from "~/styles";

export const BeneficialOwnerResult: React.FC<T_BeneficialOwnerResultProps> = ({
    fieldArray,
}) => {
    return (
        <Container className={boResultContainer}>
            {fieldArray.map((item, index) => (
                <Container key={`${index}-${item.fieldname}`} className={boResultValuesContainer}>
                    <Text className={boResultValueLabelContainer}>{item.label}</Text>
                    <Text className={boResultValueContainer}>{item.value}</Text>
                </Container>
            ))}
        </Container>
    );
};

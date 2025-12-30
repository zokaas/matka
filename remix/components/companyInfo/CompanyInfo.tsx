import React from "react";
import {
    companyInfoContainerStyle,
    companyInfoGridStyle,
    companyInfoLabelStyle,
    companyInfoStyle,
} from "~/styles";
import { Container } from "@ui/container";
import { Info } from "@ui/info";
import { Text } from "@ui/text";
import { T_CompanyInfo } from "~/types";

export const CompanyInfo: React.FC<T_CompanyInfo> = ({
    companyName,
    companyNameLabel,
    orgNumber,
    orgNumberLabel,
}) => {
    return (
        <Container className={companyInfoContainerStyle}>
            <Info className={companyInfoGridStyle}>
                <Container>
                    <Text className={companyInfoLabelStyle}>{companyNameLabel}</Text>
                    <Text className={companyInfoStyle}>{companyName}</Text>
                </Container>
                <Container>
                    <Text className={companyInfoLabelStyle}>{orgNumberLabel}</Text>
                    <Text className={companyInfoStyle}>{orgNumber}</Text>
                </Container>
            </Info>
        </Container>
    );
};

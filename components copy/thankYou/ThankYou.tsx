import React from "react";
import { StatusLayout } from "apps/kyc/components";
import { Text } from "@ui/text";
import { statusPageBodyText, statusPageContainer, statusPageHeader } from "~/styles";
import { Container } from "@ui/container";

export const ThankYou: React.FC = () => {
    return (
        <StatusLayout>
            <Container className={statusPageContainer}>
                <Text className={statusPageHeader}>Thank you!</Text>
                <Text className={statusPageBodyText}>Form sent! You can close the window.</Text>
            </Container>
        </StatusLayout>
    );
};

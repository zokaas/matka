import { Container, Font } from "@opr-finance/styled-components";
import { sideNavigationStyles } from "@opr-finance/themes/sweden-foretagslan-application/componentsStyles";
import { T_SideNavigationContentProps } from "./types";
import { ItemIcon } from "./ItemIcon";
import { Scroll } from "../Scroll/Scroll";

const applicationStages = [
    { label: "basicInfo", title: "Låneuppgifter" },
    { label: "companyInfo", title: "Företagsuppgifter" },
    { label: "applicantInfo", title: "Sökandeuppgifter" },
    { label: "guarantorInfo", title: "Borgensuppgifter" },
    { label: "secondGuarantorInfo", title: "Uppgifter till ytterligare en borgensman" },
    { label: "attachments", title: "Ladda upp dokument" },
    { label: "verification", title: "Förhandsgranska och skicka ansökan" },
];

export const SideBar = ({
    secondGuarantorVisible,
    currentForm,
    validForms,
    blurredForms,
    applicationPreviewVisible,
}: T_SideNavigationContentProps) => {
    return (
        <Container styles={sideNavigationStyles.sideNavigationContainer}>
            <Container styles={sideNavigationStyles.headingContainer}>
                <Font styles={sideNavigationStyles.heading}>Följ dina steg i ansökan:</Font>
            </Container>

            {applicationStages.map((item, index) => {
                return !secondGuarantorVisible && item.label === "secondGuarantorInfo" ? null : (
                    <Container
                        key={`stage-${index + 1}`}
                        styles={sideNavigationStyles.itemContainer}>
                        <Container styles={sideNavigationStyles.itemContentContainer}>
                            <Container styles={sideNavigationStyles.itemIconContainer}>
                                <ItemIcon
                                    name={item.label}
                                    currentForm={currentForm}
                                    validForms={validForms}
                                    blurredForms={blurredForms}
                                />
                            </Container>
                            <Container styles={sideNavigationStyles.itemHeadingContainer}>
                                <Container styles={sideNavigationStyles.itemHeadingBox}>
                                    {!applicationPreviewVisible && item.label === "verification" ? (
                                        <Font styles={sideNavigationStyles.itemHeading}>
                                            {item.title}
                                        </Font>
                                    ) : (
                                        <Scroll
                                            to={item.label}
                                            styles={sideNavigationStyles.itemHeadingLink}
                                            offset={-100}>
                                            {item.title}
                                        </Scroll>
                                    )}
                                </Container>
                            </Container>
                        </Container>
                    </Container>
                );
            })}
            <Container styles={sideNavigationStyles.itemContainer}>
                <Container styles={sideNavigationStyles.itemContentContainerLast}>
                    <Container styles={sideNavigationStyles.itemIconContainer} />
                </Container>
            </Container>
        </Container>
    );
};

import { Container, Font } from "@opr-finance/styled-components";
import { useLocation } from "react-router-dom";
import { T_PreviewProps, T_ObjectProps } from "./preview.types";
import {
    applicationPageStyles,
    previewPageStyles,
} from "@opr-finance/themes/sweden-foretagslan-application/pageStyles";
import { T_AttachmentFileObject, T_LocationState } from "../../types";
import { isKYCServiceEnabled } from "../../utils";

export const PreviewBlock = (props: T_PreviewProps) => {
    const location = useLocation();
    const state = location.state as T_LocationState | undefined;
    let basicInfo: T_ObjectProps = [];
    let companyInfo: T_ObjectProps = [];
    let applicantInfo: T_ObjectProps = [];
    let guarantorInfo: T_ObjectProps = [];
    let secondGuarantorInfo: T_ObjectProps = [];

    if (state?.fields) {
        const {
            organizationNumber,
            companyName,
            loanAmount,
            repaymentPeriod,
            loanPurpose,
            loanPurposeDescription,
            campaignCode,
            businessSector,
            streetAddress,
            zipCode,
            city,
            disburismentAccount,
            applicantName,
            ssn,
            emailAddress,
            applicantPhone,
            PEP,
            guarantorName,
            guarantorEmail,
            guarantorPhone,
            secondGuarantorName,
            secondGuarantorEmail,
            secondGuarantorPhone,
            invoiceDueDate,
        } = state.fields;

        const guarantorsCount = state.secondGuarantorVisible ? 2 : 1;
        const beginsWith12 = [1, 2, 21, 22];
        const dueDateSuffix = () => {
            if (invoiceDueDate && beginsWith12.includes(invoiceDueDate)) return ":a varje månad";
            return ":e varje månad";
        };

        basicInfo = [
            { label: "Lånebelopp", value: loanAmount, unit: "SEK" },
            { label: "Återbetalningstid", value: repaymentPeriod },
            { label: "Förfallodatum för fakturor", value: invoiceDueDate, unit: dueDateSuffix() },
            { label: "Antal borgensmän", value: guarantorsCount },
            ...(!isKYCServiceEnabled()
                ? [
                      { label: "Syfte med lånet", value: loanPurpose },
                      {
                          label: "Vänligen förklara mer ingående vad lånet är avsett för",
                          value: loanPurposeDescription,
                      },
                      { label: "Verksamhetsbeskrivning ", value: businessSector },
                  ]
                : []),
            { label: "Kampanjkod", value: campaignCode },
        ];
        companyInfo = [
            { label: "Organisationsnummer", value: organizationNumber },
            { label: "Företagsnamn", value: companyName },
            { label: "Adress", value: streetAddress },
            { label: "Postnummer", value: zipCode },
            { label: "Ort", value: city },
            { label: "Kontonummer", value: disburismentAccount },
        ];
        applicantInfo = [
            { label: "Namn", value: applicantName },
            { label: "Personnummer", value: ssn },
            { label: "Mailadress", value: emailAddress },
            { label: "Telefonnummer", value: applicantPhone },
            ...(!isKYCServiceEnabled() ? [{ label: "PEP", value: PEP }] : []),
        ];

        guarantorInfo = [
            { label: "Namn", value: guarantorName },
            { label: "Mailadress", value: guarantorEmail },
            { label: "Telefonnummer", value: guarantorPhone },
        ];
        secondGuarantorInfo = [
            { label: "Namn", value: secondGuarantorName },
            { label: "Mailadress", value: secondGuarantorEmail },
            { label: "Telefonnummer", value: secondGuarantorPhone },
        ];
    }

    const displayValue = (value: string | boolean): string => {
        if (typeof value === "boolean") {
            return value ? "Agreed" : "Disagreed";
        } else {
            return value;
        }
    };

    return (
        <Container styles={applicationPageStyles.formBlock}>
            <Container styles={previewPageStyles.previewBlock}>
                <Font styles={applicationPageStyles.blockHeading}>Låneuppgifter</Font>
                <Container styles={previewPageStyles.previewBlockBody}>
                    {basicInfo.map((row: any, index: any) => {
                        return (
                            <Container
                                key={`basicinfo-${row.label}`}
                                styles={previewPageStyles.previewRow}>
                                <Container styles={previewPageStyles.previewCellLeft}>
                                    <Font styles={previewPageStyles.previewText}>{row.label}</Font>
                                </Container>
                                <Container styles={previewPageStyles.previewCellRight}>
                                    <Font styles={previewPageStyles.previewText}>{`${row.value} ${
                                        row.unit ? row.unit : ""
                                    }`}</Font>
                                </Container>
                            </Container>
                        );
                    })}
                </Container>
            </Container>
            <Container styles={previewPageStyles.previewBlock}>
                <Font styles={applicationPageStyles.blockHeading}>Företagsuppgifter </Font>
                <Container styles={previewPageStyles.previewBlockBody}>
                    {companyInfo.map((row: any, index: any) => {
                        return (
                            <Container
                                key={`company-${row.label}`}
                                styles={previewPageStyles.previewRow}>
                                <Container styles={previewPageStyles.previewCellLeft}>
                                    <Font styles={previewPageStyles.previewText}>{row.label}</Font>
                                </Container>
                                <Container styles={previewPageStyles.previewCellRight}>
                                    <Font styles={previewPageStyles.previewText}>{row.value}</Font>
                                </Container>
                            </Container>
                        );
                    })}
                </Container>
            </Container>
            <Container styles={previewPageStyles.previewBlock}>
                <Font styles={applicationPageStyles.blockHeading}>Sökandeuppgifter</Font>
                <Container styles={previewPageStyles.previewBlockBody}>
                    {applicantInfo.map((row: any, index: any) => {
                        return (
                            <Container
                                key={`applicant-${row.label}`}
                                styles={previewPageStyles.previewRow}>
                                <Container styles={previewPageStyles.previewCellLeft}>
                                    <Font styles={previewPageStyles.previewText}>{row.label}</Font>
                                </Container>
                                <Container styles={previewPageStyles.previewCellRight}>
                                    <Font styles={previewPageStyles.previewText}>
                                        {displayValue(row.value)}
                                    </Font>
                                </Container>
                            </Container>
                        );
                    })}
                </Container>
            </Container>
            <Container styles={previewPageStyles.previewBlock}>
                <Font styles={applicationPageStyles.blockHeading}>Uppgifter om borgensman</Font>
                <Container styles={previewPageStyles.previewBlockBody}>
                    {guarantorInfo.map((row: any, index: any) => {
                        if (state?.fields?.guarantorName) {
                            if (row.Label === "Personnummer") return false;
                        }
                        return (
                            <Container
                                key={`guarantor-${row.label}`}
                                styles={previewPageStyles.previewRow}>
                                <Container styles={previewPageStyles.previewCellLeft}>
                                    <Font styles={previewPageStyles.previewText}>{row.label}</Font>
                                </Container>
                                <Container styles={previewPageStyles.previewCellRight}>
                                    <Font styles={previewPageStyles.previewText}>{row.value}</Font>
                                </Container>
                            </Container>
                        );
                    })}
                </Container>
            </Container>
            {state?.secondGuarantorVisible ? (
                <Container styles={previewPageStyles.previewBlock}>
                    <Font styles={applicationPageStyles.blockHeading}>
                        Ytterligare en borgensman
                    </Font>
                    <Container styles={previewPageStyles.previewBlockBody}>
                        {secondGuarantorInfo.map((row: any, index: any) => {
                            return (
                                <Container
                                    key={`2ndguarantor-${row.label}`}
                                    styles={previewPageStyles.previewRow}>
                                    <Container styles={previewPageStyles.previewCellLeft}>
                                        <Font styles={previewPageStyles.previewText}>
                                            {row.label}
                                        </Font>
                                    </Container>
                                    <Container styles={previewPageStyles.previewCellRight}>
                                        <Font styles={previewPageStyles.previewText}>
                                            {row.value}
                                        </Font>
                                    </Container>
                                </Container>
                            );
                        })}
                    </Container>
                </Container>
            ) : null}

            <Container styles={previewPageStyles.previewBlock}>
                <Font styles={applicationPageStyles.blockHeading}>Bilagor</Font>
                <Container styles={previewPageStyles.previewBlockBody}>
                    {state?.fields?.attachments && state?.fields?.attachments.length > 0 ? (
                        state?.fields?.attachments.map(
                            (row: T_AttachmentFileObject, index: number) => {
                                return (
                                    <Font
                                        key={`attachment-${row.name}`}
                                        styles={previewPageStyles.previewText}>
                                        {row.name}
                                    </Font>
                                );
                            }
                        )
                    ) : (
                        <Font styles={previewPageStyles.previewText}>Inga bilagor</Font>
                    )}
                </Container>
            </Container>
        </Container>
    );
};

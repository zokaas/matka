import { useIntl } from "react-intl";
import { useSelector } from "react-redux";

import { StyledGrid } from "@opr-finance/component-grid";
import { StyledPageTitle } from "@opr-finance/component-content";
import { TopupPageStyles, ButtonStyles, ModalStyles } from "@opr-finance/theme-flex-online";
import { Font } from "@opr-finance/component-fonts";

import { currency, CurrencyFormat, CurrencyLocale } from "@opr-finance/component-currency";
import { Icon } from "@opr-finance/component-icon";
import { StyledButton } from "@opr-finance/component-button";

import { ConsoleLogger, LOG_LEVEL } from "@opr-finance/feature-console-logger";

import { AppState, E_Routes } from "../../types/general";
import { messages } from "./messages";
import { formatOrgNumSwe, history } from "@opr-finance/utils";
import { components } from "@opr-finance/api-definitions";
import { mapCompanyDataForKyc, startKyc } from "../../utils";
import { T_IndividualGuarantor } from "@opr-finance/feature-sme-customer/src/types/application";
import { T_CompanyKycParams } from "../../types/kyc";

export function ApplicationPage(props) {
    const logger = new ConsoleLogger({ level: LOG_LEVEL });
    const { formatMessage: fm } = useIntl();

    const application = useSelector((state: AppState) => state.customer.application.application);
    const company = useSelector((state: AppState) => state.customer.companyInfo.info);
    const session = useSelector((state: AppState) => state.session);

    if (!application || !company || !session) return;
    const { extras, guarantees, dynamicFields } = application;

    const guarantor = guarantees?.[0]?.guarantor as T_IndividualGuarantor;

    const { organizationNumber, companyName } = company;
    const { industryCode } = dynamicFields?.kyc || "";

    const companyData: T_CompanyKycParams = mapCompanyDataForKyc({
        organizationNumber,
        companyName,
        industryCode,
    });

    const formattedCurrency = (value: number | string | undefined) => {
        return currency({
            value: value,
            minimumFractionDigits: 0,
            locale: CurrencyLocale.Sweden,
            currency: CurrencyFormat.Sweden,
        });
    };

    const handleStartKyc = async () => {
        logger.log("Start KYC flow");
        const started = await startKyc(companyData, session);
        console.log("started? ", started);
        if (!started) {
            console.log("flow not started");
            history.push(E_Routes.ERROR);
            return;
        }
    };

    return (
        <StyledGrid styleConfig={{ root: TopupPageStyles.topupPageRootStyles() }}>
            <StyledGrid styleConfig={{ root: TopupPageStyles.topupPageRootStyles() }}>
                <StyledPageTitle
                    title={"Title"}
                    styleConfig={{
                        pageTitleContainer: props.styleConfig.titleBox,
                        pageTitleText: props.styleConfig.pageTitle,
                    }}
                />
                <StyledGrid styleConfig={{ root: TopupPageStyles.applicationContainer() }}>
                    <Font styleConfig={{ root: TopupPageStyles.formTitle() }}>{"Heading"}</Font>
                    <Font styleConfig={{ root: TopupPageStyles.formDescription() }}>
                        {"Page Description"}
                    </Font>

                    <StyledGrid styleConfig={{ root: TopupPageStyles.formItemContainer() }}>
                        <Font styleConfig={{ root: TopupPageStyles.formLabel() }}>
                            {"Created Date"}
                        </Font>
                        <Font styleConfig={{ root: TopupPageStyles.userInfo() }}>
                            {application.createDate}
                        </Font>
                    </StyledGrid>

                    <StyledGrid styleConfig={{ root: TopupPageStyles.formSection() }}>
                        <Font styleConfig={{ root: TopupPageStyles.sectionTitle() }}>
                            {"Uppgifter om krediten"}
                        </Font>
                        <StyledGrid styleConfig={{ root: TopupPageStyles.formItemContainer() }}>
                            <Font styleConfig={{ root: TopupPageStyles.formLabel() }}>
                                {"Kreditgräns"}
                            </Font>
                            <Font styleConfig={{ root: TopupPageStyles.userInfo() }}>
                                {formattedCurrency(application.desiredAmount)}
                            </Font>
                        </StyledGrid>
                        <StyledGrid styleConfig={{ root: TopupPageStyles.formItemContainer() }}>
                            <Font styleConfig={{ root: TopupPageStyles.formLabel() }}>
                                {"Lånesyfte"}
                            </Font>
                            <Font styleConfig={{ root: TopupPageStyles.userInfo() }}>
                                {application.loanReasonText}
                            </Font>
                        </StyledGrid>
                        <StyledGrid styleConfig={{ root: TopupPageStyles.formItemContainer() }}>
                            <Font styleConfig={{ root: TopupPageStyles.formLabel() }}>
                                {"Lånesyfte description"}
                            </Font>
                            <Font styleConfig={{ root: TopupPageStyles.userInfo() }}>
                                {extras?.purposeOfCreditDescription ?? ""}
                            </Font>
                        </StyledGrid>
                    </StyledGrid>
                    <StyledGrid styleConfig={{ root: TopupPageStyles.formSection() }}>
                        <Font styleConfig={{ root: TopupPageStyles.sectionTitle() }}>
                            {"Uppgifter om företaget"}
                        </Font>
                        <StyledGrid styleConfig={{ root: TopupPageStyles.formItemContainer() }}>
                            <Font styleConfig={{ root: TopupPageStyles.formLabel() }}>
                                {"Företagets namn"}
                            </Font>
                            <Font styleConfig={{ root: TopupPageStyles.userInfo() }}>
                                {companyName}
                            </Font>
                        </StyledGrid>
                        <StyledGrid styleConfig={{ root: TopupPageStyles.formItemContainer() }}>
                            <Font styleConfig={{ root: TopupPageStyles.formLabel() }}>
                                {"Organisationsnummer"}
                            </Font>
                            <Font styleConfig={{ root: TopupPageStyles.userInfo() }}>
                                {formatOrgNumSwe(organizationNumber)}
                            </Font>
                        </StyledGrid>
                        <StyledGrid styleConfig={{ root: TopupPageStyles.formItemContainer() }}>
                            <Font styleConfig={{ root: TopupPageStyles.formLabel() }}>
                                {"Företagets månadsomsättning"}
                            </Font>
                            <Font styleConfig={{ root: TopupPageStyles.userInfo() }}>
                                {formattedCurrency(extras?.turnover) ?? ""}
                            </Font>
                        </StyledGrid>
                    </StyledGrid>
                    <StyledGrid styleConfig={{ root: TopupPageStyles.formSection() }}>
                        <Font styleConfig={{ root: TopupPageStyles.sectionTitle() }}>
                            {"Uppgifter om sökanden"}
                        </Font>
                        <StyledGrid styleConfig={{ root: TopupPageStyles.formItemContainer() }}>
                            <Font styleConfig={{ root: TopupPageStyles.formLabel() }}>
                                {"Personnummer"}
                            </Font>
                            <Font styleConfig={{ root: TopupPageStyles.userInfo() }}>
                                {guarantor ? guarantor.reference : ""}
                            </Font>
                        </StyledGrid>
                        <StyledGrid styleConfig={{ root: TopupPageStyles.formItemContainer() }}>
                            <Font styleConfig={{ root: TopupPageStyles.formLabel() }}>
                                {"Förnamn"}
                            </Font>
                            <Font styleConfig={{ root: TopupPageStyles.userInfo() }}>
                                {guarantor ? guarantor.givenName : null}
                            </Font>
                        </StyledGrid>
                        <StyledGrid styleConfig={{ root: TopupPageStyles.formItemContainer() }}>
                            <Font styleConfig={{ root: TopupPageStyles.formLabel() }}>
                                {"Efternamn"}
                            </Font>
                            <Font styleConfig={{ root: TopupPageStyles.userInfo() }}>
                                {guarantor ? guarantor.surname : null}
                            </Font>
                        </StyledGrid>
                        <StyledGrid styleConfig={{ root: TopupPageStyles.formItemContainer() }}>
                            <Font styleConfig={{ root: TopupPageStyles.formLabel() }}>
                                {"Email"}
                            </Font>
                            <Font styleConfig={{ root: TopupPageStyles.userInfo() }}>
                                {application.notificationEmail}
                            </Font>
                        </StyledGrid>

                        <StyledGrid styleConfig={{ root: TopupPageStyles.formItemContainer() }}>
                            <Font styleConfig={{ root: TopupPageStyles.formLabel() }}>
                                {"Telefonnummer"}
                            </Font>
                            <Font styleConfig={{ root: TopupPageStyles.userInfo() }}>
                                {application.notificationMobileNumber}
                            </Font>
                        </StyledGrid>
                        <StyledGrid styleConfig={{ root: TopupPageStyles.formItemContainer() }}>
                            <Font styleConfig={{ root: TopupPageStyles.formLabel() }}>
                                {"Kampanjkod"}
                            </Font>
                            <Font styleConfig={{ root: TopupPageStyles.userInfo() }}>
                                {extras?.campaignCode ?? ""}
                            </Font>
                        </StyledGrid>
                        <StyledGrid styleConfig={{ root: TopupPageStyles.formItemContainer() }}>
                            <Font styleConfig={{ root: TopupPageStyles.formLabel() }}>
                                {"isPEP"}
                            </Font>
                            <Font styleConfig={{ root: TopupPageStyles.userInfo() }}>
                                {extras?.isPep ?? "Nej"}
                            </Font>
                        </StyledGrid>
                        <StyledGrid styleConfig={{ root: TopupPageStyles.formItemContainer() }}>
                            <Font styleConfig={{ root: TopupPageStyles.formLabel() }}>
                                {"Credit Check"}
                            </Font>
                            <Font styleConfig={{ root: TopupPageStyles.userInfo() }}>
                                {extras?.allowCreditCheck === "true" ? "Ja" : "Nej"}
                            </Font>
                        </StyledGrid>
                    </StyledGrid>
                </StyledGrid>

                <StyledGrid styleConfig={{ root: TopupPageStyles.bottomContainer() }}>
                    <StyledButton
                        onClick={handleStartKyc}
                        styleConfig={{
                            root: ButtonStyles.greenButtonStyles({ marginTop: "10px" }),
                        }}>
                        <Font styleConfig={{ root: ButtonStyles.buttonFontStyles() }}>
                            {"Go to KYC"} <Icon icon={["fa", "angle-double-right"]} />{" "}
                        </Font>
                    </StyledButton>
                </StyledGrid>
            </StyledGrid>
        </StyledGrid>
    );
}

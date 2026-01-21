import { useIntl } from "react-intl";
import { useSelector, useDispatch } from "react-redux";

import { StyledGrid } from "@opr-finance/component-grid";
import { StyledPageTitle } from "@opr-finance/component-content";
import { TopupPageStyles, ButtonStyles } from "@opr-finance/theme-flex-online";
import { Font } from "@opr-finance/component-fonts";
import { currency, CurrencyFormat, CurrencyLocale } from "@opr-finance/component-currency";
import { Icon } from "@opr-finance/component-icon";
import { StyledButton } from "@opr-finance/component-button";
import { kycActions } from "@opr-finance/feature-kyc";
import { formatOrgNumSwe } from "@opr-finance/utils";

import { AppState } from "../../types/general";
import { messages } from "./messages";
import { kycFlow } from "../../types/kyc";
import { ApplicationPageProps } from "./types";

export function ApplicationPage(props: ApplicationPageProps) {
    const { formatMessage: fm } = useIntl();
    const dispatch = useDispatch();

    const application = useSelector((state: AppState) => state.customer.application.application);
    const company = useSelector((state: AppState) => state.customer.companyInfo.info);
    const session = useSelector((state: AppState) => state.session);
    const smeId = useSelector((state: AppState) => state.customer.engagement.activeSmeId) ?? "";
    const isKycLoading = useSelector((state: AppState) => state.kyc.isLoading);

    if (!application || !company || !session) return null;

    const { organizationNumber, companyName } = company;
    const applicationId = application.id ?? "";

    const formattedCurrency = (value: number | string | undefined) => {
        return currency({
            value: value,
            minimumFractionDigits: 0,
            locale: CurrencyLocale.Sweden,
            currency: CurrencyFormat.Sweden,
        });
    };

    const handleStartKyc = () => {
        dispatch(
            kycActions.kycStartFlowTrigger({
                applicationId,
                smeId,
                companyId: organizationNumber,
                flow: kycFlow.NEW_CUSTOMER,
            })
        );
    };

    return (
        <StyledGrid styleConfig={{ root: TopupPageStyles.topupPageRootStyles() }}>
            <StyledPageTitle
                title={fm(messages.pageTitle)}
                styleConfig={{
                    pageTitleContainer: props.styleConfig.titleBox,
                    pageTitleText: props.styleConfig.pageTitle,
                }}
            />
            <StyledGrid styleConfig={{ root: TopupPageStyles.applicationContainer() }}>
                <Font styleConfig={{ root: TopupPageStyles.formDescription() }}>
                    {fm(messages.description)}
                </Font>

                <StyledGrid styleConfig={{ root: TopupPageStyles.formItemContainer() }}>
                    <Font styleConfig={{ root: TopupPageStyles.formLabel() }}>
                        {fm(messages.createdDate)}
                    </Font>
                    <Font styleConfig={{ root: TopupPageStyles.userInfo() }}>
                        {application.createDate}
                    </Font>
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
                </StyledGrid>
            </StyledGrid>

            <StyledGrid styleConfig={{ root: TopupPageStyles.bottomContainer() }}>
                <StyledButton
                    onClick={handleStartKyc}
                    disabled={isKycLoading}
                    styleConfig={{
                        root: ButtonStyles.greenButtonStyles({ marginTop: "10px" }),
                    }}>
                    <Font styleConfig={{ root: ButtonStyles.buttonFontStyles() }}>
                        {isKycLoading ? "Laddar..." : fm(messages.button)}{" "}
                        {!isKycLoading && <Icon icon={["fa", "angle-double-right"]} />}
                    </Font>
                </StyledButton>
            </StyledGrid>
        </StyledGrid>
    );
}

import { useState, useEffect } from "react";
import { useIntl } from "react-intl";
import { useSelector, useDispatch } from "react-redux";
import { Redirect, useLocation } from "react-router-dom";

import { StyledGrid } from "@opr-finance/component-grid";
import { StyledPageTitle } from "@opr-finance/component-content";
import { Image } from "@opr-finance/component-image";
import {
    FrontPageStyles,
    ButtonStyles,
    ModalStyles,
    FontsStyles,
    StartPageStyles,
} from "@opr-finance/theme-flex-online";
import { add, remove } from "@opr-finance/utils";
import { Scroll } from "@opr-finance/component-scroll";
import { Font } from "@opr-finance/component-fonts";
import { StyledButton } from "@opr-finance/component-button";
import { Icon } from "@opr-finance/component-icon";
import { E_AllowedAccountStates } from "@opr-finance/feature-account";
import { ConsoleLogger, LOG_LEVEL } from "@opr-finance/feature-console-logger";
import { smeDocumentActions } from "@opr-finance/feature-document";

import { selectOverdueDays, selectUnpaidAmount, selectNotPaidStatements } from "../../selectors";
import { FrontPageProps } from "./types";
import currencyImage from "../../images/OPR-Foretagslan-Flex-ut.svg";
import { messages } from "./messages";
import { AppState, E_Routes } from "../../types/general";
import { AccountDetailBlock } from "../../components/AccountDetailBlock/AccountDetailBlock";
import { NewsBlock } from "../../components/NewsBlock/NewsBlock";
import { WithdrawBlock } from "../../components/WithdrawBlock/WithdrawBlock";
import { CollectionBlock } from "../../components/CollectionBlock";
import { KycModal } from "../../components/KycModal";
import { KycStatusResult } from "../../components/KycModal/types";
import {
    onComponentMounted,
    mapCompanyDataForKyc,
    startKyc,
    history,
    checkKycStatus,
    clearKycModalDismissal,
    dismissKycModal,
    shouldBlockWithdrawal,
} from "../../utils";
import { kycFlow, T_CompanyKycParams } from "../../types/kyc";
import { FeatureNoticesState, NoticesFields } from "@opr-finance/feature-contentful/src/types/contentful";
import { Notice } from "../../components/Notice";

const logger = new ConsoleLogger({ level: LOG_LEVEL });

type LocationState = {
    component: string;
};

export function FrontPage(props: FrontPageProps) {
    const dispatch = useDispatch();
    const location = useLocation<LocationState>();
    const { formatMessage: fm } = useIntl();
    const { notices } = useSelector((state: FeatureNoticesState) => state?.notices);

    const component = location.state && location.state.component;

    const documentInUse = process.env.REACT_APP_DISPLAY_DOCUMENTS === "1" ? true : false;
    const { authenticated, logoutInProgress } = useSelector((state: AppState) => state.session);
    const accountState = useSelector((state: AppState) => state.account.accountState);
    const { defaultPromissoryNoteId, activeAccountId, token, gwUrl, mockApiCalls } = useSelector(
        (state: AppState) => state.document.config
    );

    const account = useSelector((state: AppState) => {
        return state.account.account;
    });

    const boardMemberId = useSelector((state: AppState) => {
        return state.customer?.companyInfo?.boardmembers
            ? state.customer?.companyInfo?.boardmembers[0].id
            : "";
    });

    const notPaid = useSelector(selectNotPaidStatements);
    const overdueDays = useSelector(selectOverdueDays);
    const unpaidAmount = useSelector(selectUnpaidAmount);

    // KYC state management
    const kycState = useSelector((state: AppState) => state.kyc);
    const company = useSelector((state: AppState) => state.customer.companyInfo.info);
    const session = useSelector((state: AppState) => state.session);
    const [showKycModal, setShowKycModal] = useState(false);
    const [kycStatus, setKycStatus] = useState<KycStatusResult>(checkKycStatus(kycState));

    useEffect(() => {
        const status = checkKycStatus(kycState);
        setKycStatus(status);

        // Don't auto-open modal if previously dismissed
        // Modal can be manually opened via the KYC button
    }, [kycState]);
    // Withdraw form state
    const [isWithdrawn, setIsWithdrawn] = useState(false);
    const [applicationData, setApplicationData] = useState<{ withdrawnAmount: string }>({
        withdrawnAmount: "0",
    });

    const [validForms, setValidForms] = useState<string[]>(() => {
        const defaultValids: string[] = ["withdrawnForm"];
        return defaultValids;
    });

    useEffect(() => {
        onComponentMounted(boardMemberId);
    }, []);

    useEffect(() => {
        const status = checkKycStatus(kycState);
        setKycStatus(status);

        // Auto-open modal only if overdue
        if (status.isOverdue && status.shouldShowModal) {
            setShowKycModal(true);
        }
    }, [kycState]);

    useEffect(() => {
        if (component && component === "withdraw") {
            window.scrollTo({ top: 500, behavior: "smooth" });
        }
    });

    function handleChange(isValid, formName, form) {
        if (isValid) {
            setValidForms(add(validForms, formName));
        } else {
            setValidForms(remove(validForms, formName, (a, b) => a === b));
        }

        setApplicationData({
            ...applicationData,
            ...form,
        });
    }

    const handleClick = () => {
        dispatch(
            smeDocumentActions.smeFetchDocumentTrigger({
                token,
                gwUrl,
                mockApiCalls,
                accountId: activeAccountId,
                documentId: defaultPromissoryNoteId,
            })
        );
    };

    const handleCloseKycModal = () => {
        dismissKycModal();
        setShowKycModal(false);
    };

    const handleOpenKycModal = () => {
        clearKycModalDismissal();
        setShowKycModal(true);
    };

    const handleStartKyc = async () => {
        logger.log("Starting KYC flow from FrontPage");

        if (!company) {
            logger.error("Company info not available");
            history.push(E_Routes.ERROR);
            return;
        }

        const { organizationNumber, companyName, dynamicFields } = company;
        const { industryCode } = dynamicFields?.kyc || "";

        const companyData: T_CompanyKycParams = mapCompanyDataForKyc({
            organizationNumber,
            companyName,
            industryCode,
        });

        const started = await startKyc(companyData, session, kycFlow.EXISTING_CUSTOMER);

        if (!started) {
            logger.error("Failed to start KYC flow");
            history.push(E_Routes.ERROR);
        }
    };

    const shouldShowKycButton = () => {
        if (kycState.kycDone) return false;

        const { isOverdue, daysRemaining } = kycStatus;

        return isOverdue || (daysRemaining !== null && daysRemaining <= 14);
    };

    if (!authenticated && !logoutInProgress) {
        return <Redirect to={E_Routes.ROOT} />;
    }

    if (accountState === E_AllowedAccountStates.COLLECTION) {
        return (
            <StyledGrid styleConfig={{ root: FrontPageStyles.accountCollectionMainContainer() }}>
                <CollectionBlock
                    collectionStateHeading={fm(messages.collectionStateHeading)}
                    collectionStateText={fm(messages.collectionStateText)}
                    collectionStatePhoneText={fm(messages.collectionStatePhoneText)}
                    collectionStatePhoneNumber={fm(messages.collectionStatePhoneNumber)}
                    collectionStateEmailText={fm(messages.collectionStateEmailText)}
                    collectionStateEmailLinkLink={fm(messages.collectionStateEmailLinkLink)}
                    collectionStateEmailLinkText={fm(messages.collectionStateEmailLinkText)}
                    defaultPromissoryNoteId={defaultPromissoryNoteId}
                    handleClick={handleClick}
                    documentInUse={documentInUse}
                />
            </StyledGrid>
        );
    }

    const availableCreditLimit = account?.availableCreditLimit;
    const isWithdrawalBlocked = shouldBlockWithdrawal(kycState);

    return (
        <StyledGrid styleConfig={{ root: FrontPageStyles.frontPageRootStyles() }}>
            <StyledPageTitle
                title={fm(messages.frontPageTitle)}
                styleConfig={{
                    pageTitleContainer: props.styleConfig.titleBox,
                    pageTitleText: props.styleConfig.pageTitle,
                }}
            />

            {shouldShowKycButton() && (
                <StyledGrid
                    styleConfig={{
                        root: {
                            marginBottom: "20px",
                            display: "flex",
                            justifyContent: "center",
                        },
                    }}>
                    <StyledButton
                        onClick={handleOpenKycModal}
                        styleConfig={{
                            root: ButtonStyles.greenButtonStyles(),
                        }}>
                        <Font styleConfig={{ root: ButtonStyles.buttonFontStyles() }}>
                            {fm(messages.kycUpdateButton)}{" "}
                            <Icon icon={["fa", "angle-double-right"]} />
                        </Font>
                    </StyledButton>
                </StyledGrid>
            )}

            <KycModal
                isOpen={showKycModal}
                kycStatus={kycStatus}
                kycDueDate={kycState.kycDueDate}
                onClose={handleCloseKycModal}
                onStartKyc={handleStartKyc}
                styleConfig={{
                    modalCloseIcon: ModalStyles.modalCloseIcon(),
                    modalOverlay: ModalStyles.modalOverlay(),
                    modalContent: ModalStyles.modalContentScroll({ height: ["fit-content"] }),
                    modalTitle: ModalStyles.modalTitle(),
                    titleText: ModalStyles.titleText(),
                    contentText: FontsStyles.fontContentText(),
                    dateText: {
                        ...FontsStyles.fontContentText(),
                        marginTop: "16px",
                        fontWeight: "bold",
                    },
                    buttonContainer: FrontPageStyles.creditRaiseInfoColumn(),
                    primaryButton: ButtonStyles.greenButtonStyles({ width: "100%" }),
                    secondaryButton: ButtonStyles.grayButtonStyles({ width: "100%" }),
                    buttonText: ButtonStyles.buttonFontStyles(),
                }}
            />

            <Scroll to="withdraw-section">
                <StyledGrid styleConfig={{ root: props.styleConfig.nostoContainer }}>
                    <Image
                        imageAlt="currency sign"
                        imageSrc={currencyImage}
                        styleConfig={{ root: props.styleConfig.nostoImage }}></Image>
                    <Font styleConfig={{ root: props.styleConfig.nostoText }}>
                        {fm(messages.withdrawButtonText)}
                    </Font>
                </StyledGrid>
            </Scroll>

            <StyledGrid styleConfig={{ root: props.styleConfig.mainContentContainer }}>
                <AccountDetailBlock />
                <NewsBlock />
                <WithdrawBlock
                    availableCreditLimit={availableCreditLimit}
                    overdueDays={overdueDays}
                    unpaidAmount={unpaidAmount}
                    accountState={account?.state}
                    blockedStatus={account?.blockedStatus || isWithdrawalBlocked}
                    handleChange={handleChange}
                />
            </StyledGrid>
        </StyledGrid>
    );
}

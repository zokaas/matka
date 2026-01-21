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
} from "@opr-finance/theme-flex-online";
import { add, remove } from "@opr-finance/utils";
import { Scroll } from "@opr-finance/component-scroll";
import { Font } from "@opr-finance/component-fonts";
import { E_AllowedAccountStates } from "@opr-finance/feature-account";
import { kycActions } from "@opr-finance/feature-kyc";

import {
    selectOverdueDays,
    selectUnpaidAmount,
    selectCompanyId,
    selectAccountApplicationId,
} from "../../selectors";
import { FrontPageProps } from "./types";
import currencyImage from "../../images/OPR-Foretagslan-Flex-ut.svg";
import { messages } from "./messages";
import { AppState, E_Routes } from "../../types/general";
import { AccountDetailBlock } from "../../components/AccountDetailBlock/AccountDetailBlock";
import { NewsBlock } from "../../components/NewsBlock/NewsBlock";
import { WithdrawBlock } from "../../components/WithdrawBlock/WithdrawBlock";
import { CollectionBlock } from "../../components/CollectionBlock";
import { smeDocumentActions } from "@opr-finance/feature-document";
import { KycModal } from "../../components/KycModal";
import {
    onComponentMounted,
    checkKycStatus,
    dismissKycModal,
    shouldBlockWithdrawal,
    shouldShowKycModal,
} from "../../utils";
import { kycFlow } from "../../types/kyc";

type LocationState = {
    component: string;
};

export function FrontPage(props: FrontPageProps) {
    const dispatch = useDispatch();
    const location = useLocation<LocationState>();
    const { formatMessage: fm } = useIntl();

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

    const overdueDays = useSelector(selectOverdueDays);

    const unpaidAmount = useSelector(selectUnpaidAmount);

    const kycState = useSelector((state: AppState) => state.kyc.kycStatus);

    const showKycModal = useSelector((state: AppState) => state.kyc.showModal);
    const isKycLoading = useSelector((state: AppState) => state.kyc.isLoading);

    const smeId = useSelector((state: AppState) => state.customer.engagement.activeSmeId) ?? "";
    const applicationId = useSelector(selectAccountApplicationId) ?? "";
    const companyId = useSelector(selectCompanyId);

    const [applicationData, setApplicationData] = useState<{ withdrawnAmount: string }>({
        withdrawnAmount: "0",
    });

    const [validForms, setValidForms] = useState<string[]>(() => {
        const defaultValids: string[] = ["withdrawnForm"];
        return defaultValids;
    });

    const isWithdrawalBlocked = shouldBlockWithdrawal(kycState);

    useEffect(() => {
        onComponentMounted(boardMemberId);
    }, []);

    useEffect(() => {
        if (checkKycStatus(kycState)) {
            dispatch(kycActions.showModal());
        }
    }, [kycState.kycDone]);


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

    const handleStartKyc = () => {
        dispatch(
            kycActions.kycStartFlowTrigger({
                applicationId,
                smeId,
                companyId,
                flow: kycFlow.EXISTING_CUSTOMER,
            })
        );
    };

    const handleCloseModal = () => {
        dismissKycModal();
        dispatch(kycActions.hideModal());
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

    useEffect(() => {
        if (component && component === "withdraw") {
            window.scrollTo({ top: 500, behavior: "smooth" });
        }
    });

    return (
        <StyledGrid styleConfig={{ root: FrontPageStyles.frontPageRootStyles() }}>
            <StyledPageTitle
                title={fm(messages.frontPageTitle)}
                styleConfig={{
                    pageTitleContainer: props.styleConfig.titleBox,
                    pageTitleText: props.styleConfig.pageTitle,
                }}
            />

            <KycModal
                isOpen={showKycModal}
                kycStatus={checkKycStatus(kycState)}
                isLoading={isKycLoading}
                onClose={handleCloseModal}
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
                    blockedStatus={account?.blockedStatus}
                    kycOverdue={isWithdrawalBlocked}
                    handleChange={handleChange}
                />
            </StyledGrid>
        </StyledGrid>
    );
}

import { useEffect, useState } from "react";
import * as yup from "yup";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { useHistory, Redirect } from "react-router-dom";

import { StyledGrid } from "@opr-finance/component-grid";
import { StyledPageTitle } from "@opr-finance/component-content";
import { TopupPageStyles, ButtonStyles, ModalStyles } from "@opr-finance/theme-flex-online";
import { Font } from "@opr-finance/component-fonts";
import {
    TextField,
    TextArea,
    SelectField,
    CheckboxField,
    useForm,
    getOption,
    option,
    SelectOption,
} from "@opr-finance/component-forms";
import { currency, CurrencyFormat, CurrencyLocale } from "@opr-finance/component-currency";
import { pickOff, isNumber, formatOrgNumSwe, checkTopupEligibility } from "@opr-finance/utils";
import { Icon } from "@opr-finance/component-icon";
import { StyledButton } from "@opr-finance/component-button";
import { StyledLink } from "@opr-finance/component-link-to";
import { Modal } from "@opr-finance/component-modal-dialog";
import { E_AllowedAccountStates } from "@opr-finance/feature-account";
import { ConsoleLogger, LOG_LEVEL } from "@opr-finance/feature-console-logger";

import {
    TopupPageProps,
    IncreaseCreditLimitFormData,
    IncreaseLimitApplication,
    TDataError,
} from "./types";
import { AppState, E_Routes } from "../../types/general";
import { sendTopupApplication } from "../../api/topupApplication";
import { messages } from "./messages";
import { NotEligiblePage } from "../../components/NotEligblePage/NotEligiblePage";
import { mapApplicationToLfpRequest } from "./mapApplicationToLfpRequest";
import { paymentsSinceLastTopup } from "../../selectors/paymentsSinceLastTopup";
import { onComponentMounted } from "../../utils";
import { topupRules } from "../../constants/rules";

const isRescoringAllowed = process.env.REACT_APP_IS_RESCORING_ALLOWED === "1" ? true : false;

export function TopupPage(props: TopupPageProps) {
    const logger = new ConsoleLogger({ level: LOG_LEVEL });
    const { formatMessage: fm } = useIntl();
    const history = useHistory();

    const [application, setApplication] = useState<IncreaseCreditLimitFormData>({
        newCreditLimit: "",
        allowInspection: false,
        personalInfoConsent: false,
        monthlyIncomeGross: "",
        campaignCode: "",
        loanPurpose: "",
        loanPurposeDescription: "",
    });
    const [applicationSent, setApplicationSent] = useState<boolean>(false);
    const [isValid, setIsValid] = useState<boolean>(false);
    const [modalOpen, toggleModalOpen] = useState(false);

    const { authenticated, logoutInProgress } = useSelector((state: AppState) => state.session);
    const accountState = useSelector((state: AppState) => state.account.accountState);
    const account = useSelector((state: AppState) => state.account.account);
    const invoice = useSelector((state: AppState) => state.invoices.formatted[0]);
    const { info, boardmembers } = useSelector((state: AppState) => state.customer.companyInfo);
    const payments = useSelector(paymentsSinceLastTopup);

    useEffect(() => {
        logger.log("TOP UP PAGE MOUNTED");
        onComponentMounted(boardMemberId);
    }, []);

    const creditLimit = account?.creditLimit ? account.creditLimit : 0;
    const sums: number[] = [50000, 100000, 150000, 200000];
    const validSums: SelectOption[] = sums
        .filter((sum) => {
            return sum > creditLimit;
        })
        .map((sum) => {
            return option(
                currency({
                    value: sum,
                    minimumFractionDigits: 0,
                    locale: CurrencyLocale.Sweden,
                    currency: CurrencyFormat.Sweden,
                })
            );
        });
    const amounts: SelectOption[] = [option(fm(messages.dropdownChoose)), ...validSums];

    const validAmounts: string[] = pickOff(
        amounts,
        (option: SelectOption) => option.value === fm(messages.dropdownChoose)
    ).map((option: SelectOption) => {
        return option.value;
    });

    const loanPurposeOptions = [
        option(fm(messages.dropdownChoose)),
        option(fm(messages.buyEquipment)),
        option(fm(messages.hireStaff)),
        option(fm(messages.financeDebt)),
        option(fm(messages.marketing)),
        option(fm(messages.buyInventory)),
        option(fm(messages.unexpected)),
        option(fm(messages.expansion)),
        option(fm(messages.other)),
    ];

    const validReasons: string[] = pickOff(
        loanPurposeOptions,
        (option: SelectOption) => option.value === "Välj"
    ).map((option: SelectOption) => {
        return option.value;
    });

    const schema = yup.object().shape({
        newCreditLimit: yup.string().oneOf(validAmounts, fm(messages.alertTextRequired)),
        loanPurpose: yup
            .string()
            .oneOf(validReasons, "Lånesyfte saknas")
            .required("Lånesyfte saknas"),
        loanPurposeDescription: yup
            .string()
            .min(1, "Ange en mer detaljerad beskrivning av syftet med lånet")
            .required("Ange en mer detaljerad beskrivning av syftet med lånet"),
        monthlyIncomeGross: yup.string().required(fm(messages.alertTextRequired)),
        campaignCode: yup.string().notRequired(),
        allowInspection: yup
            .boolean()
            .oneOf([true], fm(messages.alertTextRequired))
            .required(fm(messages.alertTextRequired)),
        personalInfoConsent: yup
            .boolean()
            .oneOf([true], fm(messages.alertTextRequired))
            .required(fm(messages.alertTextRequired)),
    });

    const {
        form,
        processChange,
        processFocus,
        processBlur,
        Error: FormError,
        processReset,
    } = useForm<IncreaseCreditLimitFormData>({
        initial: {
            newCreditLimit: "Välj",
            allowInspection: false,
            personalInfoConsent: false,
            monthlyIncomeGross: "",
            campaignCode: "",
            loanPurpose: "Välj",
            loanPurposeDescription: "",
        },
        schema,
        onChange: (data) => {
            setApplication(data);
            setIsValid(true);
        },
        onError: (data) => {
            setIsValid(false);
        },
        onBlur: () => {},
        onFocus: () => {},
        styleConfig: {
            formError: TopupPageStyles.formError(),
        },
    });
    const boardMember = boardmembers && boardmembers[0];
    const boardMemberId = boardMember?.id ? boardMember.id : "";
    const { givenName, surname, reference, birthDate } = boardMember || {};
    const { companyName, email, phone, organizationNumber } = info || {};

    if ((!authenticated || accountState === E_AllowedAccountStates.PENDING) && !logoutInProgress) {
        return <Redirect to={E_Routes.ROOT} />;
    }
    const checkMissingData = (): TDataError => {
        const boardMemberProperties = [givenName, surname, reference, birthDate];
        const companyInfoProperties = [email, phone];

        const isBoardMemberDataMissing = boardMemberProperties.some((property) => !property);
        const isCompanyInfoMissing = companyInfoProperties.some((property) => !property);

        if (isBoardMemberDataMissing && isCompanyInfoMissing)
            return { status: true, errorMessage: fm(messages.errorAllDataMissing) };

        if (isBoardMemberDataMissing)
            return { status: true, errorMessage: fm(messages.errorSomeDataMissing) };

        if (isCompanyInfoMissing)
            return { status: true, errorMessage: fm(messages.errorUpdateYourData) };

        return { status: false, errorMessage: "" };
    };

    const dataError: TDataError = checkMissingData();

    const disbursementAccount = account?.disbursementAccount?.externalAccountNumber;

    const orgNumber = organizationNumber ? formatOrgNumSwe(organizationNumber) : "";

    const blockedStatus = account?.blockedStatus ? account.blockedStatus : false;

    // replaced source for phone number and email to avoid errors when sending application
    // in case when phone number is missing in boardMember
    async function handleForm() {
        const data: IncreaseLimitApplication = {
            givenName: `${givenName}`,
            surName: `${surname}`,
            personalID: `${reference}`,
            birthDate: `${birthDate}`,
            email: `${email}`,
            phone: `${phone}`,
            bankAccount: `${disbursementAccount}`,
            smeId: `${info?.id}`,
            ...application,
        };

        const mappedApplication = mapApplicationToLfpRequest(data);
        const result = await sendTopupApplication(mappedApplication);

        if (result.status === (200 | 201)) {
            setApplicationSent(true);
        } else {
            history.push(E_Routes.ERROR);
        }
    }

    let formattedCurrency = (value) => {
        return currency({
            value: value,
            minimumFractionDigits: 0,
            locale: CurrencyLocale.Sweden,
            currency: CurrencyFormat.Sweden,
        });
    };

    const accountData = {
        creditLimit,
        accountState: account?.state,
        overdueDays: invoice && invoice.overdueDays,
        paidInvoicesCount: payments.length,
        blockedStatus,
    };

    const isCustomerEligible = isRescoringAllowed && checkTopupEligibility(accountData, topupRules);

    return (
        <StyledGrid styleConfig={{ root: TopupPageStyles.topupPageRootStyles() }}>
            {isCustomerEligible ? (
                <StyledGrid styleConfig={{ root: TopupPageStyles.topupPageRootStyles() }}>
                    <StyledPageTitle
                        title={fm(messages.pageTitle)}
                        styleConfig={{
                            pageTitleContainer: props.styleConfig.titleBox,
                            pageTitleText: props.styleConfig.pageTitle,
                        }}
                    />
                    <StyledGrid styleConfig={{ root: TopupPageStyles.applicationContainer() }}>
                        <Font styleConfig={{ root: TopupPageStyles.formTitle() }}>
                            {fm(messages.heading)}
                        </Font>
                        <Font styleConfig={{ root: TopupPageStyles.formDescription() }}>
                            {fm(messages.topTextInfoLongText)}
                        </Font>
                        <Font styleConfig={{ root: TopupPageStyles.formDescription() }}>
                            {fm(messages.topTextInfo2)}
                        </Font>
                        {dataError.status && (
                            <Font styleConfig={{ root: TopupPageStyles.formError() }}>
                                {`${dataError.errorMessage}`}
                            </Font>
                        )}

                        <StyledGrid styleConfig={{ root: TopupPageStyles.formSection() }}>
                            <Font styleConfig={{ root: TopupPageStyles.sectionTitle() }}>
                                {fm(messages.Subheading1)}
                            </Font>
                            <StyledGrid styleConfig={{ root: TopupPageStyles.formItemContainer() }}>
                                <Font styleConfig={{ root: TopupPageStyles.formLabel() }}>
                                    {fm(messages.textCreditLimit)}
                                </Font>
                                <Font styleConfig={{ root: TopupPageStyles.userInfo() }}>
                                    {formattedCurrency(creditLimit)}
                                </Font>
                            </StyledGrid>
                            <StyledGrid styleConfig={{ root: TopupPageStyles.formItemContainer() }}>
                                <Font styleConfig={{ root: TopupPageStyles.formLabel() }}>
                                    {fm(messages.textNewCredit)}
                                </Font>
                                <StyledGrid
                                    styleConfig={{ root: TopupPageStyles.inputContainer() }}>
                                    <SelectField
                                        name="newCreditLimit"
                                        value={getOption(amounts, form.data.newCreditLimit)}
                                        icon={<Icon icon={["fa", "caret-down"]} size="lg" />}
                                        inputConfig={{
                                            select: {
                                                value: form.data.newCreditLimit,
                                                onChange: (value) => {
                                                    processChange({
                                                        field: "newCreditLimit",
                                                        value: value?.value,
                                                        validate: true,
                                                        touched: true,
                                                    });
                                                },
                                            },
                                        }}
                                        options={amounts}
                                        styleConfig={{
                                            select: TopupPageStyles.select(),
                                            singleValue: TopupPageStyles.singleValue(),
                                            option: TopupPageStyles.singleOption(),
                                            menu: TopupPageStyles.menu(),
                                        }}
                                    />
                                    <FormError field="newCreditLimit" />
                                </StyledGrid>
                            </StyledGrid>
                            <StyledGrid styleConfig={{ root: TopupPageStyles.formItemContainer() }}>
                                <Font styleConfig={{ root: TopupPageStyles.formLabel() }}>
                                    {fm(messages.textLoanPurpose)}
                                </Font>
                                <StyledGrid
                                    styleConfig={{ root: TopupPageStyles.inputContainer() }}>
                                    <SelectField
                                        name="loanPurpose"
                                        value={getOption(loanPurposeOptions, form.data.loanPurpose)}
                                        icon={<Icon icon={["fa", "caret-down"]} size="lg" />}
                                        inputConfig={{
                                            select: {
                                                value: form.data.loanPurpose,
                                                onChange: (value) => {
                                                    processChange({
                                                        field: "loanPurpose",
                                                        value: value?.value,
                                                        validate: true,
                                                        touched: true,
                                                    });
                                                },
                                            },
                                        }}
                                        options={loanPurposeOptions}
                                        styleConfig={{
                                            select: TopupPageStyles.select(),
                                            singleValue: TopupPageStyles.singleValue(),
                                            option: TopupPageStyles.singleOption(),
                                            menu: TopupPageStyles.menu(),
                                        }}
                                    />
                                    <FormError field="loanPurpose" />
                                </StyledGrid>
                            </StyledGrid>
                            <StyledGrid styleConfig={{ root: TopupPageStyles.formItemContainer() }}>
                                <Font styleConfig={{ root: TopupPageStyles.formLabel() }}>
                                    {fm(messages.textLoanPurposeDescription)}
                                </Font>
                                <StyledGrid
                                    styleConfig={{ root: TopupPageStyles.inputContainer() }}>
                                    <TextArea
                                        inputConfig={{
                                            name: "loanPurposeDescription",
                                            placeholder: fm(messages.placeholder),
                                            value: form.data.loanPurposeDescription,
                                            onFocus: () => {
                                                processFocus("loanPurposeDescription");
                                            },
                                            onChange: (e) => {
                                                processChange({
                                                    field: "loanPurposeDescription",
                                                    value: e.target.value,
                                                });
                                            },
                                            onBlur: () => {
                                                processBlur("loanPurposeDescription");
                                            },
                                            maxLength: "200",
                                        }}
                                        styleConfig={{ root: TopupPageStyles.textArea() }}
                                    />
                                    <FormError field="loanPurposeDescription" />
                                </StyledGrid>
                            </StyledGrid>
                        </StyledGrid>

                        <StyledGrid styleConfig={{ root: TopupPageStyles.formSection() }}>
                            <Font styleConfig={{ root: TopupPageStyles.sectionTitle() }}>
                                {fm(messages.Subheading2)}
                            </Font>
                            <StyledGrid styleConfig={{ root: TopupPageStyles.formItemContainer() }}>
                                <Font styleConfig={{ root: TopupPageStyles.formLabel() }}>
                                    {fm(messages.companyName)}
                                </Font>
                                <Font styleConfig={{ root: TopupPageStyles.userInfo() }}>
                                    {companyName}
                                </Font>
                            </StyledGrid>
                            <StyledGrid styleConfig={{ root: TopupPageStyles.formItemContainer() }}>
                                <Font styleConfig={{ root: TopupPageStyles.formLabel() }}>
                                    {fm(messages.businessID)}
                                </Font>
                                <Font styleConfig={{ root: TopupPageStyles.userInfo() }}>
                                    {orgNumber}
                                </Font>
                            </StyledGrid>
                            <StyledGrid styleConfig={{ root: TopupPageStyles.formItemContainer() }}>
                                <Font styleConfig={{ root: TopupPageStyles.formLabel() }}>
                                    {fm(messages.monhtlySale)}
                                </Font>
                                <StyledGrid
                                    styleConfig={{ root: TopupPageStyles.inputContainer() }}>
                                    <TextField
                                        inputConfig={{
                                            name: "monthlyIncomeGross",
                                            placeholder: fm(messages.placeholder),
                                            value: form.data.monthlyIncomeGross,
                                            onFocus: () => {
                                                processFocus("monthlyIncomeGross");
                                            },
                                            onChange: (e) => {
                                                if (isNumber(e.target.value)) {
                                                    processChange({
                                                        field: "monthlyIncomeGross",
                                                        value: e.target.value,
                                                    });
                                                }
                                            },
                                            onBlur: () => {
                                                processBlur("monthlyIncomeGross");
                                            },
                                        }}
                                        styleConfig={{ root: TopupPageStyles.textField() }}
                                    />
                                    <FormError field="monthlyIncomeGross" />
                                </StyledGrid>
                            </StyledGrid>
                            <StyledGrid styleConfig={{ root: TopupPageStyles.formItemContainer() }}>
                                <Font styleConfig={{ root: TopupPageStyles.formLabel() }}>
                                    {fm(messages.emailText)}
                                </Font>
                                <Font styleConfig={{ root: TopupPageStyles.userInfo() }}>
                                    {email}
                                </Font>
                            </StyledGrid>
                        </StyledGrid>

                        {/* Takaajan tiedot */}
                        <StyledGrid styleConfig={{ root: TopupPageStyles.formSection() }}>
                            <Font styleConfig={{ root: TopupPageStyles.sectionTitle() }}>
                                {fm(messages.Subheading3)}
                            </Font>
                            <StyledGrid styleConfig={{ root: TopupPageStyles.formItemContainer() }}>
                                <Font styleConfig={{ root: TopupPageStyles.formLabel() }}>
                                    {fm(messages.guaranteeName)}
                                </Font>
                                <Font styleConfig={{ root: TopupPageStyles.userInfo() }}>
                                    {givenName + " " + surname}
                                </Font>
                            </StyledGrid>
                            <StyledGrid styleConfig={{ root: TopupPageStyles.formItemContainer() }}>
                                <Font styleConfig={{ root: TopupPageStyles.formLabel() }}>
                                    {fm(messages.guaranteeSSN)}
                                </Font>
                                <Font styleConfig={{ root: TopupPageStyles.userInfo() }}>
                                    {reference}
                                </Font>
                            </StyledGrid>
                            <StyledGrid styleConfig={{ root: TopupPageStyles.formItemContainer() }}>
                                <Font styleConfig={{ root: TopupPageStyles.formLabel() }}>
                                    {fm(messages.guaranteePhone)}
                                </Font>
                                <Font styleConfig={{ root: TopupPageStyles.userInfo() }}>
                                    {phone}
                                </Font>
                            </StyledGrid>
                            <StyledGrid styleConfig={{ root: TopupPageStyles.formItemContainer() }}>
                                <Font styleConfig={{ root: TopupPageStyles.formLabel() }}>
                                    {fm(messages.campaignCode)}
                                </Font>
                                <StyledGrid
                                    styleConfig={{ root: TopupPageStyles.inputContainer() }}>
                                    <TextField
                                        inputConfig={{
                                            name: "campaignCode",
                                            placeholder: fm(messages.placeholder),
                                            value: form.data.campaignCode,
                                            onFocus: () => {
                                                processFocus("campaignCode");
                                            },
                                            onChange: (e) => {
                                                processChange({
                                                    field: "campaignCode",
                                                    value: e.target.value,
                                                });
                                            },
                                            onBlur: () => {
                                                processBlur("campaignCode");
                                            },
                                        }}
                                        styleConfig={{ root: TopupPageStyles.textField() }}
                                    />
                                </StyledGrid>
                            </StyledGrid>
                            <StyledGrid
                                styleConfig={{
                                    root: TopupPageStyles.formItemCheckBoxContainer(),
                                }}>
                                <Font styleConfig={{ root: TopupPageStyles.formLabelCheckBox() }}>
                                    {fm(messages.checkboxInfo1)}
                                </Font>
                                <StyledGrid
                                    styleConfig={{
                                        root: TopupPageStyles.inputContainerCheckbox(),
                                    }}>
                                    <CheckboxField
                                        checked={form.data.allowInspection}
                                        checkedIcon={
                                            <Icon
                                                icon={["fa", "check"]}
                                                size="lg"
                                                color="#82c45f"
                                            />
                                        }
                                        onClick={() => {
                                            processChange({
                                                field: "allowInspection",
                                                value: !form.data.allowInspection,
                                                validate: true,
                                                touched: true,
                                            });
                                        }}
                                        styleConfig={{
                                            root: TopupPageStyles.checkbox(),
                                            checked: {},
                                        }}
                                    />
                                    <FormError field="allowInspection" />
                                </StyledGrid>
                            </StyledGrid>
                            <StyledGrid
                                styleConfig={{
                                    root: TopupPageStyles.formItemCheckBoxContainer(),
                                }}>
                                <Font styleConfig={{ root: TopupPageStyles.formLabelCheckBox() }}>
                                    {fm(messages.checkboxInfo2)}

                                    <StyledLink
                                        styleConfig={{ root: TopupPageStyles.link() }}
                                        target="_blank"
                                        href={process.env.REACT_APP_REGISTRY_DESCRIPTION}>
                                        {fm(messages.checkboxInfo2LinkText)}
                                    </StyledLink>
                                    {" *"}
                                </Font>
                                <StyledGrid
                                    styleConfig={{
                                        root: TopupPageStyles.inputContainerCheckbox(),
                                    }}>
                                    <CheckboxField
                                        checked={form.data.personalInfoConsent}
                                        checkedIcon={
                                            <Icon
                                                icon={["fa", "check"]}
                                                size="lg"
                                                color="#82c45f"
                                            />
                                        }
                                        onClick={() => {
                                            processChange({
                                                field: "personalInfoConsent",
                                                value: !form.data.personalInfoConsent,
                                                validate: true,
                                                touched: true,
                                            });
                                        }}
                                        styleConfig={{
                                            root: TopupPageStyles.checkbox(),
                                            checked: {},
                                        }}
                                    />
                                    <FormError field="personalInfoConsent" />
                                </StyledGrid>
                            </StyledGrid>
                        </StyledGrid>

                        <StyledGrid styleConfig={{ root: TopupPageStyles.bottomContainer() }}>
                            {!isValid && form.touched.length > 0 && (
                                <Font styleConfig={{ root: TopupPageStyles.formBottomError() }}>
                                    {fm(messages.alertText)}
                                </Font>
                            )}
                            <StyledButton
                                onClick={() => {
                                    isValid && !dataError.status && toggleModalOpen(!modalOpen);
                                }}
                                styleConfig={{
                                    root:
                                        !isValid || dataError.status
                                            ? ButtonStyles.disabledButtonStyles({
                                                  marginTop: "10px",
                                              })
                                            : ButtonStyles.greenButtonStyles({ marginTop: "10px" }),
                                }}>
                                <Font styleConfig={{ root: ButtonStyles.buttonFontStyles() }}>
                                    {fm(messages.buttontextPreview)}{" "}
                                    <Icon icon={["fa", "angle-double-right"]} />{" "}
                                </Font>
                            </StyledButton>
                        </StyledGrid>
                    </StyledGrid>

                    {/* Modal */}
                    <Modal
                        modalTitle={
                            applicationSent ? fm(messages.sentModalTitle) : fm(messages.pageTitle)
                        }
                        isOpen={modalOpen}
                        onClick={() => {
                            toggleModalOpen(false);
                            setApplicationSent(false);
                            processReset();
                        }}
                        styleConfig={{
                            closeIcon: ModalStyles.modalCloseIcon(),
                            overlay: ModalStyles.modalOverlay(),
                            content: applicationSent
                                ? ModalStyles.modalContentScroll({ height: ["500px", "300px"] })
                                : ModalStyles.modalContentScroll(),
                            title: ModalStyles.modalTitle(),
                            titleText: ModalStyles.titleText(),
                        }}>
                        {applicationSent && (
                            <StyledGrid styleConfig={{ root: TopupPageStyles.formSection() }}>
                                <Font as="p" styleConfig={{ root: TopupPageStyles.contentText() }}>
                                    {fm(messages.sentModalInfo1)}
                                </Font>
                                <Font as="p" styleConfig={{ root: TopupPageStyles.contentText() }}>
                                    {fm(messages.sentModalInfo2)}
                                    <StyledLink
                                        styleConfig={{ root: TopupPageStyles.link() }}
                                        target="_blank"
                                        href={fm(messages.customerServiceLink)}>
                                        {fm(messages.customerServiceLinkText)}
                                    </StyledLink>{" "}
                                    {fm(messages.sentModalInfo3)}
                                </Font>
                            </StyledGrid>
                        )}
                        {!applicationSent && (
                            <>
                                <StyledGrid styleConfig={{ root: TopupPageStyles.formSection() }}>
                                    <Font styleConfig={{ root: TopupPageStyles.sectionTitle() }}>
                                        {fm(messages.Subheading1)}
                                    </Font>
                                    <StyledGrid
                                        styleConfig={{
                                            root: TopupPageStyles.formItemContainer(),
                                        }}>
                                        <Font styleConfig={{ root: TopupPageStyles.formLabel() }}>
                                            {"Nuvarande kreditlimit"}
                                        </Font>
                                        <Font styleConfig={{ root: TopupPageStyles.userInfo() }}>
                                            {formattedCurrency(creditLimit)}
                                        </Font>
                                    </StyledGrid>
                                    <StyledGrid
                                        styleConfig={{
                                            root: TopupPageStyles.formItemContainer(),
                                        }}>
                                        <Font styleConfig={{ root: TopupPageStyles.formLabel() }}>
                                            {fm(messages.textNewCredit)}
                                        </Font>
                                        <Font styleConfig={{ root: TopupPageStyles.userInfo() }}>
                                            {form.data.newCreditLimit}
                                        </Font>
                                    </StyledGrid>
                                    <StyledGrid
                                        styleConfig={{
                                            root: TopupPageStyles.formItemContainer(),
                                        }}>
                                        <Font styleConfig={{ root: TopupPageStyles.formLabel() }}>
                                            {fm(messages.textLoanPurpose)}
                                        </Font>
                                        <Font styleConfig={{ root: TopupPageStyles.userInfo() }}>
                                            {form.data.loanPurpose}
                                        </Font>
                                    </StyledGrid>
                                    <StyledGrid
                                        styleConfig={{
                                            root: TopupPageStyles.formItemContainer(),
                                        }}>
                                        <Font styleConfig={{ root: TopupPageStyles.formLabel() }}>
                                            {fm(messages.textLoanPurposeDescriptionShort)}
                                        </Font>
                                        <Font styleConfig={{ root: TopupPageStyles.userInfo() }}>
                                            {form.data.loanPurposeDescription}
                                        </Font>
                                    </StyledGrid>
                                </StyledGrid>

                                <StyledGrid styleConfig={{ root: TopupPageStyles.formSection() }}>
                                    <Font styleConfig={{ root: TopupPageStyles.sectionTitle() }}>
                                        {fm(messages.Subheading2)}
                                    </Font>
                                    <StyledGrid
                                        styleConfig={{
                                            root: TopupPageStyles.formItemContainer(),
                                        }}>
                                        <Font styleConfig={{ root: TopupPageStyles.formLabel() }}>
                                            {fm(messages.companyName)}
                                        </Font>
                                        <Font styleConfig={{ root: TopupPageStyles.userInfo() }}>
                                            {companyName}
                                        </Font>
                                    </StyledGrid>
                                    <StyledGrid
                                        styleConfig={{
                                            root: TopupPageStyles.formItemContainer(),
                                        }}>
                                        <Font styleConfig={{ root: TopupPageStyles.formLabel() }}>
                                            {fm(messages.businessID)}
                                        </Font>
                                        <Font styleConfig={{ root: TopupPageStyles.userInfo() }}>
                                            {orgNumber}
                                        </Font>
                                    </StyledGrid>
                                    <StyledGrid
                                        styleConfig={{
                                            root: TopupPageStyles.formItemContainer(),
                                        }}>
                                        <Font styleConfig={{ root: TopupPageStyles.formLabel() }}>
                                            {fm(messages.monhtlySale)}
                                        </Font>
                                        <Font styleConfig={{ root: TopupPageStyles.userInfo() }}>
                                            {formattedCurrency(form.data.monthlyIncomeGross)}
                                        </Font>
                                    </StyledGrid>
                                    <StyledGrid
                                        styleConfig={{
                                            root: TopupPageStyles.formItemContainer(),
                                        }}>
                                        <Font styleConfig={{ root: TopupPageStyles.formLabel() }}>
                                            {fm(messages.emailText)}
                                        </Font>
                                        <Font styleConfig={{ root: TopupPageStyles.userInfo() }}>
                                            {email}
                                        </Font>
                                    </StyledGrid>
                                </StyledGrid>

                                <StyledGrid styleConfig={{ root: TopupPageStyles.formSection() }}>
                                    <Font styleConfig={{ root: TopupPageStyles.sectionTitle() }}>
                                        {fm(messages.Subheading3)}
                                    </Font>
                                    <StyledGrid
                                        styleConfig={{
                                            root: TopupPageStyles.formItemContainer(),
                                        }}>
                                        <Font styleConfig={{ root: TopupPageStyles.formLabel() }}>
                                            {fm(messages.guaranteeName)}
                                        </Font>
                                        <Font styleConfig={{ root: TopupPageStyles.userInfo() }}>
                                            {givenName + " " + surname}
                                        </Font>
                                    </StyledGrid>
                                    <StyledGrid
                                        styleConfig={{
                                            root: TopupPageStyles.formItemContainer(),
                                        }}>
                                        <Font styleConfig={{ root: TopupPageStyles.formLabel() }}>
                                            {fm(messages.guaranteeSSN)}
                                        </Font>
                                        <Font styleConfig={{ root: TopupPageStyles.userInfo() }}>
                                            {reference}
                                        </Font>
                                    </StyledGrid>
                                    <StyledGrid
                                        styleConfig={{
                                            root: TopupPageStyles.formItemContainer(),
                                        }}>
                                        <Font styleConfig={{ root: TopupPageStyles.formLabel() }}>
                                            {fm(messages.guaranteePhone)}
                                        </Font>
                                        {typeof phone === "string" ? (
                                            <Font
                                                styleConfig={{ root: TopupPageStyles.userInfo() }}>
                                                {phone}
                                            </Font>
                                        ) : (
                                            <Font
                                                styleConfig={{ root: TopupPageStyles.userInfo() }}>
                                                {" "}
                                            </Font>
                                        )}
                                    </StyledGrid>
                                    <StyledGrid
                                        styleConfig={{
                                            root: TopupPageStyles.formItemContainer(),
                                        }}>
                                        <Font styleConfig={{ root: TopupPageStyles.formLabel() }}>
                                            {fm(messages.campaignCode)}
                                        </Font>
                                        <Font styleConfig={{ root: TopupPageStyles.userInfo() }}>
                                            {form.data.campaignCode}
                                        </Font>
                                    </StyledGrid>
                                    <StyledGrid
                                        styleConfig={{
                                            root: TopupPageStyles.formItemCheckBoxContainer(),
                                        }}>
                                        <Font
                                            styleConfig={{
                                                root: TopupPageStyles.formLabelCheckBox(),
                                            }}>
                                            {fm(messages.checkboxInfo1)}
                                        </Font>
                                        <StyledGrid
                                            styleConfig={{
                                                root: TopupPageStyles.inputContainerCheckbox(),
                                            }}>
                                            <Font
                                                styleConfig={{
                                                    root: TopupPageStyles.userInfo(),
                                                }}>
                                                {form.data.allowInspection ? "Ja" : "Nej"}
                                            </Font>
                                        </StyledGrid>
                                    </StyledGrid>
                                    <StyledGrid
                                        styleConfig={{
                                            root: TopupPageStyles.formItemCheckBoxContainer(),
                                        }}>
                                        <Font
                                            styleConfig={{
                                                root: TopupPageStyles.formLabelCheckBox(),
                                            }}>
                                            {fm(messages.checkboxInfo2Modal)}
                                        </Font>
                                        <StyledGrid
                                            styleConfig={{
                                                root: TopupPageStyles.inputContainerCheckbox(),
                                            }}>
                                            <Font
                                                styleConfig={{
                                                    root: TopupPageStyles.userInfo(),
                                                }}>
                                                {form.data.personalInfoConsent ? "Ja" : "Nej"}
                                            </Font>
                                        </StyledGrid>
                                    </StyledGrid>
                                </StyledGrid>

                                <StyledGrid
                                    styleConfig={{ root: TopupPageStyles.bottomContainer() }}>
                                    <StyledButton
                                        onClick={() => {
                                            handleForm();
                                            // processReset();
                                            setIsValid(false);
                                        }}
                                        styleConfig={{
                                            root: ButtonStyles.greenButtonStyles({
                                                marginTop: "10px",
                                            }),
                                        }}>
                                        <Font
                                            styleConfig={{
                                                root: ButtonStyles.buttonFontStyles(),
                                            }}>
                                            {fm(messages.buttonTextSend)}{" "}
                                            <Icon icon={["fa", "angle-double-right"]} />{" "}
                                        </Font>
                                    </StyledButton>
                                    <StyledButton
                                        onClick={() => {
                                            toggleModalOpen(false);
                                        }}
                                        styleConfig={{
                                            root: ButtonStyles.backButtonStyles(),
                                        }}>
                                        <Font
                                            styleConfig={{
                                                root: ButtonStyles.backButtonFontStyles(),
                                            }}>
                                            <Icon icon={["fa", "angle-double-left"]} />{" "}
                                            {fm(messages.buttonTextGoback)}
                                        </Font>
                                    </StyledButton>
                                </StyledGrid>
                            </>
                        )}
                    </Modal>
                </StyledGrid>
            ) : (
                <NotEligiblePage />
            )}
        </StyledGrid>
    );
}

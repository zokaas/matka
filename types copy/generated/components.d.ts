import type { Schema, Struct } from '@strapi/strapi';

export interface EverydayComponentsCompanyPage extends Struct.ComponentSchema {
  collectionName: 'components_everyday_components_company_pages';
  info: {
    description: '';
    displayName: 'Company Page';
  };
  attributes: {
    companyPageContent: Schema.Attribute.RichText;
    companyPageTitle: Schema.Attribute.String;
    cookiesMarkkinointiTable: Schema.Attribute.RichText;
    cookiesPageTextContent: Schema.Attribute.RichText;
    cookiesPageTitle: Schema.Attribute.String;
    cookiesTilastotTable: Schema.Attribute.RichText;
    cookiesValttamatonTable: Schema.Attribute.RichText;
    rekisteriselostePageContent: Schema.Attribute.RichText;
    rekisteriselostePageTitle: Schema.Attribute.String;
    responsibilityAndValuePageContent: Schema.Attribute.RichText;
    responsibilityAndValuePageTitle: Schema.Attribute.String;
    turvallinenAsiontiPageContent: Schema.Attribute.RichText;
    turvallinenAsiontiPageTitle: Schema.Attribute.String;
  };
}

export interface EverydayComponentsCustomerServicePage
  extends Struct.ComponentSchema {
  collectionName: 'components_everyday_components_customer_service_pages';
  info: {
    description: '';
    displayName: 'Customer Service Page';
  };
  attributes: {
    pageContent: Schema.Attribute.RichText;
    pageTitle: Schema.Attribute.String;
  };
}

export interface EverydayComponentsEdFiGlobal extends Struct.ComponentSchema {
  collectionName: 'components_everyday_components_ed_fi_globals';
  info: {
    description: '';
    displayName: 'ED FI Global';
  };
  attributes: {
    companyID: Schema.Attribute.String;
    companyName: Schema.Attribute.String;
    companyPostalAddress: Schema.Attribute.String;
    companyStreetAddress: Schema.Attribute.String;
    emailAddress: Schema.Attribute.String;
    emailOperatingHours: Schema.Attribute.String;
    emailText: Schema.Attribute.String;
    phoneNumber: Schema.Attribute.String;
    phoneOperatingHours: Schema.Attribute.String;
    phoneText: Schema.Attribute.String;
  };
}

export interface EverydayComponentsErrorPage extends Struct.ComponentSchema {
  collectionName: 'components_everyday_components_error_pages';
  info: {
    displayName: 'Error Page';
  };
  attributes: {
    pageBodyText: Schema.Attribute.String;
    pageHeading: Schema.Attribute.String;
    pageSubHeading: Schema.Attribute.String;
  };
}

export interface EverydayComponentsFaqItem extends Struct.ComponentSchema {
  collectionName: 'components_everyday_components_faq_items';
  info: {
    description: '';
    displayName: 'FAQ item';
  };
  attributes: {
    answer: Schema.Attribute.RichText;
    category: Schema.Attribute.Enumeration<['others', 'general', 'payback']> &
      Schema.Attribute.Required;
    question: Schema.Attribute.String;
  };
}

export interface EverydayComponentsFaqPage extends Struct.ComponentSchema {
  collectionName: 'components_everyday_components_faq_pages';
  info: {
    description: '';
    displayName: 'FAQ Page';
  };
  attributes: {
    FAQ: Schema.Attribute.Component<'everyday-components.faq-item', true>;
    generalBlockTitle: Schema.Attribute.String;
    helpBlockText: Schema.Attribute.String;
    helpBlockTitle: Schema.Attribute.String;
    noticeBlockTitle: Schema.Attribute.String;
    pageTitle: Schema.Attribute.String;
    paybackBlockTitle: Schema.Attribute.String;
  };
}

export interface EverydayComponentsFooter extends Struct.ComponentSchema {
  collectionName: 'components_everyday_components_footers';
  info: {
    description: '';
    displayName: 'Footer';
  };
  attributes: {
    companyInfoText: Schema.Attribute.Text;
    footerHeading: Schema.Attribute.String;
  };
}

export interface EverydayComponentsFrontPage extends Struct.ComponentSchema {
  collectionName: 'components_everyday_components_front_pages';
  info: {
    description: '';
    displayName: 'Front Page';
  };
  attributes: {
    customerServiceTitle: Schema.Attribute.String;
    newsBlockTitle: Schema.Attribute.String;
    notice: Schema.Attribute.Text;
    noticeTitle: Schema.Attribute.String;
    openingHeading: Schema.Attribute.String;
    openingHrs: Schema.Attribute.String;
    phoneOpeningHrsText: Schema.Attribute.String;
  };
}

export interface EverydayComponentsLink extends Struct.ComponentSchema {
  collectionName: 'components_everyday_components_links';
  info: {
    displayName: 'link';
  };
  attributes: {
    linkText: Schema.Attribute.String;
    linkUrl: Schema.Attribute.String;
  };
}

export interface EverydayComponentsLoanPage extends Struct.ComponentSchema {
  collectionName: 'components_everyday_components_loan_pages';
  info: {
    description: '';
    displayName: 'Loan Page';
  };
  attributes: {
    lainaehdotContent: Schema.Attribute.RichText;
    lainaehdotTitle: Schema.Attribute.String;
    privacyLink: Schema.Attribute.Component<'everyday-components.link', false>;
    takaisinmaksuContent: Schema.Attribute.RichText;
    takaisinmaksuTitle: Schema.Attribute.String;
  };
}

export interface EverydayComponentsNews extends Struct.ComponentSchema {
  collectionName: 'components_everyday_components_news';
  info: {
    description: '';
    displayName: 'News';
  };
  attributes: {
    news: Schema.Attribute.RichText;
    publishedOn: Schema.Attribute.Date;
    title: Schema.Attribute.String;
  };
}

export interface EverydayComponentsNotFoundPage extends Struct.ComponentSchema {
  collectionName: 'components_everyday_components_not_found_pages';
  info: {
    displayName: 'Not Found Page';
  };
  attributes: {
    notFoundMessage: Schema.Attribute.String;
  };
}

export interface EverydayComponentsQuestionsSection1
  extends Struct.ComponentSchema {
  collectionName: 'components_everyday_components_questions_section_1s';
  info: {
    description: '';
    displayName: 'QuestionsBlock';
  };
  attributes: {
    answer: Schema.Attribute.Text;
    question: Schema.Attribute.String;
  };
}

export interface FaComponentsBankAccountListBlock
  extends Struct.ComponentSchema {
  collectionName: 'components_fa_components_bank_account_list_blocks';
  info: {
    displayName: 'bankAccountListBlock';
  };
  attributes: {
    addAnotherAccountButton: Schema.Attribute.String;
    resultsButton: Schema.Attribute.String;
    subtitle1: Schema.Attribute.Text;
    subtitle2: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface FaComponentsBankSelectionBlock extends Struct.ComponentSchema {
  collectionName: 'components_fa_components_bank_selection_blocks';
  info: {
    description: '';
    displayName: 'bankSelectionBlock';
  };
  attributes: {
    backStepButton: Schema.Attribute.String;
    consentRichText: Schema.Attribute.RichText;
    loginBank: Schema.Attribute.String;
    showLessBanks: Schema.Attribute.String;
    showMoreBanks: Schema.Attribute.String;
    subtitle1: Schema.Attribute.RichText;
    subtitle2: Schema.Attribute.String;
    subtitle3: Schema.Attribute.String;
    title: Schema.Attribute.String;
    tooltipInfo: Schema.Attribute.Text;
  };
}

export interface FaComponentsConsentBlock extends Struct.ComponentSchema {
  collectionName: 'components_fa_components_consent_blocks';
  info: {
    description: '';
    displayName: 'consentBlock';
  };
  attributes: {
    bulletPoints: Schema.Attribute.Component<'global.bullet-list', false>;
    chooseBankButton: Schema.Attribute.String;
    consentInfoLink: Schema.Attribute.Component<'global.link', false>;
    skipStepButton: Schema.Attribute.String;
    subtitle1: Schema.Attribute.Text;
    subtitle2: Schema.Attribute.Text;
    subtitle3: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface FaComponentsLoanBlock extends Struct.ComponentSchema {
  collectionName: 'components_fa_components_loan_blocks';
  info: {
    description: '';
    displayName: 'loanBlock';
  };
  attributes: {
    campaignCode: Schema.Attribute.Component<'global.field', false>;
    companyOrKvk: Schema.Attribute.Component<'global.field', false>;
    customer: Schema.Attribute.String;
    email: Schema.Attribute.Component<'global.field', false>;
    infoText: Schema.Attribute.Text;
    intermediary: Schema.Attribute.String;
    intermediaryEmail: Schema.Attribute.Component<'global.field', false>;
    intermediaryPhoneNumber: Schema.Attribute.Component<'global.field', false>;
    intermediaryToggle: Schema.Attribute.String;
    isCampaigncodeVisible: Schema.Attribute.Boolean;
    loanAmount: Schema.Attribute.Component<'global.field', false>;
    loginGreeting: Schema.Attribute.String;
    loginInfo: Schema.Attribute.String;
    nextButton: Schema.Attribute.String;
    redirectDisplayText: Schema.Attribute.String;
  };
}

export interface FaComponentsOpenBankingError extends Struct.ComponentSchema {
  collectionName: 'components_fa_components_open_banking_errors';
  info: {
    description: '';
    displayName: 'openBankingError';
    icon: 'cog';
  };
  attributes: {
    attemptsRemaining: Schema.Attribute.String;
    continueButton: Schema.Attribute.String;
    errorMessage_enablenow: Schema.Attribute.Text;
    errorMessage_provider: Schema.Attribute.Text;
    errorMessage_unknown: Schema.Attribute.Text;
    errorMessage_user: Schema.Attribute.Text;
    errorRetryButton: Schema.Attribute.String;
    errorTitle: Schema.Attribute.String;
    maxRetriesReached: Schema.Attribute.Text;
    skipButton: Schema.Attribute.String;
  };
}

export interface FaComponentsPersonalInfoBlock extends Struct.ComponentSchema {
  collectionName: 'components_component_personal_info_blocks';
  info: {
    description: '';
    displayName: 'PersonalInfoBlock';
  };
  attributes: {
    addressDataError: Schema.Attribute.String;
    addressLabel: Schema.Attribute.String;
    dateOfBirth: Schema.Attribute.Component<'global.field', false>;
    firstName: Schema.Attribute.Component<'global.field', false>;
    houseNumber: Schema.Attribute.Component<
      'global.field-without-label',
      false
    >;
    houseNumberAddition: Schema.Attribute.Component<
      'global.field-without-label',
      false
    >;
    lastName: Schema.Attribute.Component<'global.field', false>;
    marketingConsent: Schema.Attribute.Component<'global.field', false>;
    phoneNumber: Schema.Attribute.Component<'global.field', false>;
    previousButton: Schema.Attribute.String;
    privacyDisplayText: Schema.Attribute.String;
    privacyPolicy: Schema.Attribute.Component<'global.field', false>;
    sendButton: Schema.Attribute.String;
    zipcode: Schema.Attribute.Component<'global.field-without-label', false>;
  };
}

export interface FaComponentsProcessBar extends Struct.ComponentSchema {
  collectionName: 'components_fa_components_process_bars';
  info: {
    description: '';
    displayName: 'processBar';
  };
  attributes: {
    step1: Schema.Attribute.String;
    step2: Schema.Attribute.String;
    step3: Schema.Attribute.String;
    step4: Schema.Attribute.String;
  };
}

export interface FaComponentsTitle extends Struct.ComponentSchema {
  collectionName: 'components_fa_components_titles';
  info: {
    displayName: 'title';
  };
  attributes: {};
}

export interface FaComponentsYourOptionsBlock extends Struct.ComponentSchema {
  collectionName: 'components_component_your_options_blocks';
  info: {
    description: '';
    displayName: 'YourOptionsBlock';
  };
  attributes: {
    message_A1: Schema.Attribute.RichText;
    message_A1_Existing: Schema.Attribute.RichText;
    message_B2: Schema.Attribute.RichText;
    message_B2_Existing: Schema.Attribute.RichText;
    message_C3: Schema.Attribute.RichText;
    message_C3_Existing: Schema.Attribute.RichText;
    title_A1_All_Good: Schema.Attribute.String;
    title_A1_All_Good_Existing: Schema.Attribute.String;
    title_B2_Warning: Schema.Attribute.String;
    title_B2_Warning_Existing: Schema.Attribute.String;
    title_C3_Rejected: Schema.Attribute.String;
    title_C3_Rejected_Existing: Schema.Attribute.String;
  };
}

export interface FoComponentsAccountDetailBlock extends Struct.ComponentSchema {
  collectionName: 'components_fo_components_account_detail_blocks';
  info: {
    displayName: 'AccountDetailBlock';
  };
  attributes: {
    creditAvailableText: Schema.Attribute.String;
    creditInfoText: Schema.Attribute.String;
    creditLimitText: Schema.Attribute.String;
    creditWithdrawnText: Schema.Attribute.String;
    loanSummaryHeading: Schema.Attribute.String;
  };
}

export interface FoComponentsFrontPageCollection
  extends Struct.ComponentSchema {
  collectionName: 'components_fo_components_front_page_collections';
  info: {
    description: '';
    displayName: 'Front Page Collection';
  };
  attributes: {
    bodyText: Schema.Attribute.String;
    collectionEmailAddress: Schema.Attribute.String;
    collectionEmailLink: Schema.Attribute.String;
    collectionPhone: Schema.Attribute.String;
    documentBtnText: Schema.Attribute.String;
    heading: Schema.Attribute.String;
    loanInfoSubHeading: Schema.Attribute.String;
  };
}

export interface FoComponentsGenericTable extends Struct.ComponentSchema {
  collectionName: 'components_fo_components_generic_tables';
  info: {
    description: '';
    displayName: 'Generic Table';
  };
  attributes: {
    nodata: Schema.Attribute.String;
    paginatorShow: Schema.Attribute.String;
  };
}

export interface FoComponentsHeader extends Struct.ComponentSchema {
  collectionName: 'components_fo_components_header';
  info: {
    description: '';
    displayName: 'Header';
  };
  attributes: {
    customerService: Schema.Attribute.String;
    frontPage: Schema.Attribute.String;
    loanInformation: Schema.Attribute.String;
    loginText: Schema.Attribute.String;
    logoutText: Schema.Attribute.String;
    mobileNavMore: Schema.Attribute.String;
    ownInfo: Schema.Attribute.String;
    topup: Schema.Attribute.String;
  };
}

export interface FoComponentsLoanPageInfoBlock extends Struct.ComponentSchema {
  collectionName: 'components_fo_components_loan_page_info_blocks';
  info: {
    description: '';
    displayName: 'loanPageInfoBlock';
  };
  attributes: {
    amountInfoText: Schema.Attribute.String;
    blockHeading: Schema.Attribute.String;
    dateInfoText: Schema.Attribute.String;
    documentsErrorText: Schema.Attribute.String;
    loanDocumentBtnText: Schema.Attribute.String;
    modalBodyText: Schema.Attribute.Text;
    modalTitle: Schema.Attribute.String;
    openDocumentsBtnText: Schema.Attribute.String;
  };
}

export interface FoComponentsLoanPageInvoiceBlock
  extends Struct.ComponentSchema {
  collectionName: 'components_fo_components_loan_page_invoice_blocks';
  info: {
    description: '';
    displayName: 'Loan Page Invoice Block';
  };
  attributes: {
    blockHeading: Schema.Attribute.String;
    invoiceOpen: Schema.Attribute.String;
    invoiceOverdue: Schema.Attribute.String;
    invoicePaid: Schema.Attribute.String;
    tableHeadDueDateText: Schema.Attribute.String;
    tableHeadInvoiceNumber: Schema.Attribute.String;
    tableHeadInvoiceTypeText: Schema.Attribute.String;
    tableHeadStatusText: Schema.Attribute.String;
    tableHeadSumText: Schema.Attribute.String;
  };
}

export interface FoComponentsLoanPageReportingBlock
  extends Struct.ComponentSchema {
  collectionName: 'components_fo_components_loan_page_reporting_blocks';
  info: {
    description: '';
    displayName: 'loanPageReportingBlock';
  };
  attributes: {
    blockHeading: Schema.Attribute.String;
    buttonText: Schema.Attribute.String;
    dateInputPlaceholder: Schema.Attribute.String;
    errorText: Schema.Attribute.String;
    loadingText: Schema.Attribute.String;
    noAccountDataMessage: Schema.Attribute.String;
    noReportsMessage: Schema.Attribute.String;
    reportsOverviewInstructionsText: Schema.Attribute.Text;
  };
}

export interface FoComponentsLoanPageTransactionsBlock
  extends Struct.ComponentSchema {
  collectionName: 'components_fo_components_loan_page_transactions_blocks';
  info: {
    description: '';
    displayName: 'Loan Page Transactions Block';
  };
  attributes: {
    blockHeading: Schema.Attribute.String;
    makeWithdrawlBtnText: Schema.Attribute.String;
    tableHeadAmountText: Schema.Attribute.String;
    tableHeadDateText: Schema.Attribute.String;
    tableHeadTransactionTypeText: Schema.Attribute.String;
    transactionStatus: Schema.Attribute.JSON;
  };
}

export interface FoComponentsLoanpageContactBlock
  extends Struct.ComponentSchema {
  collectionName: 'components_fo_components_loanpage_contact_blocks';
  info: {
    description: '';
    displayName: 'loanpageContactBlock';
  };
  attributes: {
    blockHeading: Schema.Attribute.String;
    customerServiceOpeningHrsText: Schema.Attribute.String;
    requestBalanceText: Schema.Attribute.String;
  };
}

export interface FoComponentsNewsBlock extends Struct.ComponentSchema {
  collectionName: 'components_fo_components_news_blocks';
  info: {
    displayName: 'News Block';
  };
  attributes: {
    blockTitle: Schema.Attribute.String;
    readMoreText: Schema.Attribute.String;
  };
}

export interface FoComponentsTopupPageNotEligibleBlock
  extends Struct.ComponentSchema {
  collectionName: 'components_fo_components_topup_page_not_eligible_blocks';
  info: {
    description: '';
    displayName: 'Topup Page Not Eligible Block';
  };
  attributes: {
    blockSubHead1: Schema.Attribute.String;
    blockSubHead2: Schema.Attribute.String;
    blockTitle: Schema.Attribute.String;
    infoPoint1: Schema.Attribute.String;
    infoPoint2: Schema.Attribute.String;
    maxCreditLimitText: Schema.Attribute.String;
  };
}

export interface FoComponentsWithdrawBlock extends Struct.ComponentSchema {
  collectionName: 'components_fo_components_withdraw_blocks';
  info: {
    description: '';
    displayName: 'Withdraw Block';
  };
  attributes: {
    withdrawAlertAmountTooBig: Schema.Attribute.String;
    withdrawAlertAmountTooSmall: Schema.Attribute.String;
    withdrawAvailableCreditTooSmall: Schema.Attribute.String;
    withdrawButtonInfoText: Schema.Attribute.String;
    withdrawButtonText: Schema.Attribute.String;
    withdrawCurrencySign: Schema.Attribute.String;
    withdrawInputLabel: Schema.Attribute.String;
    withdrawInputPlaceholder: Schema.Attribute.String;
    withdrawNoIbanNumber: Schema.Attribute.String;
    withdrawNotAbleToMakeWithdrawal: Schema.Attribute.String;
    withdrawNotEligibleText: Schema.Attribute.String;
    withdrawOverdueInvoice: Schema.Attribute.String;
    withdrawSentMessage: Schema.Attribute.String;
    withdrawTitle: Schema.Attribute.String;
    withdwrawInfoBullets: Schema.Attribute.JSON;
  };
}

export interface FoPagesAccountSelectionPage extends Struct.ComponentSchema {
  collectionName: 'components_fo_components_account_selection_pages';
  info: {
    description: '';
    displayName: 'choose account page';
  };
  attributes: {
    loanAccountNumberText: Schema.Attribute.String;
    pageHeading: Schema.Attribute.String;
  };
}

export interface FoPagesCustomerServicePage extends Struct.ComponentSchema {
  collectionName: 'components_fo_pages_customer_service_pages';
  info: {
    description: '';
    displayName: 'Customer Service Page';
  };
  attributes: {
    additionalFundAnswer: Schema.Attribute.String;
    additionalFundingHereLink: Schema.Attribute.Component<'global.link', false>;
    additionalFundLink: Schema.Attribute.String;
    additionalFundQuestion: Schema.Attribute.String;
    checkFAQText: Schema.Attribute.String;
    collectionAnswer: Schema.Attribute.String;
    collectionEmail: Schema.Attribute.String;
    collectionPhoneNumber: Schema.Attribute.String;
    collectionQuestion: Schema.Attribute.String;
    contactInfoHeading: Schema.Attribute.String;
    contactInfoSubHeading: Schema.Attribute.String;
    faqLink: Schema.Attribute.Component<'global.link', false>;
    GeneralInfoHeading: Schema.Attribute.String;
    moreTimeAnswer: Schema.Attribute.String;
    moreTimeQuestion: Schema.Attribute.String;
    openText: Schema.Attribute.String;
    pageTitle: Schema.Attribute.String;
  };
}

export interface FoPagesErrorPage extends Struct.ComponentSchema {
  collectionName: 'components_fo_pages_error_pages';
  info: {
    description: '';
    displayName: 'Error Page';
  };
  attributes: {
    defaultTitle: Schema.Attribute.String;
    loginAgainText: Schema.Attribute.String;
    loginHereLink: Schema.Attribute.Component<'global.link', false>;
    orLoginToWebText: Schema.Attribute.String;
    pageTitle: Schema.Attribute.String;
    webPageHereLink: Schema.Attribute.Component<'global.link', false>;
  };
}

export interface FoPagesExpiredPage extends Struct.ComponentSchema {
  collectionName: 'components_fo_pages_expired_pages';
  info: {
    description: '';
    displayName: 'Expired Page';
  };
  attributes: {
    bodyText: Schema.Attribute.String;
    heading: Schema.Attribute.String;
    loginLink: Schema.Attribute.Component<'global.link', false>;
    pageTitle: Schema.Attribute.String;
  };
}

export interface FoPagesFrontPage extends Struct.ComponentSchema {
  collectionName: 'components_fo_pages_front_pages';
  info: {
    description: '';
    displayName: 'Front page';
  };
  attributes: {
    frontPageAccountDetailBlock: Schema.Attribute.Component<
      'fo-components.account-detail-block',
      false
    >;
    frontPageCollection: Schema.Attribute.Component<
      'fo-components.front-page-collection',
      false
    >;
    frontPageNewsBlock: Schema.Attribute.Component<
      'fo-components.news-block',
      false
    >;
    frontPageWithdrawBlock: Schema.Attribute.Component<
      'fo-components.withdraw-block',
      false
    >;
    pageTitle: Schema.Attribute.String;
  };
}

export interface FoPagesLoanPage extends Struct.ComponentSchema {
  collectionName: 'components_fo_pages_loan_pages';
  info: {
    description: '';
    displayName: 'Loan Page';
  };
  attributes: {
    genericTable: Schema.Attribute.Component<
      'fo-components.generic-table',
      false
    >;
    loanPageContactBlock: Schema.Attribute.Component<
      'fo-components.loanpage-contact-block',
      false
    >;
    loanPageInfoBlock: Schema.Attribute.Component<
      'fo-components.loan-page-info-block',
      false
    >;
    loanPageInvoiceBlock: Schema.Attribute.Component<
      'fo-components.loan-page-invoice-block',
      false
    >;
    loanPageReportingBlock: Schema.Attribute.Component<
      'fo-components.loan-page-reporting-block',
      false
    >;
    loanPageTitle: Schema.Attribute.String;
    loanPageTransactionsBlock: Schema.Attribute.Component<
      'fo-components.loan-page-transactions-block',
      false
    >;
  };
}

export interface FoPagesLoggedOutPage extends Struct.ComponentSchema {
  collectionName: 'components_fo_pages_logged_out_pages';
  info: {
    description: '';
    displayName: 'Logged Out Page';
  };
  attributes: {
    gotoWebLink: Schema.Attribute.Component<'global.link', false>;
    pageTitle: Schema.Attribute.String;
    returnToWebText: Schema.Attribute.String;
  };
}

export interface FoPagesLoginPage extends Struct.ComponentSchema {
  collectionName: 'components_fo_pages_login_pages';
  info: {
    displayName: 'Login Page';
  };
  attributes: {
    loadingPageWait: Schema.Attribute.String;
  };
}

export interface FoPagesNoLoanPage extends Struct.ComponentSchema {
  collectionName: 'components_fo_pages_no_loan_pages';
  info: {
    description: '';
    displayName: 'No Loan Page';
  };
  attributes: {
    applicationLink: Schema.Attribute.Component<'global.link', false>;
    bodyText: Schema.Attribute.String;
    pageHeading: Schema.Attribute.String;
    pageTitle: Schema.Attribute.String;
  };
}

export interface FoPagesStartPage extends Struct.ComponentSchema {
  collectionName: 'components_fo_components_start_pages';
  info: {
    description: '';
    displayName: 'Start Page';
  };
  attributes: {
    applyHeading: Schema.Attribute.String;
    applyText: Schema.Attribute.String;
    loginHeading: Schema.Attribute.String;
    loginText: Schema.Attribute.String;
    LoginToFlexOnlineText: Schema.Attribute.String;
    pageTitle: Schema.Attribute.String;
  };
}

export interface FoPagesTopupPage extends Struct.ComponentSchema {
  collectionName: 'components_fo_pages_topup_pages';
  info: {
    description: '';
    displayName: 'Topup Page';
  };
  attributes: {
    acceptLowerLimitCheckBox: Schema.Attribute.Component<'global.field', false>;
    backBtnText: Schema.Attribute.String;
    campaignCode: Schema.Attribute.Component<'global.field', false>;
    companyEmailLabel: Schema.Attribute.String;
    creditCheck: Schema.Attribute.Component<'global.field', false>;
    creditLimitLabel: Schema.Attribute.String;
    dropdownChooseText: Schema.Attribute.String;
    fillInAllFieldsErrorText: Schema.Attribute.String;
    formInstructionText: Schema.Attribute.String;
    guarantorInfoSubHead: Schema.Attribute.String;
    guarantorNameLabel: Schema.Attribute.String;
    guarantorSSnLabel: Schema.Attribute.String;
    loanInfoSubHeading: Schema.Attribute.String;
    monthlyTurnover: Schema.Attribute.Component<'global.field', false>;
    monthlyTurnoverText: Schema.Attribute.String;
    newCreditLimit: Schema.Attribute.Component<'global.field', false>;
    newCreditLimitText: Schema.Attribute.String;
    organizationInfoSubHead: Schema.Attribute.String;
    organizationNameLabel: Schema.Attribute.String;
    organizationNumberLabel: Schema.Attribute.String;
    pageLongInfoText: Schema.Attribute.Text;
    pageSubHeading: Schema.Attribute.String;
    pageTitle: Schema.Attribute.String;
    phoneNumberText: Schema.Attribute.String;
    previewBtnText: Schema.Attribute.String;
    PrivacyPolicy: Schema.Attribute.Component<'global.field', false>;
    privacyPolicyLink: Schema.Attribute.Component<'global.link', false>;
    sendApplicationBtnText: Schema.Attribute.String;
    thankyouBodyOrByPhoneText: Schema.Attribute.String;
    thankYouBodyText1: Schema.Attribute.Text;
    thankYouBodyText2: Schema.Attribute.Text;
    ThankYouHeading: Schema.Attribute.String;
    topupPageNotEligibleBlock: Schema.Attribute.Component<
      'fo-components.topup-page-not-eligible-block',
      false
    >;
  };
}

export interface FoPagesUserPage extends Struct.ComponentSchema {
  collectionName: 'components_fo_pages_user_pages';
  info: {
    description: '';
    displayName: 'User Page';
  };
  attributes: {
    accountNumberLabel: Schema.Attribute.String;
    address: Schema.Attribute.Component<'global.field', false>;
    addressPlaceholders: Schema.Attribute.JSON;
    businessIdLabel: Schema.Attribute.String;
    companyInfoHeading: Schema.Attribute.String;
    companyNameLabel: Schema.Attribute.String;
    customerNumberLabel: Schema.Attribute.String;
    editBtnText: Schema.Attribute.String;
    email: Schema.Attribute.Component<'global.field', false>;
    guarantorInfoHeading: Schema.Attribute.String;
    guarantorNameLabel: Schema.Attribute.String;
    guarantorSSNLabel: Schema.Attribute.String;
    pageTitle: Schema.Attribute.String;
    pageTopInfo: Schema.Attribute.String;
    PhoneNumber: Schema.Attribute.Component<'global.field', false>;
    saveBtnText: Schema.Attribute.String;
  };
}

export interface GlobalBulletList extends Struct.ComponentSchema {
  collectionName: 'components_global_bullet_lists';
  info: {
    description: '';
    displayName: 'bulletList';
  };
  attributes: {
    bulletPoint1: Schema.Attribute.RichText;
    bulletPoint2: Schema.Attribute.RichText;
    bulletPoint3: Schema.Attribute.RichText;
  };
}

export interface GlobalCompanyAddress extends Struct.ComponentSchema {
  collectionName: 'components_global_company_addresses';
  info: {
    displayName: 'companyAddress';
  };
  attributes: {
    line: Schema.Attribute.String;
  };
}

export interface GlobalContact extends Struct.ComponentSchema {
  collectionName: 'components_global_contacts';
  info: {
    description: '';
    displayName: 'contact';
  };
  attributes: {
    emailLabel: Schema.Attribute.String;
    emailLink: Schema.Attribute.Component<'global.link', true>;
    openingDays: Schema.Attribute.String;
    openingTimesClock: Schema.Attribute.String;
    openingTimesLabel: Schema.Attribute.String;
    phoneLabel: Schema.Attribute.String;
    phoneNumber: Schema.Attribute.String;
    subtitle: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface GlobalDynamicLoader extends Struct.ComponentSchema {
  collectionName: 'components_global_dynamic_loaders';
  info: {
    displayName: 'dynamicLoader';
  };
  attributes: {
    loaderText1: Schema.Attribute.Text;
    loaderText2: Schema.Attribute.Text;
    loaderText3: Schema.Attribute.Text;
  };
}

export interface GlobalField extends Struct.ComponentSchema {
  collectionName: 'components_component_fields';
  info: {
    description: '';
    displayName: 'Fields';
  };
  attributes: {
    amountHelper: Schema.Attribute.String;
    errorMessages: Schema.Attribute.JSON;
    label: Schema.Attribute.String;
    placeholder: Schema.Attribute.String;
  };
}

export interface GlobalFieldWithoutLabel extends Struct.ComponentSchema {
  collectionName: 'components_global_field_without_labels';
  info: {
    description: '';
    displayName: 'FieldWithoutLabel';
  };
  attributes: {
    errorMessages: Schema.Attribute.JSON;
    placeholder: Schema.Attribute.String;
  };
}

export interface GlobalFooter extends Struct.ComponentSchema {
  collectionName: 'components_component_footers';
  info: {
    description: '';
    displayName: 'Footer';
  };
  attributes: {
    contactInfoHeading: Schema.Attribute.String;
    cookiesLink: Schema.Attribute.Component<'global.link', false>;
    customerServiceHeading: Schema.Attribute.String;
    emailLink: Schema.Attribute.Component<'global.link', false>;
    faqLink: Schema.Attribute.Component<'global.link', false>;
    openingHoursText: Schema.Attribute.String;
    oprBusinessId: Schema.Attribute.String;
    privacyPolicyLink: Schema.Attribute.Component<'global.link', false>;
    usefulLinksHeading: Schema.Attribute.String;
  };
}

export interface GlobalHeader extends Struct.ComponentSchema {
  collectionName: 'components_component_headers';
  info: {
    description: '';
    displayName: 'Header';
  };
  attributes: {
    helpText: Schema.Attribute.String;
    loginText: Schema.Attribute.String;
    logoutText: Schema.Attribute.String;
  };
}

export interface GlobalLink extends Struct.ComponentSchema {
  collectionName: 'components_global_links';
  info: {
    description: '';
    displayName: 'link';
  };
  attributes: {
    displayText: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface GlobalOprAddress extends Struct.ComponentSchema {
  collectionName: 'components_global_opr_addresses';
  info: {
    description: '';
    displayName: 'oprAddress';
  };
  attributes: {
    value: Schema.Attribute.String;
  };
}

export interface GlobalSessionModalWindow extends Struct.ComponentSchema {
  collectionName: 'components_global_session_modal_windows';
  info: {
    description: '';
    displayName: 'SessionModalWindow';
  };
  attributes: {
    body: Schema.Attribute.String;
    button_continue: Schema.Attribute.String;
    button_logout: Schema.Attribute.String;
    button_ok: Schema.Attribute.String;
    title: Schema.Attribute.String;
    title_end: Schema.Attribute.String;
  };
}

export interface KycBeneficialOwner extends Struct.ComponentSchema {
  collectionName: 'components_kyc_beneficial_owners';
  info: {
    description: '';
    displayName: 'beneficialOwner';
  };
  attributes: {
    addBObutton: Schema.Attribute.String;
    countryListLang: Schema.Attribute.Enumeration<['en', 'se', 'fi', 'nl']>;
    countryParameter: Schema.Attribute.String;
    countryPlaceholder: Schema.Attribute.String;
    countryQuestion: Schema.Attribute.String;
    errorMessages: Schema.Attribute.Relation<
      'oneToMany',
      'api::error-message.error-message'
    >;
    nameParameter: Schema.Attribute.String;
    namePlaceholder: Schema.Attribute.String;
    nameQuestion: Schema.Attribute.String;
    ownershipParameter: Schema.Attribute.String;
    ownershipPlaceholder: Schema.Attribute.String;
    ownershipQuestion: Schema.Attribute.String;
    ssnParameter: Schema.Attribute.String;
    ssnPlaceholder: Schema.Attribute.String;
    ssnQuestion: Schema.Attribute.String;
    useCountryList: Schema.Attribute.Boolean;
  };
}

export interface KycButton extends Struct.ComponentSchema {
  collectionName: 'components_kyc_buttons';
  info: {
    description: '';
    displayName: 'Button';
  };
  attributes: {
    back: Schema.Attribute.String;
    next: Schema.Attribute.String;
    submit: Schema.Attribute.String;
  };
}

export interface KycCompanyBlock extends Struct.ComponentSchema {
  collectionName: 'components_kyc_company_blocks';
  info: {
    description: '';
    displayName: 'CompanyBlock';
  };
  attributes: {
    companyName: Schema.Attribute.String;
    orgNumber: Schema.Attribute.String;
  };
}

export interface KycCountryOptions extends Struct.ComponentSchema {
  collectionName: 'components_kyc_country_options';
  info: {
    description: '';
    displayName: 'countryOptions';
    icon: 'earth';
  };
  attributes: {
    countryListLang: Schema.Attribute.Enumeration<['en', 'sv', 'fi', 'nl']>;
    useCountryList: Schema.Attribute.Boolean;
  };
}

export interface KycDependentQuestion extends Struct.ComponentSchema {
  collectionName: 'components_kyc_dependent_questions';
  info: {
    description: '';
    displayName: 'dependentQuestion';
    icon: 'chartPie';
  };
  attributes: {
    componentType: Schema.Attribute.Enumeration<
      [
        'Text',
        'Textarea',
        'Number',
        'RadioGroup',
        'Select',
        'MultiSelectDropdown',
        'BeneficiaryOwner',
      ]
    > &
      Schema.Attribute.Required;
    conditionValue: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<1>;
    countryNameLang: Schema.Attribute.Enumeration<['en', 'fi', 'se']>;
    errorMessages: Schema.Attribute.Relation<
      'oneToMany',
      'api::error-message.error-message'
    >;
    options: Schema.Attribute.Component<'kyc.option-item', true>;
    placeholder: Schema.Attribute.String;
    questionDescription: Schema.Attribute.Text;
    questionLabel: Schema.Attribute.Text & Schema.Attribute.Required;
    questionParameter: Schema.Attribute.String & Schema.Attribute.Required;
    useCountryList: Schema.Attribute.Boolean;
  };
}

export interface KycFooter extends Struct.ComponentSchema {
  collectionName: 'components_kyc_footers';
  info: {
    displayName: 'Footer';
  };
  attributes: {
    addressLabel: Schema.Attribute.String;
    addressText: Schema.Attribute.Text;
    contactInfoLabel: Schema.Attribute.String;
    contactInfoText: Schema.Attribute.Text;
    customerServiceLabel: Schema.Attribute.String;
    customerServiceText: Schema.Attribute.Text;
  };
}

export interface KycFormHeader extends Struct.ComponentSchema {
  collectionName: 'components_kyc_form_headers';
  info: {
    description: '';
    displayName: 'formHeader';
  };
  attributes: {
    subtitle: Schema.Attribute.Text & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface KycInfo extends Struct.ComponentSchema {
  collectionName: 'components_kyc_infos';
  info: {
    description: '';
    displayName: 'info';
  };
  attributes: {
    componentType: Schema.Attribute.Enumeration<['tooltip', 'subHeader']>;
    infoDescription: Schema.Attribute.Text;
    infoHeader: Schema.Attribute.Text;
  };
}

export interface KycOptionItem extends Struct.ComponentSchema {
  collectionName: 'components_kyc_option_items';
  info: {
    displayName: 'Option-item';
    icon: 'check';
  };
  attributes: {
    text: Schema.Attribute.String;
    value: Schema.Attribute.Integer;
  };
}

export interface KycQuestion extends Struct.ComponentSchema {
  collectionName: 'components_kyc_questions';
  info: {
    description: '';
    displayName: 'question-se';
  };
  attributes: {
    questions_se: Schema.Attribute.Relation<
      'oneToOne',
      'api::questions-se.questions-se'
    >;
    step: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 3;
          min: 1;
        },
        number
      >;
  };
}

export interface KycQuestionFi extends Struct.ComponentSchema {
  collectionName: 'components_kyc_question_fis';
  info: {
    description: '';
    displayName: 'question-fi';
  };
  attributes: {
    questions_fi: Schema.Attribute.Relation<
      'oneToOne',
      'api::questions-fi.questions-fi'
    >;
    step: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 3;
          min: 1;
        },
        number
      >;
  };
}

export interface KycSessionModal extends Struct.ComponentSchema {
  collectionName: 'components_kyc_session_modals';
  info: {
    displayName: 'sessionModal';
    icon: 'clock';
  };
  attributes: {
    continueSessionButton: Schema.Attribute.String;
    expiredDescription: Schema.Attribute.Text;
    expiredTitle: Schema.Attribute.String;
    loginButton: Schema.Attribute.String;
    logoutButton: Schema.Attribute.String;
    refreshDescription: Schema.Attribute.Text;
    refreshTitle: Schema.Attribute.String;
  };
}

export interface KycSteps extends Struct.ComponentSchema {
  collectionName: 'components_kyc_steps';
  info: {
    displayName: 'Steps';
  };
  attributes: {
    step1: Schema.Attribute.String;
    step2: Schema.Attribute.String;
    step3: Schema.Attribute.String;
  };
}

export interface NewsNews extends Struct.ComponentSchema {
  collectionName: 'components_news_news';
  info: {
    description: '';
    displayName: 'News';
  };
  attributes: {
    active: Schema.Attribute.Boolean;
    news: Schema.Attribute.Text;
    newsHeading: Schema.Attribute.String;
    publishedOn: Schema.Attribute.Date;
  };
}

export interface NoticeNotice extends Struct.ComponentSchema {
  collectionName: 'components_notice_notices';
  info: {
    description: '';
    displayName: 'Notice';
  };
  attributes: {
    active: Schema.Attribute.Boolean;
    label: Schema.Attribute.Enumeration<['None', 'Alert', 'Critical']>;
    notice: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'everyday-components.company-page': EverydayComponentsCompanyPage;
      'everyday-components.customer-service-page': EverydayComponentsCustomerServicePage;
      'everyday-components.ed-fi-global': EverydayComponentsEdFiGlobal;
      'everyday-components.error-page': EverydayComponentsErrorPage;
      'everyday-components.faq-item': EverydayComponentsFaqItem;
      'everyday-components.faq-page': EverydayComponentsFaqPage;
      'everyday-components.footer': EverydayComponentsFooter;
      'everyday-components.front-page': EverydayComponentsFrontPage;
      'everyday-components.link': EverydayComponentsLink;
      'everyday-components.loan-page': EverydayComponentsLoanPage;
      'everyday-components.news': EverydayComponentsNews;
      'everyday-components.not-found-page': EverydayComponentsNotFoundPage;
      'everyday-components.questions-section-1': EverydayComponentsQuestionsSection1;
      'fa-components.bank-account-list-block': FaComponentsBankAccountListBlock;
      'fa-components.bank-selection-block': FaComponentsBankSelectionBlock;
      'fa-components.consent-block': FaComponentsConsentBlock;
      'fa-components.loan-block': FaComponentsLoanBlock;
      'fa-components.open-banking-error': FaComponentsOpenBankingError;
      'fa-components.personal-info-block': FaComponentsPersonalInfoBlock;
      'fa-components.process-bar': FaComponentsProcessBar;
      'fa-components.title': FaComponentsTitle;
      'fa-components.your-options-block': FaComponentsYourOptionsBlock;
      'fo-components.account-detail-block': FoComponentsAccountDetailBlock;
      'fo-components.front-page-collection': FoComponentsFrontPageCollection;
      'fo-components.generic-table': FoComponentsGenericTable;
      'fo-components.header': FoComponentsHeader;
      'fo-components.loan-page-info-block': FoComponentsLoanPageInfoBlock;
      'fo-components.loan-page-invoice-block': FoComponentsLoanPageInvoiceBlock;
      'fo-components.loan-page-reporting-block': FoComponentsLoanPageReportingBlock;
      'fo-components.loan-page-transactions-block': FoComponentsLoanPageTransactionsBlock;
      'fo-components.loanpage-contact-block': FoComponentsLoanpageContactBlock;
      'fo-components.news-block': FoComponentsNewsBlock;
      'fo-components.topup-page-not-eligible-block': FoComponentsTopupPageNotEligibleBlock;
      'fo-components.withdraw-block': FoComponentsWithdrawBlock;
      'fo-pages.account-selection-page': FoPagesAccountSelectionPage;
      'fo-pages.customer-service-page': FoPagesCustomerServicePage;
      'fo-pages.error-page': FoPagesErrorPage;
      'fo-pages.expired-page': FoPagesExpiredPage;
      'fo-pages.front-page': FoPagesFrontPage;
      'fo-pages.loan-page': FoPagesLoanPage;
      'fo-pages.logged-out-page': FoPagesLoggedOutPage;
      'fo-pages.login-page': FoPagesLoginPage;
      'fo-pages.no-loan-page': FoPagesNoLoanPage;
      'fo-pages.start-page': FoPagesStartPage;
      'fo-pages.topup-page': FoPagesTopupPage;
      'fo-pages.user-page': FoPagesUserPage;
      'global.bullet-list': GlobalBulletList;
      'global.company-address': GlobalCompanyAddress;
      'global.contact': GlobalContact;
      'global.dynamic-loader': GlobalDynamicLoader;
      'global.field': GlobalField;
      'global.field-without-label': GlobalFieldWithoutLabel;
      'global.footer': GlobalFooter;
      'global.header': GlobalHeader;
      'global.link': GlobalLink;
      'global.opr-address': GlobalOprAddress;
      'global.session-modal-window': GlobalSessionModalWindow;
      'kyc.beneficial-owner': KycBeneficialOwner;
      'kyc.button': KycButton;
      'kyc.company-block': KycCompanyBlock;
      'kyc.country-options': KycCountryOptions;
      'kyc.dependent-question': KycDependentQuestion;
      'kyc.footer': KycFooter;
      'kyc.form-header': KycFormHeader;
      'kyc.info': KycInfo;
      'kyc.option-item': KycOptionItem;
      'kyc.question': KycQuestion;
      'kyc.question-fi': KycQuestionFi;
      'kyc.session-modal': KycSessionModal;
      'kyc.steps': KycSteps;
      'news.news': NewsNews;
      'notice.notice': NoticeNotice;
    }
  }
}

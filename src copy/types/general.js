"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.E_ApplicationChannel = exports.E_Flow = exports.E_Page_Ids = exports.E_Routes = exports.MaritialStatus = exports.MaritialStatusPlain = exports.EmploymentOptions = exports.EmploymentOptionsPlain = void 0;
var EmploymentOptionsPlain;
(function (EmploymentOptionsPlain) {
    EmploymentOptionsPlain["FULL"] = "Tillsvidareanst\u00E4lld";
    EmploymentOptionsPlain["TRIAL"] = "Provanst\u00E4lld";
    EmploymentOptionsPlain["RETIRED"] = "Pensionerad";
    EmploymentOptionsPlain["PROJECT"] = "Projektanst\u00E4lld";
    EmploymentOptionsPlain["SELF_EMPLOYED"] = "Egenf\u00F6retagare";
    EmploymentOptionsPlain["NO_WORK"] = "Arbetsl\u00F6s";
    EmploymentOptionsPlain["STUDENT"] = "Student";
    EmploymentOptionsPlain["TEMPORARY"] = "Vikarie";
})(EmploymentOptionsPlain || (exports.EmploymentOptionsPlain = EmploymentOptionsPlain = {}));
var EmploymentOptions;
(function (EmploymentOptions) {
    EmploymentOptions["FULL"] = "FULL";
    EmploymentOptions["TRIAL"] = "TRIAL";
    EmploymentOptions["RETIRED"] = "RETIRED";
    EmploymentOptions["PROJECT"] = "PROJECT";
    EmploymentOptions["SELF_EMPLOYED"] = "SELF_EMPLOYED";
    EmploymentOptions["NO_WORK"] = "NO_WORK";
    EmploymentOptions["STUDENT"] = "STUDENT";
    EmploymentOptions["TEMPORARY"] = "TEMPORARY";
})(EmploymentOptions || (exports.EmploymentOptions = EmploymentOptions = {}));
var MaritialStatusPlain;
(function (MaritialStatusPlain) {
    MaritialStatusPlain["DIVORCED"] = "Skild";
    MaritialStatusPlain["MARRIED"] = "Gift";
    MaritialStatusPlain["PARTNER"] = "Sambo";
    MaritialStatusPlain["SINGLE"] = "Singel";
    MaritialStatusPlain["WIDOWED"] = "\u00C4nka/\u00C4nkling";
})(MaritialStatusPlain || (exports.MaritialStatusPlain = MaritialStatusPlain = {}));
var MaritialStatus;
(function (MaritialStatus) {
    MaritialStatus["DIVORCED"] = "DIVORCED";
    MaritialStatus["MARRIED"] = "MARRIED";
    MaritialStatus["PARTNER"] = "PARTNER";
    MaritialStatus["SINGLE"] = "SINGLE";
    MaritialStatus["WIDOWED"] = "WIDOWED";
})(MaritialStatus || (exports.MaritialStatus = MaritialStatus = {}));
var E_Routes;
(function (E_Routes) {
    E_Routes["ROOT"] = "/";
    E_Routes["LOGIN"] = "/login";
    E_Routes["ACCOUNTS"] = "/chooseaccount";
    E_Routes["USER"] = "/user";
    E_Routes["FRONT"] = "/front";
    E_Routes["LOAN"] = "/loan";
    E_Routes["CONTACT"] = "/contact";
    E_Routes["CHANGE"] = "/change";
    E_Routes["TOPUP"] = "/topup";
    E_Routes["LOGOUT"] = "/logout";
    E_Routes["ERROR"] = "/error";
    E_Routes["NO_LOAN"] = "/noloan";
    E_Routes["EXPIRED"] = "/expired";
    E_Routes["CHOOSE_ACCOUNT"] = "/chooseaccount";
    E_Routes["NOT_FOUND"] = "/notfound";
    E_Routes["ALL_OTHERS"] = "*";
    E_Routes["KYC"] = "/application/:id";
    E_Routes["APPLICATION"] = "/application";
    E_Routes["THANK_YOU"] = "/thank-you";
    E_Routes["KYC_COMPLETED"] = "/kyc-completed";
})(E_Routes || (exports.E_Routes = E_Routes = {}));
var E_Page_Ids;
(function (E_Page_Ids) {
    E_Page_Ids["START"] = "startpage";
    E_Page_Ids["LOGIN"] = "loginpage";
    E_Page_Ids["ACCOUNTS"] = "accountspage";
    E_Page_Ids["USER"] = "userpage";
    E_Page_Ids["FRONT"] = "frontpage";
    E_Page_Ids["LOAN"] = "loanpage";
    E_Page_Ids["CONTACT"] = "contactpage";
    E_Page_Ids["CHANGE"] = "changepage";
    E_Page_Ids["TOPUP"] = "topuppage";
    E_Page_Ids["LOGOUT"] = "logoutpage";
    E_Page_Ids["ERROR"] = "errorpage";
    E_Page_Ids["NO_LOAN"] = "noloanpage";
    E_Page_Ids["EXPIRED"] = "expiredpage";
    E_Page_Ids["CHOOSE_ACCOUNT"] = "chooseaccountpage";
    E_Page_Ids["APPLICATION"] = "application";
})(E_Page_Ids || (exports.E_Page_Ids = E_Page_Ids = {}));
var E_Flow;
(function (E_Flow) {
    E_Flow["KYCFF"] = "kyc-ff";
})(E_Flow || (exports.E_Flow = E_Flow = {}));
var E_ApplicationChannel;
(function (E_ApplicationChannel) {
    E_ApplicationChannel["PHONE"] = "PHONE";
    E_ApplicationChannel["BROKER"] = "BROKER";
    E_ApplicationChannel["LETTER"] = "LETTER";
    E_ApplicationChannel["WEB"] = "WEB";
})(E_ApplicationChannel || (exports.E_ApplicationChannel = E_ApplicationChannel = {}));
//# sourceMappingURL=general.js.map
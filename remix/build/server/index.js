import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { ServerRouter, useSubmit, useNavigation, Form, useLoaderData, createCookie, createSessionStorage, UNSAFE_withComponentProps, Outlet, UNSAFE_withErrorBoundaryProps, useRouteError, useRouteLoaderData, isRouteErrorResponse, Meta, Links, ScrollRestoration, Scripts, useActionData, redirect } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { z } from "zod";
import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { byPrefixAndName } from "@awesome.me/kit-f1ba5d0607/icons";
import { Tooltip as Tooltip$1, Select, Checkbox as Checkbox$1, Popover as Popover$1, RadioGroup } from "radix-ui";
const ABORT_DELAY = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, reactRouterContext, loadContext) {
  return isbot(request.headers.get("user-agent") || "") ? handleBotRequest(request, responseStatusCode, responseHeaders, reactRouterContext) : handleBrowserRequest(request, responseStatusCode, responseHeaders, reactRouterContext);
}
function handleBotRequest(request, responseStatusCode, responseHeaders, reactRouterContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(ServerRouter, { context: reactRouterContext, url: request.url }),
      {
        onAllReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
function handleBrowserRequest(request, responseStatusCode, responseHeaders, reactRouterContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(ServerRouter, { context: reactRouterContext, url: request.url }),
      {
        onShellReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest
}, Symbol.toStringTag, { value: "Module" }));
const Container = ({ className, children }) => {
  if (className) return /* @__PURE__ */ jsx("div", { className, children });
  return /* @__PURE__ */ jsx("div", { children });
};
const Text = ({ children, className, showAs }) => {
  if (showAs && showAs === "span") return /* @__PURE__ */ jsx("span", { className, children });
  return /* @__PURE__ */ jsx("p", { className, children });
};
var mainContentStyle = "_17x5a000";
var mainContainerStyle = "_17x5a001";
var formQuestionsContainer = "_17x5a002";
var pageContentStyle = "_196kk9n0";
var formTitleStyle = "_12b54f10";
var titleStyle = "_12b54f11";
var subtitleStyle = "_12b54f12";
var badgeActiveStyle = "_15oije00";
var progressLineActiveStyle = "_15oije01";
var labelStyle = "_15oije02";
var labelActiveStyle = "_15oije03";
var companyInfoContainerStyle = "_1bkzfku0";
var companyInfoGridStyle = "_1bkzfku1";
var companyInfoLabelStyle = "_1bkzfku2";
var companyInfoStyle = "_1bkzfku3";
var questionsStyle = "_1n2ssk50";
var b2bRadiogroupRootStyle = "_1itbld31";
var b2bRadioItemStyle = "_1itbld32";
var b2bRadioIndicatorStyle = "_1itbld33";
var b2bRadioItemLabelStyle = "_1itbld34";
var boComponentContainer = "_14lgrak0";
var boLabelAndButtonContainer = "_14lgrak1";
var boLabelButtonRow = "_14lgrak2";
var boButtonContainer = "_14lgrak3";
var boPopoverButton = "_14lgrak4";
var boCloseIcon = "_14lgrak5";
var boQuestionsStyle = "_14lgrak6";
var addBoFormButton = "_14lgrak7";
var boResultAndButton = "_14lgrak8";
var removeBoFormButton = "_14lgrak9";
var boResultContainer = "_14lgraka";
var boResultValuesContainer = "_14lgrakb";
var boResultValueLabelContainer = "_14lgrakc";
var boResultValueContainer = "_14lgrakd";
var statusPageContainer = "_1yi33w0";
var statusPageBodyText = "_1yi33w2";
var statusPageButton = "_1yi33w3 _1wan2qm0";
var stepsWrapperStyle = "_1drq630";
var dividerStyle = "_1drq631";
var buttonContainerStyle = "_1drq632";
var singleButtonContainerStyle = "_1drq633";
var buttonStyles = "_1wan2qm0";
const Button = ({
  label,
  onClick,
  type,
  className,
  disabled,
  ariaLabel
}) => {
  const btnClassNames = className || buttonStyles;
  return /* @__PURE__ */ jsx(
    "button",
    {
      type,
      disabled,
      className: btnClassNames,
      onClick: () => onClick?.(),
      "aria-label": ariaLabel,
      children: label
    }
  );
};
const isBeneficialOwnerQuestion = (question) => {
  return question.__component === "kyc.beneficial-owner";
};
const isDependentQuestion = (question) => {
  return question.__component === "kyc.dependent-question";
};
const isCountryListUsed = (item) => {
  if (item.question.dependentQuestion?.useCountryList) return true;
  if (item.question.useCountryList) return true;
  return false;
};
const isCountryOptions = (question) => {
  return question.__component === "kyc.country-options";
};
const isInfo = (question) => {
  return question.__component === "kyc.info";
};
const MARKETING_URLS = {
  "sweden-b2b-application": "https://www.opr.se",
  fi: "https://www.yritysluotto.fi",
  default: "https://en.opr-finance.fi"
};
function clearLocalSession() {
  if (typeof window !== "undefined" && window.localStorage) {
    window.localStorage.clear();
  }
}
function redirectToLogin(applicationId) {
  const loginbaseUrl = localStorage.getItem("loginUrl") ?? "";
  const loginUrl = `${loginbaseUrl}/${applicationId ?? ""}`;
  clearLocalSession();
  window.location.replace(loginUrl);
}
function redirectToMarketingPage(productCode = "default") {
  clearLocalSession();
  const targetUrl = MARKETING_URLS[productCode.toLowerCase()];
  if (targetUrl) window.location.assign(targetUrl);
}
function getLanguageFromProductId(productId) {
  const lowerCaseProductId = productId.toLowerCase();
  if (lowerCaseProductId.includes("sweden") || lowerCaseProductId.includes("se")) {
    return "sv";
  }
  if (lowerCaseProductId.includes("finland") || lowerCaseProductId.includes("fi")) {
    return "fi";
  }
  return "en";
}
const FALLBACK_MESSAGES = {
  "404": { message: "Page not found", label: "Login" },
  "500": { message: "Something went wrong", label: "Login" },
  "440": { message: "Session expired", label: "Login" },
  "401": { message: "Not authorized", label: "Login" },
  "400": { message: "Bad request", label: "Login" }
};
const ErrorHandler = ({ status, message, statusMessages }) => {
  const code = String(status);
  const strapiMsg = statusMessages?.[code];
  const fallbackMsg = FALLBACK_MESSAGES[code];
  const displayMessage = strapiMsg?.message || fallbackMsg?.message || message;
  const buttonLabel = strapiMsg?.label || fallbackMsg?.label || "Log in";
  const handleRedirectToLogin = () => {
    const id = localStorage.getItem("applicationId") || null;
    redirectToLogin(id);
  };
  return /* @__PURE__ */ jsx(ErrorView, { status, message: displayMessage, children: /* @__PURE__ */ jsx(
    Button,
    {
      type: "button",
      className: statusPageButton,
      label: buttonLabel,
      onClick: handleRedirectToLogin
    }
  ) });
};
const ErrorView = ({ message, children }) => {
  return /* @__PURE__ */ jsx(Container, { className: mainContentStyle, children: /* @__PURE__ */ jsxs(Container, { className: statusPageContainer, children: [
    /* @__PURE__ */ jsx(Text, { className: statusPageBodyText, children: message }),
    children
  ] }) });
};
const Info = ({ children, className }) => {
  return /* @__PURE__ */ jsx("div", { className, children });
};
const CompanyInfo = ({
  companyName,
  companyNameLabel,
  orgNumber,
  orgNumberLabel
}) => {
  return /* @__PURE__ */ jsx(Container, { className: companyInfoContainerStyle, children: /* @__PURE__ */ jsxs(Info, { className: companyInfoGridStyle, children: [
    /* @__PURE__ */ jsxs(Container, { children: [
      /* @__PURE__ */ jsx(Text, { className: companyInfoLabelStyle, children: companyNameLabel }),
      /* @__PURE__ */ jsx(Text, { className: companyInfoStyle, children: companyName })
    ] }),
    /* @__PURE__ */ jsxs(Container, { children: [
      /* @__PURE__ */ jsx(Text, { className: companyInfoLabelStyle, children: orgNumberLabel }),
      /* @__PURE__ */ jsx(Text, { className: companyInfoStyle, children: orgNumber })
    ] })
  ] }) });
};
var modalOverlayStyles = "_4bz3f50";
var modalContentContainerStyles = "_4bz3f51";
var modalTitleStyles = "_4bz3f52";
var modalDescriptionStyles = "_4bz3f53";
var modalActionBlockStyles = "_4bz3f54";
var modalButtonStyles = "_4bz3f55";
const ModalDialog = (props) => {
  const {
    isOpen,
    title,
    description,
    firstActionText,
    firstAction,
    secondActionText,
    secondAction,
    isLoading,
    classNames
  } = props;
  if (!isOpen) return null;
  const overlayStyles = classNames?.modalOverlay || modalOverlayStyles;
  const contentStyles = classNames?.modalContentContainer || modalContentContainerStyles;
  const titleStyles = classNames?.modalTitle || modalTitleStyles;
  const descriptionStyles = classNames?.modalDescription || modalDescriptionStyles;
  const actionStyles = classNames?.modalActionBlock || modalActionBlockStyles;
  const buttonStyles2 = classNames?.modalButton || modalButtonStyles;
  return /* @__PURE__ */ jsx("div", { className: overlayStyles, children: /* @__PURE__ */ jsxs("div", { className: contentStyles, children: [
    /* @__PURE__ */ jsx("h2", { className: titleStyles, children: title }),
    description && /* @__PURE__ */ jsx("p", { className: descriptionStyles, children: description }),
    /* @__PURE__ */ jsxs("div", { className: actionStyles, children: [
      /* @__PURE__ */ jsx("button", { className: buttonStyles2, onClick: firstAction, disabled: isLoading, children: firstActionText }),
      secondActionText && secondAction && /* @__PURE__ */ jsx(
        "button",
        {
          className: buttonStyles2,
          onClick: secondAction,
          disabled: isLoading,
          children: secondActionText
        }
      )
    ] })
  ] }) });
};
const submitFormAnswers = (formValues, formId, submit) => {
  const answersArray = Array.from(formValues.values());
  const formDataToSubmit = new FormData();
  formDataToSubmit.append("answers", JSON.stringify(answersArray));
  formDataToSubmit.append("questionSetId", String(formId));
  submit(formDataToSubmit, { method: "post" });
};
const requestSessionRefresh = async () => {
  try {
    console.log("[requestSessionRefresh] Refreshing session via BFF...");
    const res = await fetch("/refresh-session", {
      method: "POST",
      credentials: "include",
      // send cookies
      headers: {
        Accept: "application/json"
      }
    });
    if (!res.ok) {
      console.warn("[requestSessionRefresh] failed:", res.status);
      return null;
    }
    const data = await res.json();
    let exp = data?.exp;
    if (typeof exp !== "number") return null;
    if (exp < 1e12) exp = exp * 1e3;
    const sessionRefreshCount = data?.sessionRefreshCount;
    if (typeof sessionRefreshCount !== "number") return null;
    return { exp, sessionRefreshCount };
  } catch (err) {
    console.error("[requestSessionRefresh] Error:", err);
    return null;
  }
};
async function callEndSession() {
  try {
    await fetch("/end-session", {
      method: "POST",
      credentials: "same-origin"
    });
  } catch (err) {
    console.error("Failed to end session", err);
  }
}
function showSessionModal(payload) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("session:modal:show", { detail: payload })
  );
}
function ThrowError({ error }) {
  throw error;
}
function ThrowResponse$1({ response }) {
  throw response;
}
const SessionModalManager = ({
  refreshTitle,
  refreshDescription,
  continueSessionButton,
  expiredTitle,
  expiredDescription,
  loginButton,
  logoutButton,
  sessionData
}) => {
  const { applicationId, productId } = sessionData;
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState(void 0);
  const [isLoading, setIsLoading] = useState(false);
  const [fatal, setFatal] = useState(null);
  const autoLogoutTimerRef = useRef(null);
  const handleRedirectToLogin = () => {
    const id = applicationId ?? localStorage.getItem("applicationId");
    void doEndSession(() => redirectToLogin(id));
  };
  const refreshModalContent = {
    title: refreshTitle,
    description: refreshDescription,
    continueButton: continueSessionButton,
    logoutButton
  };
  const expiredModalContent = {
    title: expiredTitle,
    description: expiredDescription,
    continueButton: loginButton,
    logoutButton
  };
  const modalContent = modalType === "expired" ? expiredModalContent : refreshModalContent;
  const { title, description, continueButton, logoutButton: logoutText } = modalContent;
  const clearAutoLogoutTimer = () => {
    if (autoLogoutTimerRef.current) {
      clearTimeout(autoLogoutTimerRef.current);
      autoLogoutTimerRef.current = null;
    }
  };
  useEffect(() => {
    const onShow = (ev) => {
      const d = ev.detail;
      setModalType(d.type);
      setIsOpen(true);
      const ms = Math.max(5e3, typeof d.remainingMs === "number" ? d.remainingMs : 6e4);
      clearAutoLogoutTimer();
      autoLogoutTimerRef.current = setTimeout(() => {
        return handleRedirectToLogin();
      }, ms);
    };
    window.addEventListener("session:modal:show", onShow);
    return () => {
      window.removeEventListener("session:modal:show", onShow);
      clearAutoLogoutTimer();
    };
  }, [applicationId]);
  const doEndSession = async (redirectFn) => {
    if (isLoading) return;
    clearAutoLogoutTimer();
    setIsLoading(true);
    try {
      await callEndSession();
    } catch (err) {
      console.error("Logout request failed:", err);
    } finally {
      try {
        setIsOpen(false);
        redirectFn();
      } finally {
        setIsLoading(false);
      }
    }
  };
  const handleContinue = async () => {
    clearAutoLogoutTimer();
    if (modalType === "expired") {
      console.log("Expired, redirect to login page", "start/");
      return handleRedirectToLogin();
    }
    setIsLoading(true);
    console.log("Continue session (UI requests manager to refresh)");
    const waitForRefreshResponse = (timeoutMs = 15e3) => new Promise((resolve) => {
      let timer = null;
      const onResponse = (ev) => {
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
        const detail = ev.detail ?? {};
        window.removeEventListener(
          "session:refresh-response",
          onResponse
        );
        resolve(detail);
      };
      window.addEventListener("session:refresh-response", onResponse);
      timer = setTimeout(() => {
        window.removeEventListener(
          "session:refresh-response",
          onResponse
        );
        resolve({
          success: false,
          response: new Response("Session refresh timeout", {
            status: 504,
            statusText: "Gateway Timeout"
          })
        });
      }, timeoutMs);
      window.dispatchEvent(new CustomEvent("session:refresh-request"));
    });
    try {
      const { success, response } = await waitForRefreshResponse(15e3);
      if (!success) {
        const resp = response instanceof Response ? response : new Response("Session refresh failed", {
          status: 401,
          statusText: "Unauthorized"
        });
        setFatal(resp);
        return;
      }
      setIsOpen(false);
    } catch (err) {
      console.error("handleContinue unexpected error", err);
      const message = err instanceof Error ? err.message : "Unknown error during refresh";
      setFatal(new Response(message, { status: 500, statusText: "Session Refresh Error" }));
    } finally {
      setIsLoading(false);
    }
  };
  const handleLogout = async () => {
    void doEndSession(() => redirectToMarketingPage(productId));
  };
  if (fatal) {
    if (fatal instanceof Response) {
      return /* @__PURE__ */ jsx(ThrowResponse$1, { response: fatal });
    }
    return /* @__PURE__ */ jsx(ThrowError, { error: fatal });
  }
  return /* @__PURE__ */ jsx(
    ModalDialog,
    {
      isOpen,
      title,
      description,
      firstActionText: continueButton,
      secondActionText: logoutText,
      firstAction: handleContinue,
      secondAction: handleLogout,
      isLoading
    }
  );
};
var stepsStyle = "ny1ddr0";
var stepsContainerStyle = "ny1ddr1";
var stepsFilledLineStyle = "ny1ddr2";
var stepContainerStyle = "an7xuw0";
var stepCircleStyle = "an7xuw1";
var stepCircleCompletedStyle = "an7xuw2";
var stepCountSyle = "an7xuw3";
var stepActiveStyle = "an7xuw4";
var stepDoneStyle = "an7xuw5";
var stepLabelContainerStyle = "an7xuw6";
var stepLabelStyle = "an7xuw7";
var stepActiveLabelStyle = "an7xuw8";
const StepLabel = ({
  label,
  defaultClasses,
  hardcodedClasses,
  overridingClasses
}) => {
  const classes = hardcodedClasses || overridingClasses || defaultClasses;
  return /* @__PURE__ */ jsx("span", { className: classes, children: label });
};
const StepContainer = ({
  children,
  defaultClasses,
  hardcodedClasses,
  overridingClasses,
  style
}) => {
  const classes = hardcodedClasses || overridingClasses || defaultClasses;
  return /* @__PURE__ */ jsx("div", { className: classes, style, children });
};
const StepBadge = ({
  children,
  defaultClasses,
  hardcodedClasses,
  overridingClasses
}) => {
  const classes = hardcodedClasses || overridingClasses || defaultClasses;
  return /* @__PURE__ */ jsx("div", { className: classes, children });
};
const Icon = ({ iconName, iconPrefix, className }) => {
  const icon = byPrefixAndName[iconPrefix][iconName];
  return /* @__PURE__ */ jsx(FontAwesomeIcon, { icon, className });
};
const Step = ({
  activeStep,
  currentStep,
  label,
  styling
}) => {
  const isDone = activeStep > currentStep;
  const isActive = activeStep >= currentStep;
  const getClasses = (condition, classNameToCheck, addittionalClassName) => {
    let classNamesToReturn;
    if (classNameToCheck) classNamesToReturn = classNameToCheck;
    if (condition && addittionalClassName)
      classNamesToReturn = `${classNamesToReturn ?? ""} ${addittionalClassName}`;
    return classNamesToReturn;
  };
  return /* @__PURE__ */ jsxs("div", { className: stepContainerStyle, children: [
    /* @__PURE__ */ jsx(
      StepBadge,
      {
        defaultClasses: `${stepCircleStyle} ${isActive ? stepCircleCompletedStyle : ""}`,
        overridingClasses: getClasses(
          isActive,
          styling?.badge?.stepBadgeClasses,
          styling?.badge?.stepBadgeCompletedClasses
        ),
        children: isDone ? /* @__PURE__ */ jsx(
          StepLabel,
          {
            defaultClasses: stepDoneStyle,
            overridingClasses: getClasses(
              false,
              styling?.badge?.stepCounterDoneStyles,
              void 0
            ),
            label: /* @__PURE__ */ jsx(Icon, { iconName: "check", iconPrefix: "fas" })
          }
        ) : /* @__PURE__ */ jsx(
          StepLabel,
          {
            defaultClasses: `${stepCountSyle} ${isActive ? stepActiveStyle : ""}`,
            overridingClasses: getClasses(
              isActive,
              styling?.badge?.stepCounterClasses,
              styling?.badge?.stepCounterActiveStyles
            ),
            label: `${currentStep}`
          }
        )
      }
    ),
    /* @__PURE__ */ jsx(
      StepContainer,
      {
        defaultClasses: stepLabelContainerStyle,
        overridingClasses: styling?.label?.stepContainerClasses,
        children: /* @__PURE__ */ jsx(
          StepLabel,
          {
            defaultClasses: `${stepLabelStyle} ${isActive ? stepActiveLabelStyle : ""}`,
            overridingClasses: getClasses(
              isActive,
              styling?.label?.stepLabelClasses,
              styling?.label?.stepActiveLabelClasses
            ),
            label
          }
        )
      }
    )
  ] });
};
const Steps = ({ activeStep, steps, styling }) => {
  const totalSteps = steps.length;
  const width = `${100 / (totalSteps - 1) * (activeStep - 1)}%`;
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx("div", { className: stepsStyle, children: /* @__PURE__ */ jsxs("div", { className: stepsContainerStyle, children: [
    steps.map((step, index) => {
      return /* @__PURE__ */ jsx(
        Step,
        {
          currentStep: index + 1,
          label: step.stepLabel,
          activeStep,
          styling: {
            badge: {
              stepBadgeCompletedClasses: styling?.badge?.stepBadgeCompletedClasses,
              stepCounterDoneStyles: styling?.badge?.stepCounterDoneStyles
            },
            label: {
              stepContainerClasses: styling?.label?.stepContainerClasses,
              stepActiveLabelClasses: styling?.label?.stepActiveLabelClasses,
              stepLabelClasses: styling?.label?.stepLabelClasses
            }
          }
        },
        step.stepName
      );
    }),
    /* @__PURE__ */ jsx(
      StepContainer,
      {
        defaultClasses: stepsFilledLineStyle,
        overridingClasses: styling?.statusLine?.fillDone,
        style: { width }
      }
    )
  ] }) }) });
};
const Title = ({
  className,
  subtitle,
  subtitleClassName,
  title,
  titleClassName
}) => {
  return /* @__PURE__ */ jsxs("div", { className, children: [
    title && /* @__PURE__ */ jsx("h2", { className: titleClassName, children: title }),
    subtitle && /* @__PURE__ */ jsx("p", { className: subtitleClassName, children: subtitle })
  ] });
};
var dropDownContainerStyle = "_1u4gsr70";
var dropDownStyle = "_1u4gsr72";
var multiSelectFieldButton = "_1u4gsr73";
var dropDownOpenIconStyle = "_1u4gsr74";
var dropDownListStyle = "_1u4gsr75";
var multiSelectListStyle = "_1u4gsr76";
var dropDownViewportStyle = "_1u4gsr77";
var dropDownItemStyles = "_1u4gsr78";
var dropDownItemIndicatorStyles = "_1u4gsr79";
var iconStyle = "_1u4gsr7a";
var selectPlaceholder = "_1u4gsr7b";
var multiSelectTagsContainer = "_1u4gsr7c";
var multiSelectFieldContainer = "_1u4gsr7d";
var multiSelectTag = "_1u4gsr7e";
var multiSelectTagRemove = "_1u4gsr7f";
var multiSelectCheckbox = "_1u4gsr7g";
var multiSelectOptionText = "_1u4gsr7h";
var multiSelectOptionButton = "_1u4gsr7i";
var errorTextStyle = "msrlt70";
const ErrorMessage = ({ error, classNames }) => {
  if (!error) return null;
  const textStyle = classNames?.errorTextStyle ? classNames.errorTextStyle : errorTextStyle;
  return /* @__PURE__ */ jsx(Text, { className: textStyle, children: error });
};
var filterContainerStyle = "_18lbym40";
var filterInputStyle = "_18lbym41";
const DEFAULT_PLACEHOLDER$1 = "Search...";
const Filter = ({
  placeholder,
  fieldName,
  classNames,
  onChange
}) => {
  const containerStyle = classNames?.containerClassName || filterContainerStyle;
  const inputStyle = classNames?.inputClassName || filterInputStyle;
  return /* @__PURE__ */ jsx(Container, { className: containerStyle, children: /* @__PURE__ */ jsx(
    "input",
    {
      name: fieldName,
      id: fieldName,
      type: "text",
      className: inputStyle,
      placeholder: placeholder || DEFAULT_PLACEHOLDER$1,
      onChange: (e) => {
        e.preventDefault();
        onChange(e.target.value);
      },
      onKeyDown: (e) => e.stopPropagation()
    }
  ) });
};
const NO_RESULTS = "__no results__";
const DEFAULT_PLACEHOLDER = "Type to filter...";
const NO_RESULTS_DEFAULT_TEXT = "No results";
var tooltipTriggerStyles = "_10c4ple0";
var tooltipContentStyles = "_10c4ple1";
var tooltipArrowStyles = "_10c4ple2";
var tooltipHeaderStyles = "_10c4ple3";
var tooltipDescriptionStyles = "_10c4ple4";
const Tooltip = ({
  header,
  description,
  side = "top",
  sideOffset = 5,
  classNames
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerStyles = classNames?.tooltipTrigger || tooltipTriggerStyles;
  const contentStyles = classNames?.tooltipContent || tooltipContentStyles;
  const arrowStyles = classNames?.tooltipArrow || tooltipArrowStyles;
  const headerStyles2 = classNames?.tooltipHeader || tooltipHeaderStyles;
  const descriptionStyles = classNames?.tooltipDescription || tooltipDescriptionStyles;
  return /* @__PURE__ */ jsx(Tooltip$1.Provider, { children: /* @__PURE__ */ jsxs(Tooltip$1.Root, { open: isOpen, onOpenChange: setIsOpen, children: [
    /* @__PURE__ */ jsx(Tooltip$1.Trigger, { asChild: true, children: /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        className: triggerStyles,
        onClick: () => setIsOpen(!isOpen),
        "aria-label": "Show information",
        children: /* @__PURE__ */ jsx(Icon, { iconName: "info", iconPrefix: "fas" })
      }
    ) }),
    /* @__PURE__ */ jsx(Tooltip$1.Portal, { children: /* @__PURE__ */ jsxs(
      Tooltip$1.Content,
      {
        className: contentStyles,
        side,
        sideOffset,
        children: [
          header && /* @__PURE__ */ jsx("h4", { className: headerStyles2, children: header }),
          description && /* @__PURE__ */ jsx("p", { className: descriptionStyles, children: description }),
          /* @__PURE__ */ jsx(Tooltip$1.Arrow, { className: arrowStyles })
        ]
      }
    ) })
  ] }) });
};
var labelContainerStyle = "_8lzndu0";
var labelTextStyle = "_8lzndu1";
var labelWithTooltipStyle = "_8lzndu2";
var tooltipWrapperStyle = "_8lzndu3";
var subHeaderStyle = "_8lzndu4";
const Label = ({
  htmlFor,
  children,
  className = labelContainerStyle,
  labelClassName = labelTextStyle,
  infoItems
}) => {
  const items = infoItems || [];
  const tooltip = items.find((item) => item.componentType === "tooltip");
  const subHeader = items.find((item) => item.componentType === "subHeader");
  return /* @__PURE__ */ jsxs(Container, { className, children: [
    /* @__PURE__ */ jsxs("div", { className: labelWithTooltipStyle, children: [
      /* @__PURE__ */ jsx("label", { className: labelClassName, htmlFor, children }),
      tooltip && /* @__PURE__ */ jsx("div", { className: tooltipWrapperStyle, children: /* @__PURE__ */ jsx(
        Tooltip,
        {
          header: tooltip.infoHeader,
          description: tooltip.infoDescription
        }
      ) })
    ] }),
    subHeader && /* @__PURE__ */ jsxs(Info, { className: subHeaderStyle, children: [
      subHeader.infoHeader && /* @__PURE__ */ jsx("span", { children: subHeader.infoHeader }),
      subHeader.infoDescription && /* @__PURE__ */ jsx("p", { children: subHeader.infoDescription })
    ] })
  ] });
};
const DropDown = ({
  fieldName,
  label,
  options,
  onChange,
  onBlur,
  placeholder,
  value,
  errorClassNames,
  error,
  classNames,
  showSelectedItemIcon,
  searchEnabled,
  searchNoResultsText,
  searchPlaceholder,
  infoItems
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [optionsArray, setOptionsArray] = useState(options || []);
  const getDisplayText = (val) => {
    if (!val) return "";
    return val.text || "";
  };
  const [selectedValue, setSelectedValue] = useState(() => getDisplayText(value));
  useEffect(() => {
    setSelectedValue(getDisplayText(value));
  }, [value?.text, options]);
  const selectContainer = classNames?.dropDownContainer || dropDownContainerStyle;
  const selectField = classNames?.dropDownField || dropDownStyle;
  const selectValue = classNames?.dropDownValue || selectPlaceholder;
  const selectIcon = classNames?.dropDownIcon || dropDownOpenIconStyle;
  const selectValuesList = classNames?.dropDownSelectionList || dropDownListStyle;
  const selectViewport = classNames?.dropDownViewport || dropDownViewportStyle;
  const selectItem = classNames?.dropDownItem || dropDownItemStyles;
  const selectItemIndicator = classNames?.dropDownItemIndicator || dropDownItemIndicatorStyles;
  const searchLabel = searchNoResultsText || NO_RESULTS_DEFAULT_TEXT;
  const searchPlaceholderText = searchPlaceholder || DEFAULT_PLACEHOLDER;
  const filterContent = (searchText) => {
    if (searchText.length > 1 && options) {
      const result = options?.filter(
        (option) => option.text.toLowerCase().includes(searchText.toLowerCase())
      );
      if (result.length > 0) {
        setOptionsArray(result);
      } else {
        setOptionsArray([{ text: searchLabel, value: NO_RESULTS }]);
      }
    }
    if (!searchText) setOptionsArray(options || []);
  };
  const handleValueChange = (selectedText) => {
    const option = optionsArray?.find((opt) => opt.text === selectedText);
    if (!option) return;
    setSelectedValue(selectedText);
    onChange(option.value, option.text);
  };
  return /* @__PURE__ */ jsxs(Container, { className: selectContainer, children: [
    /* @__PURE__ */ jsx(Label, { htmlFor: fieldName, infoItems, children: label }),
    /* @__PURE__ */ jsxs(
      Select.Root,
      {
        value: selectedValue,
        onValueChange: handleValueChange,
        open: isOpen,
        onOpenChange: setIsOpen,
        name: fieldName,
        children: [
          /* @__PURE__ */ jsxs(
            Select.Trigger,
            {
              className: selectField,
              "aria-label": label,
              onBlur: (e) => onBlur(e),
              children: [
                /* @__PURE__ */ jsx(Select.Value, { className: selectValue, placeholder }),
                /* @__PURE__ */ jsx(Select.Icon, { className: selectIcon, children: isOpen ? /* @__PURE__ */ jsx(Icon, { iconName: "chevron-up", iconPrefix: "far" }) : /* @__PURE__ */ jsx(Icon, { iconName: "chevron-down", iconPrefix: "far" }) })
              ]
            }
          ),
          /* @__PURE__ */ jsx(Select.Portal, { children: /* @__PURE__ */ jsxs(
            Select.Content,
            {
              className: selectValuesList,
              position: "popper",
              sideOffset: 5,
              collisionPadding: 10,
              children: [
                searchEnabled && /* @__PURE__ */ jsx(
                  Filter,
                  {
                    placeholder: searchPlaceholderText,
                    onChange: (searchValue) => filterContent(searchValue),
                    fieldName: `search_${fieldName}`,
                    classNames: {
                      containerClassName: classNames?.filterContainer,
                      inputClassName: classNames?.filterInput
                    }
                  }
                ),
                /* @__PURE__ */ jsx(Select.Viewport, { className: selectViewport, children: optionsArray?.map((option, index) => /* @__PURE__ */ jsx(
                  SelectItem,
                  {
                    value: option.text,
                    disabled: option.text === NO_RESULTS,
                    className: selectItem,
                    indicatorClassName: selectItemIndicator,
                    showSelectedIndicator: showSelectedItemIcon,
                    children: option.text
                  },
                  `${fieldName}_${index}`
                )) })
              ]
            }
          ) })
        ]
      }
    ),
    /* @__PURE__ */ jsx(ErrorMessage, { error, classNames: errorClassNames })
  ] });
};
const SelectItem = React.forwardRef(
  ({ children, className, indicatorClassName, showSelectedIndicator, ...props }, forwardedRef) => {
    return /* @__PURE__ */ jsxs(Select.Item, { className, ...props, ref: forwardedRef, children: [
      /* @__PURE__ */ jsx(Select.ItemText, { children }),
      showSelectedIndicator && /* @__PURE__ */ jsx(Select.ItemIndicator, { className: indicatorClassName, children: /* @__PURE__ */ jsx(Icon, { iconName: "check", iconPrefix: "fas", className: iconStyle }) })
    ] });
  }
);
const MultiSelect = ({
  fieldName,
  label,
  options,
  onChange,
  onBlur,
  placeholder,
  value,
  errorClassNames,
  error,
  classNames,
  searchEnabled,
  searchNoResultsText,
  searchPlaceholder,
  infoItems
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [optionsArray, setOptionsArray] = useState(options || []);
  const selectedItems = useMemo(() => {
    if (!Array.isArray(value)) return [];
    return value.filter(
      (item) => item !== null && typeof item === "object" && "value" in item && "text" in item
    );
  }, [value]);
  const selectedTexts = useMemo(() => {
    return selectedItems.map((item) => item.text);
  }, [selectedItems]);
  const selectContainer = classNames?.dropDownContainer || dropDownContainerStyle;
  const selectIcon = classNames?.dropDownIcon || dropDownOpenIconStyle;
  const selectValuesList = classNames?.dropDownSelectionList || multiSelectListStyle;
  const selectViewport = classNames?.dropDownViewport || dropDownViewportStyle;
  const selectFieldContainer = classNames?.multiSelectFieldContainer || multiSelectFieldContainer;
  const selectValue = classNames?.dropDownValue || selectPlaceholder;
  const selectTagsContainer = classNames?.multiSelectTagsContainer || multiSelectTagsContainer;
  const selectTag = classNames?.multiSelectTag || multiSelectTag;
  const selectTagRemove = classNames?.multiSelectTagRemove || multiSelectTagRemove;
  const selectCheckbox = classNames?.multiSelectCheckbox || multiSelectCheckbox;
  const selectOptionButton = classNames?.multiSelectOptionButton || multiSelectOptionButton;
  const selectOptionText = classNames?.multiSelectOptionText || multiSelectOptionText;
  const searchLabel = searchNoResultsText || NO_RESULTS_DEFAULT_TEXT;
  const searchPlaceholderText = searchPlaceholder || DEFAULT_PLACEHOLDER;
  const filterContent = (searchText) => {
    if (searchText.length > 1 && options) {
      const result = options.filter(
        (option) => option.text.toLowerCase().includes(searchText.toLowerCase())
      );
      if (result.length > 0) {
        setOptionsArray(result);
      } else {
        setOptionsArray([{ text: searchLabel, value: NO_RESULTS }]);
      }
    }
    if (!searchText) setOptionsArray(options || []);
  };
  const handleCheckChange = (option, checked) => {
    let newItems;
    if (checked) {
      const exists = selectedItems.some(
        (item) => item.value === option.value && item.text === option.text
      );
      newItems = exists ? selectedItems : [...selectedItems, option];
    } else {
      newItems = selectedItems.filter(
        (item) => !(item.value === option.value && item.text === option.text)
      );
    }
    onChange?.(newItems);
  };
  const removeItem = (e, itemToRemove) => {
    e.preventDefault();
    e.stopPropagation();
    const newItems = selectedItems.filter(
      (item) => !(item.value === itemToRemove.value && item.text === itemToRemove.text)
    );
    onChange?.(newItems);
  };
  const optionItems = optionsArray.map((option, index) => {
    if (option?.value === void 0 || option?.value === null) return null;
    const isChecked = selectedItems.some(
      (item) => item.value === option.value && item.text === option.text
    );
    const isNoResults = option.value === NO_RESULTS;
    return /* @__PURE__ */ jsxs(
      "label",
      {
        className: selectOptionButton,
        style: isNoResults ? { cursor: "not-allowed", opacity: 0.5 } : void 0,
        children: [
          !isNoResults && /* @__PURE__ */ jsx(
            Checkbox$1.Root,
            {
              checked: isChecked,
              onCheckedChange: (checked) => {
                handleCheckChange(option, checked === true);
              },
              className: selectCheckbox,
              children: /* @__PURE__ */ jsx(Checkbox$1.Indicator, { children: /* @__PURE__ */ jsx(Icon, { iconName: "check", iconPrefix: "fas", className: iconStyle }) })
            }
          ),
          /* @__PURE__ */ jsx("span", { className: selectOptionText, children: option.text })
        ]
      },
      `${fieldName}_${index}`
    );
  });
  return /* @__PURE__ */ jsxs(Container, { className: selectContainer, children: [
    /* @__PURE__ */ jsx(Label, { htmlFor: fieldName, infoItems, children: label }),
    /* @__PURE__ */ jsxs(Popover$1.Root, { onOpenChange: setIsOpen, open: isOpen, children: [
      /* @__PURE__ */ jsx(Container, { className: selectFieldContainer, children: /* @__PURE__ */ jsx(Popover$1.Trigger, { asChild: true, children: /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          className: multiSelectFieldButton,
          "aria-label": label,
          onBlur,
          children: [
            /* @__PURE__ */ jsx("div", { className: selectTagsContainer, children: selectedTexts.length === 0 ? /* @__PURE__ */ jsx("span", { className: selectValue, children: placeholder }) : selectedTexts.map((text, idx) => {
              const item = selectedItems[idx];
              return /* @__PURE__ */ jsxs("span", { className: selectTag, children: [
                text,
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "button",
                    className: selectTagRemove,
                    onClick: (e) => removeItem(e, item),
                    value: "×",
                    title: `Remove ${text}`,
                    "aria-label": `Remove ${text}`
                  }
                )
              ] }, `tag_${text}_${idx}`);
            }) }),
            /* @__PURE__ */ jsx(Container, { className: selectIcon, children: isOpen ? /* @__PURE__ */ jsx(Icon, { iconName: "chevron-up", iconPrefix: "far" }) : /* @__PURE__ */ jsx(Icon, { iconName: "chevron-down", iconPrefix: "far" }) })
          ]
        }
      ) }) }),
      /* @__PURE__ */ jsx(Popover$1.Portal, { children: /* @__PURE__ */ jsxs(
        Popover$1.Content,
        {
          className: selectValuesList,
          align: "start",
          sideOffset: 5,
          collisionPadding: 10,
          style: { width: "var(--radix-popover-trigger-width)" },
          children: [
            searchEnabled && /* @__PURE__ */ jsx(
              Filter,
              {
                placeholder: searchPlaceholderText,
                onChange: (searchValue) => filterContent(searchValue),
                fieldName: `search_${fieldName}`,
                classNames: {
                  containerClassName: classNames?.filterContainer,
                  inputClassName: classNames?.filterInput
                }
              }
            ),
            /* @__PURE__ */ jsx(Container, { className: selectViewport, children: optionItems })
          ]
        }
      ) })
    ] }),
    /* @__PURE__ */ jsx(ErrorMessage, { error, classNames: errorClassNames })
  ] });
};
var textareaContainerStyle = "o2ykwv0";
var textareaFieldStyle = "o2ykwv1";
const Textarea = ({
  fieldName,
  label,
  onBlur,
  onChange,
  classNames,
  placeholder,
  value,
  error,
  errorClassNames,
  infoItems
}) => {
  const containerStyle = classNames?.containerClassName || textareaContainerStyle;
  const fieldStyle = classNames?.fieldClassName || textareaFieldStyle;
  return /* @__PURE__ */ jsxs(Container, { className: containerStyle, children: [
    /* @__PURE__ */ jsx(Label, { htmlFor: fieldName, infoItems, children: label }),
    /* @__PURE__ */ jsx(
      "textarea",
      {
        name: fieldName,
        className: fieldStyle,
        placeholder: placeholder || void 0,
        value,
        onChange: (e) => onChange(e.target.value),
        rows: 4,
        onBlur: (e) => onBlur(e)
      }
    ),
    /* @__PURE__ */ jsx(ErrorMessage, { error, classNames: errorClassNames })
  ] });
};
var radiogroupContainerStyle = "c0hmaf0";
var radioItemContainerStyle = "c0hmaf2";
var radioLabelStyle = "c0hmaf3";
var radiogroupLabelStyle = "c0hmaf4";
var radioItemStyle = "c0hmaf5";
var radioIndicatorStyle = "c0hmaf6";
const RadioItemContainer = ({
  className,
  children
}) => {
  return /* @__PURE__ */ jsx(Container, { className, children });
};
const Radiogroup = ({
  options,
  fieldName,
  label,
  onChange,
  onBlur,
  classNames,
  defaultValue,
  error,
  errorClassNames,
  infoItems
}) => {
  const rootStyle = classNames?.radioRoot || radiogroupContainerStyle;
  const itemContainerStyle = classNames?.radioItemContainer || radioItemContainerStyle;
  const ItemLabelStyle = classNames?.radioLabel || radioLabelStyle;
  const labelStyle2 = classNames?.radioLabel || radiogroupLabelStyle;
  const indicatorStyle = classNames?.radioIndicator || radioIndicatorStyle;
  const itemStyle = classNames?.radioItem || radioItemStyle;
  const handleBlur = () => {
    if (onBlur) {
      onBlur(fieldName);
    }
  };
  return /* @__PURE__ */ jsxs(Container, { className: radiogroupContainerStyle, children: [
    /* @__PURE__ */ jsx(Label, { htmlFor: fieldName, labelClassName: labelStyle2, infoItems, children: label }),
    /* @__PURE__ */ jsx(
      RadioGroup.Root,
      {
        className: rootStyle,
        name: fieldName,
        defaultValue,
        onValueChange: (e) => onChange(e),
        onBlur: handleBlur,
        children: options.map((option, index) => {
          return /* @__PURE__ */ jsxs(
            RadioItemContainer,
            {
              className: itemContainerStyle,
              children: [
                /* @__PURE__ */ jsx(
                  RadioGroup.Item,
                  {
                    className: itemStyle,
                    value: `${option.value}`,
                    id: `${fieldName}_${index}`,
                    children: /* @__PURE__ */ jsx(RadioGroup.Indicator, { className: indicatorStyle })
                  }
                ),
                /* @__PURE__ */ jsx("label", { className: ItemLabelStyle, htmlFor: `${fieldName}_${index}`, children: option.text })
              ]
            },
            `${fieldName}_${index}`
          );
        })
      }
    ),
    error && /* @__PURE__ */ jsx(ErrorMessage, { error, classNames: errorClassNames })
  ] });
};
var checkboxContainerStyle = "t1jvm10";
var checkboxFieldContainerStyle = "t1jvm11";
var checkboxRootStyle = "t1jvm12";
var checkboxIndicatorStyle = "t1jvm13";
var checkboxLabelStyle = "t1jvm14";
const Checkbox = ({
  fieldName,
  label,
  checked = false,
  onChange,
  onBlur,
  classNames,
  error,
  errorClassNames,
  disabled,
  infoItems
}) => {
  const containerStyle = classNames?.checkboxContainer || checkboxContainerStyle;
  const fieldContainerStyle = classNames?.checkboxFieldContainer || checkboxFieldContainerStyle;
  const rootStyle = classNames?.checkboxRoot || checkboxRootStyle;
  const indicatorStyle = classNames?.checkboxIndicator || checkboxIndicatorStyle;
  const labelStyle2 = classNames?.checkboxLabel || checkboxLabelStyle;
  return /* @__PURE__ */ jsxs(Container, { className: containerStyle, children: [
    /* @__PURE__ */ jsxs(Container, { className: fieldContainerStyle, children: [
      /* @__PURE__ */ jsx(
        Checkbox$1.Root,
        {
          className: rootStyle,
          checked,
          onCheckedChange: onChange,
          onBlur,
          disabled,
          id: fieldName,
          name: fieldName,
          children: /* @__PURE__ */ jsx(Checkbox$1.Indicator, { className: indicatorStyle, children: /* @__PURE__ */ jsx(Icon, { iconName: "check", iconPrefix: "fas" }) })
        }
      ),
      /* @__PURE__ */ jsx(Label, { htmlFor: fieldName, labelClassName: labelStyle2, infoItems, children: label })
    ] }),
    /* @__PURE__ */ jsx(ErrorMessage, { error, classNames: errorClassNames })
  ] });
};
var E_ComponentTypes = /* @__PURE__ */ ((E_ComponentTypes2) => {
  E_ComponentTypes2["BENEFICIALOWNER"] = "BeneficialOwner";
  E_ComponentTypes2["CHECKBOX"] = "Checkbox";
  E_ComponentTypes2["MULTISELECT"] = "MultiSelectDropdown";
  E_ComponentTypes2["NUMBER"] = "Number";
  E_ComponentTypes2["RADIOGROUP"] = "RadioGroup";
  E_ComponentTypes2["SELECT"] = "Select";
  E_ComponentTypes2["TEXT"] = "Text";
  E_ComponentTypes2["TEXTAREA"] = "Textarea";
  E_ComponentTypes2["HIDDENINPUT"] = "HiddenInput";
  return E_ComponentTypes2;
})(E_ComponentTypes || {});
const isNumber = (value) => {
  if (!value) return true;
  const regexp = /^\d*$/;
  return regexp.test(value);
};
var inputContainerStyle = "jtf8pr0";
var inputFieldStyle = "jtf8pr3";
const InputField = ({
  fieldName,
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  classNames,
  error,
  errorClassNames,
  type,
  infoItems
}) => {
  const containerStyle = inputContainerStyle;
  const fieldStyle = classNames?.fieldClassName || inputFieldStyle;
  return /* @__PURE__ */ jsxs(Container, { className: containerStyle, children: [
    /* @__PURE__ */ jsx(Label, { htmlFor: fieldName, infoItems, children: label }),
    /* @__PURE__ */ jsx(
      "input",
      {
        name: fieldName,
        id: fieldName,
        type,
        className: fieldStyle,
        placeholder: placeholder || void 0,
        value,
        onChange: (e) => onChange(e.target.value),
        onBlur: (e) => onBlur(e)
      }
    ),
    /* @__PURE__ */ jsx(ErrorMessage, { error, classNames: errorClassNames })
  ] });
};
const InputNumber = ({
  fieldName,
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  classNames,
  error,
  errorClassNames
}) => {
  const [inputValue, setInputValue] = React.useState(value || "");
  const handleChange = (inputValue2) => {
    if (isNumber(inputValue2)) {
      setInputValue(inputValue2);
      onChange(inputValue2);
    }
  };
  return /* @__PURE__ */ jsx(
    InputField,
    {
      label,
      fieldName,
      onChange: handleChange,
      onBlur,
      error,
      type: "text",
      inputMode: "numeric",
      placeholder,
      value: inputValue,
      errorClassNames,
      classNames
    }
  );
};
const InputText = ({
  fieldName,
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  classNames,
  error,
  errorClassNames
}) => {
  return /* @__PURE__ */ jsx(
    InputField,
    {
      label,
      fieldName,
      onChange,
      onBlur,
      error,
      type: "text",
      inputMode: "text",
      placeholder,
      value,
      errorClassNames,
      classNames
    }
  );
};
const HiddenField = ({
  fieldName,
  value,
  onChange,
  onBlur
}) => {
  const serialized = useMemo(() => {
    if (value === void 0 || value === null) return "";
    return String(value);
  }, [value]);
  useEffect(() => {
    onChange(value);
    onBlur();
  }, []);
  return /* @__PURE__ */ jsx("input", { type: "hidden", name: fieldName, value: serialized });
};
var popoverButtonStyles = "_111y8cq0";
var popoverContentStyles = "_111y8cq1";
var popoverArrowStyles = "_111y8cq2";
var popoverCloseIconStyles = "_111y8cq3";
const Popover = ({
  children,
  classNames,
  popoverIcon,
  side,
  sideOffset,
  popoverOpen,
  setPopoverOpen
}) => {
  const buttonStyles2 = classNames?.popoverButton || popoverButtonStyles;
  const contentStyles = classNames?.popoverContent || popoverContentStyles;
  const arrowStyles = classNames?.popoverArrow || popoverArrowStyles;
  const buttonIcon = popoverIcon || /* @__PURE__ */ jsx(Icon, { iconName: "plus", iconPrefix: "fas" });
  const closeIcon = classNames?.popoverCloseIcon || popoverCloseIconStyles;
  const popoverSide = side || "bottom";
  const popoverSideOffset = sideOffset || 0;
  return /* @__PURE__ */ jsxs(Popover$1.Root, { open: popoverOpen, onOpenChange: setPopoverOpen, children: [
    /* @__PURE__ */ jsx(Popover$1.Trigger, { asChild: true, children: /* @__PURE__ */ jsx(
      "button",
      {
        className: buttonStyles2,
        onClick: (popoverOpen2) => setPopoverOpen(!popoverOpen2),
        children: buttonIcon
      }
    ) }),
    /* @__PURE__ */ jsx(Popover$1.Portal, { children: /* @__PURE__ */ jsxs(
      Popover$1.Content,
      {
        className: contentStyles,
        side: popoverSide,
        sideOffset: popoverSideOffset,
        children: [
          children,
          /* @__PURE__ */ jsx(
            Popover$1.Close,
            {
              className: closeIcon,
              onClick: (popoverOpen2) => setPopoverOpen(!popoverOpen2),
              children: /* @__PURE__ */ jsx(Icon, { iconPrefix: "fas", iconName: "xmark" })
            }
          ),
          /* @__PURE__ */ jsx(Popover$1.Arrow, { className: arrowStyles })
        ]
      }
    ) })
  ] });
};
const BeneficialOwnerForm = ({
  formData,
  onButtonClick,
  countryList,
  classNames
}) => {
  const { addButton, fields } = formData;
  const [name, setName] = useState({
    fieldname: "",
    value: "",
    label: ""
  });
  const [ssn, setSsn] = useState({
    fieldname: "",
    value: "",
    label: ""
  });
  const [ownership, setOwnership] = useState({
    fieldname: "",
    value: "",
    label: ""
  });
  const [country, setCountry] = useState({
    fieldname: "",
    value: "",
    label: "",
    text: ""
  });
  const [pep, setPep] = useState({
    fieldname: "",
    value: "",
    label: "",
    text: ""
  });
  const [addButtonDisabled, setAddButtonDisabled] = useState(true);
  useEffect(() => {
    setAddButtonDisabled(
      !(name.value && ssn.value && ownership.value && country.value && pep.value)
    );
  }, [name.value, ssn.value, ownership.value, country.value, pep.value]);
  return /* @__PURE__ */ jsxs(Container, { children: [
    /* @__PURE__ */ jsx(Container, { className: boQuestionsStyle, children: /* @__PURE__ */ jsx(
      InputText,
      {
        label: fields.name.label,
        fieldName: fields.name.parameter,
        placeholder: fields.name.placeholder,
        classNames: {
          fieldClassName: classNames.formInputField || "",
          labelClassName: classNames.formLabelFields || ""
        },
        onChange: (value) => {
          setName({
            fieldname: fields.name.parameter,
            label: fields.name.label,
            value: value.trim()
          });
        },
        onBlur: () => {
        },
        error: ""
      }
    ) }),
    /* @__PURE__ */ jsx(Container, { className: boQuestionsStyle, children: /* @__PURE__ */ jsx(
      InputText,
      {
        fieldName: fields.ssn.parameter,
        label: fields.ssn.label,
        placeholder: fields.ssn.placeholder,
        classNames: {
          fieldClassName: classNames.formInputField || "",
          labelClassName: classNames.formLabelFields || ""
        },
        onChange: (value) => {
          setSsn({
            fieldname: fields.ssn.parameter,
            label: fields.ssn.label,
            value: value.trim()
          });
        },
        onBlur: () => {
        },
        error: ""
      }
    ) }),
    /* @__PURE__ */ jsx(Container, { className: boQuestionsStyle, children: /* @__PURE__ */ jsx(
      InputText,
      {
        label: fields.ownership.label,
        fieldName: fields.ownership.parameter,
        placeholder: fields.ownership.placeholder,
        classNames: {
          fieldClassName: classNames.formInputField || "",
          labelClassName: classNames.formLabelFields || ""
        },
        onChange: (value) => {
          setOwnership({
            fieldname: fields.ownership.parameter,
            label: fields.ownership.label,
            value: value.trim()
          });
        },
        onBlur: () => {
        },
        error: ""
      }
    ) }),
    /* @__PURE__ */ jsx(Container, { className: boQuestionsStyle, children: /* @__PURE__ */ jsx(
      DropDown,
      {
        label: fields.country.label,
        fieldName: fields.country.parameter,
        placeholder: fields.country.placeholder,
        value: { value: country.value || "", text: country.text || "" },
        searchEnabled: true,
        options: countryList || null,
        showSelectedItemIcon: true,
        onChange: (value, text) => {
          setCountry({
            fieldname: fields.country.parameter,
            label: fields.country.label,
            value: String(text),
            text: String(text)
          });
        },
        onBlur: () => {
        }
      }
    ) }),
    /* @__PURE__ */ jsx(Container, { className: boQuestionsStyle, children: /* @__PURE__ */ jsx(
      Radiogroup,
      {
        fieldName: fields.pep.parameter,
        label: fields.pep.label,
        onChange: (value) => {
          const pepOption = fields.pep.options?.find(
            (opt) => String(opt.value) === String(value)
          );
          setPep({
            fieldname: fields.pep.parameter,
            label: fields.pep.label,
            value,
            text: pepOption?.text
          });
        },
        onBlur: () => {
        },
        options: fields.pep.options || [],
        defaultValue: pep.value,
        error: "",
        classNames: {
          radioRoot: b2bRadiogroupRootStyle,
          radioItemContainer: b2bRadiogroupRootStyle,
          radioItem: b2bRadioItemStyle,
          radioIndicator: b2bRadioIndicatorStyle,
          radioLabel: b2bRadioItemLabelStyle
        }
      }
    ) }),
    /* @__PURE__ */ jsx(
      Button,
      {
        type: "button",
        label: addButton,
        disabled: addButtonDisabled,
        className: classNames.formButton || "",
        onClick: () => onButtonClick(name, ssn, ownership, country, pep)
      }
    )
  ] });
};
const BeneficialOwnerResult = ({ fieldArray }) => {
  return /* @__PURE__ */ jsx(Container, { className: boResultContainer, children: fieldArray.map((item, index) => {
    const displayValue = item.text || item.value;
    return /* @__PURE__ */ jsxs(
      Container,
      {
        className: boResultValuesContainer,
        children: [
          /* @__PURE__ */ jsx(Text, { className: boResultValueLabelContainer, children: item.label }),
          /* @__PURE__ */ jsx(Text, { className: boResultValueContainer, children: displayValue })
        ]
      },
      `${index}-${item.fieldname}`
    );
  }) });
};
const convertMapToOwnersArray = (map) => {
  return Array.from(map.values()).map((arr) => {
    const obj = {};
    arr.forEach((field) => {
      if (field?.fieldname) {
        if (field.fieldname === "BOCountry" && field.text !== void 0) {
          obj[field.fieldname] = field.text;
        } else {
          obj[field.fieldname] = field.value;
        }
      }
    });
    return obj;
  });
};
const BeneficialOwner = ({
  label,
  fieldName,
  classNames,
  beneficialOwnerFieldsData,
  beneficialOwnersMaxCount,
  countryList,
  error,
  errorClassNames,
  infoItems,
  onChange,
  currentValue
}) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [entriesIndex, setEntriesIndex] = useState(0);
  const [fieldsMap, setFieldsMap] = useState(() => {
    if (!Array.isArray(currentValue) || currentValue.length === 0) {
      return /* @__PURE__ */ new Map();
    }
    const map = /* @__PURE__ */ new Map();
    const fieldConfig = beneficialOwnerFieldsData.fields;
    currentValue.forEach((item, index) => {
      const ownerKey = `owner_${index + 1}`;
      const fields = [];
      if (typeof item === "object" && item !== null) {
        const owner = item;
        Object.keys(owner).forEach((key) => {
          const fieldNameKey = key.replace(/^owner_\d+_/, "");
          const value = owner[key];
          const labelMap = {
            [fieldConfig.name.parameter]: fieldConfig.name.label,
            [fieldConfig.ssn.parameter]: fieldConfig.ssn.label,
            [fieldConfig.ownership.parameter]: fieldConfig.ownership.label,
            [fieldConfig.country.parameter]: fieldConfig.country.label,
            [fieldConfig.pep.parameter]: fieldConfig.pep.label
          };
          const fieldLabel = labelMap[fieldNameKey] ?? "";
          fields.push({
            fieldname: fieldNameKey,
            value: String(value),
            label: fieldLabel,
            text: fieldNameKey === fieldConfig.country.parameter ? String(value) : void 0
          });
        });
      }
      if (fields.length > 0) {
        map.set(ownerKey, fields);
      }
    });
    return map;
  });
  useEffect(() => {
    setEntriesIndex(fieldsMap.size);
  }, []);
  const transformOwners = (map) => {
    const owners = convertMapToOwnersArray(map);
    return owners.map((owner, index) => {
      const ownerNumber = index + 1;
      const transformed = {};
      Object.keys(owner).forEach((key) => {
        transformed[`owner_${ownerNumber}_${key}`] = owner[key];
      });
      return transformed;
    });
  };
  const updateMap = (key, value) => {
    const tempMap = new Map(fieldsMap);
    tempMap.set(key, value);
    setFieldsMap(tempMap);
    const transformedOwners = transformOwners(tempMap);
    if (onChange) {
      onChange(fieldName, transformedOwners);
    }
  };
  const handleAddBo = (name, ssn, ownership, countries, pep) => {
    const valueArray = [name, ssn, ownership, countries, pep];
    const nextIndex = entriesIndex + 1;
    setEntriesIndex(nextIndex);
    updateMap(`owner_${nextIndex}`, valueArray);
    setPopoverOpen(false);
  };
  const handleRemoveBo = (mapKey) => {
    const tempMap = new Map(fieldsMap);
    tempMap.delete(mapKey);
    setFieldsMap(tempMap);
    const transformedOwners = transformOwners(tempMap);
    if (onChange) {
      onChange(fieldName, transformedOwners);
    }
  };
  return /* @__PURE__ */ jsxs(Container, { className: boComponentContainer, children: [
    /* @__PURE__ */ jsx(Container, { className: boLabelAndButtonContainer, children: /* @__PURE__ */ jsxs(Container, { className: boLabelButtonRow, children: [
      /* @__PURE__ */ jsx(
        Label,
        {
          htmlFor: fieldName,
          labelClassName: classNames?.beneficialOwnerLabel,
          infoItems,
          children: label
        }
      ),
      fieldsMap.size < beneficialOwnersMaxCount && /* @__PURE__ */ jsx(Container, { className: boButtonContainer, children: /* @__PURE__ */ jsx(
        Popover,
        {
          popoverOpen,
          setPopoverOpen,
          classNames: {
            popoverButton: boPopoverButton,
            popoverCloseIcon: boCloseIcon
          },
          children: /* @__PURE__ */ jsx(
            BeneficialOwnerForm,
            {
              classNames: { formButton: addBoFormButton },
              formData: beneficialOwnerFieldsData,
              onButtonClick: (name, ssn, ownership, countries, pep) => {
                handleAddBo(name, ssn, ownership, countries, pep);
              },
              countryList
            }
          )
        }
      ) })
    ] }) }),
    fieldsMap.size > 0 && Array.from(fieldsMap.entries()).map(([key, fieldArray]) => {
      return /* @__PURE__ */ jsxs(Container, { className: boResultAndButton, children: [
        /* @__PURE__ */ jsx(BeneficialOwnerResult, { fieldArray }, key),
        /* @__PURE__ */ jsx(
          Button,
          {
            type: "button",
            className: removeBoFormButton,
            label: /* @__PURE__ */ jsx(Icon, { iconName: "trash", iconPrefix: "fas" }),
            onClick: () => handleRemoveBo(key)
          }
        )
      ] }, `parent_${key}`);
    }),
    /* @__PURE__ */ jsx(ErrorMessage, { error, classNames: errorClassNames })
  ] });
};
const BO_MAX_COUNT = 5;
const EMPTY_STRING = "";
const Question = ({
  questionType,
  questionProps,
  question,
  countryList,
  currentValue
}) => {
  const getFieldError = (fieldName) => {
    return questionProps.validationErrors.get(fieldName);
  };
  if (questionType === E_ComponentTypes.SELECT) {
    const options = question?.useCountryList ? countryList : question?.options;
    return /* @__PURE__ */ jsx(Container, { className: questionsStyle, children: /* @__PURE__ */ jsx(
      DropDown,
      {
        label: question?.questionLabel || "",
        infoItems: question?.infoItems || null,
        fieldName: question.questionParameter,
        placeholder: question?.placeholder || "",
        options: options || [],
        showSelectedItemIcon: true,
        value: currentValue,
        onChange: (selectedValue, selectedText) => {
          if (selectedValue === void 0 || !selectedText) return;
          const option = options?.find((opt) => opt.value === selectedValue);
          questionProps.onChange(
            question.questionParameter,
            option || { value: selectedValue, text: selectedText },
            selectedText
          );
        },
        onBlur: () => questionProps.onBlur(question.questionParameter),
        error: getFieldError(question.questionParameter)
      }
    ) });
  }
  if (questionType === E_ComponentTypes.MULTISELECT) {
    const options = question?.useCountryList ? countryList : question?.options;
    return /* @__PURE__ */ jsx(Container, { className: questionsStyle, children: /* @__PURE__ */ jsx(
      MultiSelect,
      {
        label: question?.questionLabel || "",
        fieldName: question.questionParameter,
        placeholder: question?.placeholder || "",
        options: options || [],
        searchEnabled: true,
        value: currentValue,
        onChange: (items) => {
          questionProps.onChange(question.questionParameter, items);
        },
        onBlur: () => questionProps.onBlur(question.questionParameter),
        error: getFieldError(question.questionParameter),
        infoItems: question?.infoItems || null
      }
    ) });
  }
  if (questionType === E_ComponentTypes.TEXTAREA)
    return /* @__PURE__ */ jsx(Container, { className: questionsStyle, children: /* @__PURE__ */ jsx(
      Textarea,
      {
        label: question?.questionLabel || "",
        fieldName: question.questionParameter,
        placeholder: question?.placeholder ? question.placeholder : void 0,
        value: currentValue,
        onChange: (e) => {
          questionProps.onChange(question.questionParameter, e, e);
        },
        onBlur: () => questionProps.onBlur(question.questionParameter),
        error: getFieldError(question.questionParameter),
        infoItems: question?.infoItems || null
      }
    ) });
  if (questionType === E_ComponentTypes.RADIOGROUP)
    return /* @__PURE__ */ jsx(Container, { className: questionsStyle, children: /* @__PURE__ */ jsx(
      Radiogroup,
      {
        fieldName: question.questionParameter,
        label: question?.questionLabel || "",
        onChange: (selectedValue) => {
          const option = question?.options?.find(
            (opt) => String(opt.value) === String(selectedValue)
          );
          questionProps.onChange(
            question.questionParameter,
            selectedValue,
            option?.text
          );
        },
        onBlur: () => questionProps.onBlur(question.questionParameter),
        options: question?.options ?? [],
        defaultValue: currentValue,
        error: getFieldError(question.questionParameter) || "",
        classNames: {
          radioRoot: b2bRadiogroupRootStyle,
          radioItemContainer: b2bRadiogroupRootStyle,
          radioItem: b2bRadioItemStyle,
          radioIndicator: b2bRadioIndicatorStyle,
          radioLabel: b2bRadioItemLabelStyle
        },
        infoItems: question?.infoItems || null
      }
    ) });
  if (questionType === E_ComponentTypes.TEXT)
    return /* @__PURE__ */ jsx(Container, { className: questionsStyle, children: /* @__PURE__ */ jsx(
      InputText,
      {
        label: question?.questionLabel || "",
        fieldName: question.questionParameter,
        placeholder: question?.placeholder ? question.placeholder : void 0,
        value: currentValue,
        onChange: (e) => {
          questionProps.onChange(question.questionParameter, e, e);
        },
        onBlur: () => questionProps.onBlur(question.questionParameter),
        error: getFieldError(question.questionParameter) || "",
        infoItems: question?.infoItems || null
      }
    ) });
  if (questionType === E_ComponentTypes.NUMBER)
    return /* @__PURE__ */ jsx(Container, { className: questionsStyle, children: /* @__PURE__ */ jsx(
      InputNumber,
      {
        label: question?.questionLabel || "",
        fieldName: question.questionParameter,
        placeholder: question?.placeholder ? question.placeholder : void 0,
        value: currentValue,
        onChange: (e) => {
          questionProps.onChange(question.questionParameter, e, e);
        },
        onBlur: () => questionProps.onBlur(question.questionParameter),
        error: getFieldError(question.questionParameter) || "",
        infoItems: question?.infoItems || null
      }
    ) });
  if (questionType === E_ComponentTypes.CHECKBOX) {
    return /* @__PURE__ */ jsx(Container, { className: questionsStyle, children: /* @__PURE__ */ jsx(
      Checkbox,
      {
        label: question?.questionLabel || "",
        fieldName: question.questionParameter,
        checked: currentValue,
        onChange: (checked) => {
          questionProps.onChange(
            question.questionParameter,
            checked,
            checked ? "Ja" : "Nej"
            //TODO: implement proper translations for boolean
          );
        },
        onBlur: () => questionProps.onBlur(question.questionParameter),
        error: getFieldError(question.questionParameter),
        infoItems: question?.infoItems || null
      }
    ) });
  }
  if (questionType === E_ComponentTypes.HIDDENINPUT) {
    return /* @__PURE__ */ jsx(
      HiddenField,
      {
        fieldName: question.questionParameter,
        value: currentValue,
        onChange: (e) => {
          questionProps.onChange(
            question.questionParameter,
            e,
            e
          );
        },
        onBlur: () => questionProps.onBlur(question.questionParameter)
      }
    );
  }
  if (questionType === E_ComponentTypes.BENEFICIALOWNER) {
    const boQuestion = question;
    const boData = {
      addButton: boQuestion.addBObutton || EMPTY_STRING,
      fields: {
        name: {
          parameter: boQuestion.nameParameter || EMPTY_STRING,
          label: boQuestion.nameQuestion || EMPTY_STRING,
          placeholder: boQuestion.namePlaceholder || EMPTY_STRING
        },
        ssn: {
          parameter: boQuestion.ssnParameter || EMPTY_STRING,
          label: boQuestion.ssnQuestion || EMPTY_STRING,
          placeholder: boQuestion.ssnPlaceholder || EMPTY_STRING
        },
        ownership: {
          parameter: boQuestion.ownershipParameter || EMPTY_STRING,
          label: boQuestion.ownershipQuestion || EMPTY_STRING,
          placeholder: boQuestion.ownershipPlaceholder || EMPTY_STRING
        },
        country: {
          parameter: boQuestion.countryParameter || EMPTY_STRING,
          label: boQuestion.countryQuestion || EMPTY_STRING,
          placeholder: boQuestion.countryPlaceholder || EMPTY_STRING
        },
        pep: {
          parameter: boQuestion.pepParameter || EMPTY_STRING,
          label: boQuestion.pepQuestion || EMPTY_STRING,
          placeholder: EMPTY_STRING,
          options: boQuestion.pepOptions || []
        }
      }
    };
    return /* @__PURE__ */ jsx(Container, { className: questionsStyle, children: /* @__PURE__ */ jsx(
      BeneficialOwner,
      {
        beneficialOwnersMaxCount: boQuestion.boMaxCount && boQuestion.boMaxCount > 0 ? boQuestion.boMaxCount : BO_MAX_COUNT,
        fieldName: boQuestion.questionParameter,
        label: boQuestion.questionLabel,
        error: getFieldError(boQuestion.questionParameter),
        beneficialOwnerFieldsData: boData,
        onChange: questionProps.onChange,
        onBlur: () => questionProps.onBlur(boQuestion.questionParameter),
        countryList: questionProps.countryList || [],
        infoItems: boQuestion.infoItems || null,
        currentValue
      }
    ) });
  }
  return /* @__PURE__ */ jsx(Container, { className: questionsStyle, children: "Question type does not exist" });
};
const Questions = (props) => {
  const { activeStepName, questions, countryList, formValues } = props;
  const currentSteps = questions.get(activeStepName);
  const isDependantQuestionVisible = (dependantQuestion, currentQuestion) => {
    if (!dependantQuestion) return false;
    const currentQuestionValue = formValues.get(currentQuestion.questionParameter);
    if (`${dependantQuestion.conditionValue}` === `${currentQuestionValue?.answer}`)
      return true;
    return false;
  };
  const getCurrentValue = (fieldName) => {
    const entry2 = formValues.get(fieldName);
    return entry2?.answer;
  };
  const questionArray = currentSteps?.map((item) => {
    const includeCountryListProperty = isCountryListUsed(item);
    const dependentFieldName = item.question.dependentQuestion?.questionParameter;
    return /* @__PURE__ */ jsxs(React.Fragment, { children: [
      /* @__PURE__ */ jsx(
        Question,
        {
          questionType: item.question.componentType,
          questionProps: props,
          question: item.question,
          countryList: includeCountryListProperty ? countryList : void 0,
          currentValue: getCurrentValue(item.question.questionParameter)
        }
      ),
      isDependantQuestionVisible(item.question.dependentQuestion, item.question) && item.question.dependentQuestion && dependentFieldName && /* @__PURE__ */ jsx(
        Question,
        {
          questionType: item.question.dependentQuestion.componentType,
          questionProps: props,
          question: item.question.dependentQuestion,
          countryList: item.question.dependentQuestion.useCountryList ? countryList : void 0,
          currentValue: getCurrentValue(dependentFieldName)
        },
        dependentFieldName
      )
    ] }, item.id);
  });
  return /* @__PURE__ */ jsx(Fragment, { children: questionArray });
};
const getValidationValueFromErrorType = (errorType) => {
  switch (errorType) {
    case "maxLength20":
      return 20;
    case "maxLength100":
      return 100;
    case "maxLength500":
      return 500;
    case "maxLength1000":
      return 1e3;
    default:
      return void 0;
  }
};
const isEmpty = (value) => {
  if (value == null || value === void 0) return true;
  if (typeof value === "string") {
    return value.trim() === "";
  }
  if (typeof value === "number") {
    return false;
  }
  if (typeof value === "boolean") {
    return false;
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return true;
    return value.every((item) => {
      if (item == null) return true;
      if (typeof item === "string") return item.trim() === "";
      if (typeof item === "object") {
        return Object.keys(item).length === 0 || Object.values(item).every(
          (v) => !v || typeof v === "string" && v.trim() === ""
        );
      }
      return false;
    });
  }
  return false;
};
const valueAsString = (value) => {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) return value.join(", ");
  return "";
};
const validateSingleRule = (value, rule) => {
  if (rule.type === "mustBeChecked") {
    if (value !== true) {
      return rule.message;
    }
    return null;
  }
  if (rule.type === "isRequired") {
    return isEmpty(value) ? rule.message : null;
  }
  if (isEmpty(value)) {
    return null;
  }
  switch (rule.type) {
    case "numeric": {
      const stringValue = valueAsString(value);
      if (!isNumber(stringValue)) {
        return rule.message;
      }
      return null;
    }
    case "maxLength20":
    case "maxLength100":
    case "maxLength500":
    case "maxLength1000": {
      const stringValue = valueAsString(value);
      const maxLength = getValidationValueFromErrorType(rule.type);
      if (maxLength && stringValue.length > maxLength) {
        return rule.message;
      }
      return null;
    }
    default:
      console.warn(`Unknown validation rule type: ${rule.type}`);
      return null;
  }
};
const validateField = (value, config) => {
  const { rules } = config;
  for (const rule of rules) {
    const error = validateSingleRule(value, rule);
    if (error) {
      return {
        isValid: false,
        error
      };
    }
  }
  return { isValid: true };
};
const createValidationConfig = (errorMessages, additionalRules) => {
  const rules = [];
  if (errorMessages) {
    errorMessages.forEach((errorMessage) => {
      rules.push({
        type: errorMessage.error,
        value: getValidationValueFromErrorType(errorMessage.error),
        message: errorMessage.message
      });
    });
  }
  rules.sort((a, b) => {
    if (a.type === "isRequired") return -1;
    if (b.type === "isRequired") return 1;
    return 0;
  });
  return {
    rules,
    isRequired: rules.some((rule) => rule.type === "isRequired")
  };
};
const isFieldVisible = (fieldName, formData, formValues) => {
  const parts = fieldName.split("::");
  if (parts.length !== 2) {
    return true;
  }
  const [parentFieldName] = parts;
  for (const [, questions] of formData.steps) {
    for (const question of questions) {
      if (question.question.questionParameter === parentFieldName) {
        const depQuestion = question.question.dependentQuestion;
        if (!depQuestion) {
          return false;
        }
        if (depQuestion.questionParameter === fieldName) {
          const parentValue = formValues.get(parentFieldName);
          const conditionValue = String(depQuestion.conditionValue);
          const actualValue = String(parentValue);
          return conditionValue === actualValue;
        }
      }
    }
  }
  return true;
};
const useFormValidation = (formData) => {
  const [validationErrors, setValidationErrors] = useState(/* @__PURE__ */ new Map());
  const validationConfigs = useMemo(() => {
    const configs = /* @__PURE__ */ new Map();
    formData.steps.forEach((questions) => {
      questions.forEach((question) => {
        const { questionParameter, errorMessages } = question.question;
        const config = createValidationConfig(errorMessages);
        configs.set(questionParameter, config);
        if (question.question.dependentQuestion) {
          const depQuestion = question.question.dependentQuestion;
          const depConfig = createValidationConfig(depQuestion.errorMessages);
          configs.set(depQuestion.questionParameter, depConfig);
        }
      });
    });
    return configs;
  }, [formData.steps]);
  const validateSingleField = useCallback(
    (fieldName, value, updateState = true) => {
      const config = validationConfigs.get(fieldName);
      if (!config) {
        console.warn(`No validation config for field: ${fieldName}`);
        return true;
      }
      const result = validateField(value, config);
      if (updateState) {
        setValidationErrors((prev) => {
          const newErrors = new Map(prev);
          if (result.error) {
            newErrors.set(fieldName, result.error);
          } else {
            newErrors.delete(fieldName);
          }
          return newErrors;
        });
      }
      return result.isValid;
    },
    [validationConfigs]
  );
  const validateEntireForm = useCallback(
    (formValues) => {
      const errors = /* @__PURE__ */ new Map();
      let firstErrorField;
      validationConfigs.forEach((config, fieldName) => {
        const visible = isFieldVisible(fieldName, formData, formValues);
        if (visible) {
          const value = formValues.get(fieldName);
          const result = validateField(value, config);
          if (!result.isValid && result.error) {
            errors.set(fieldName, result.error);
            if (!firstErrorField) {
              firstErrorField = fieldName;
            }
          }
        }
      });
      setValidationErrors(errors);
      return {
        isValid: errors.size === 0,
        errors,
        firstErrorField
      };
    },
    [validationConfigs, formData]
  );
  const clearFieldError = useCallback((fieldName) => {
    setValidationErrors((prev) => {
      const newErrors = new Map(prev);
      newErrors.delete(fieldName);
      return newErrors;
    });
  }, []);
  const checkIsVisible = useCallback(
    (fieldName, formValues) => {
      return isFieldVisible(fieldName, formData, formValues);
    },
    [formData]
  );
  return {
    validationErrors,
    validateSingleField,
    validateEntireForm,
    clearFieldError,
    isVisible: checkIsVisible
  };
};
const FormPage = (props) => {
  const { formData, generalData, error } = props;
  const submit = useSubmit();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [formValues, setFormValues] = useState(formData.answers);
  const [activeStep, setActiveStep] = useState(1);
  const formRef = React.useRef(null);
  const {
    validationErrors,
    validateSingleField,
    validateEntireForm,
    clearFieldError,
    isVisible
  } = useFormValidation(formData);
  const formValuesMap = useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    formValues.forEach((value, key) => {
      map.set(key, value.answer);
    });
    return map;
  }, [formValues]);
  const handleChange = (field, value, displayText) => {
    setFormValues((prev) => {
      const updated = new Map(prev);
      const existingEntry = updated.get(field);
      if (existingEntry) {
        updated.set(field, {
          ...existingEntry,
          answer: value,
          ...displayText !== void 0 && { answerText: displayText }
        });
      }
      return updated;
    });
    clearFieldError(field);
  };
  const handleOnBlur = (field) => {
    if (isVisible(field, formValuesMap)) {
      const currentValue = formValues.get(field);
      validateSingleField(field, currentValue?.answer);
    }
  };
  const validateCurrentStep = () => {
    const currentStepQuestions = formData.steps.get(
      getCurrentStepName(activeStep - 1)
    );
    if (!currentStepQuestions) return true;
    let hasErrors = false;
    currentStepQuestions.forEach(({ question }) => {
      if (isVisible(question.questionParameter, formValuesMap)) {
        const value = formValues.get(question.questionParameter);
        if (!validateSingleField(question.questionParameter, value?.answer)) {
          hasErrors = true;
        }
      }
      if (question.dependentQuestion) {
        const depParam = question.dependentQuestion.questionParameter;
        if (isVisible(depParam, formValuesMap)) {
          const value = formValues.get(depParam);
          if (!validateSingleField(depParam, value?.answer)) {
            hasErrors = true;
          }
        }
      }
    });
    return !hasErrors;
  };
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const validationResult = validateEntireForm(formValuesMap);
    if (!validationResult.isValid) {
      console.warn(`Form has ${validationResult.errors.size} validation errors`);
      if (validationResult.firstErrorField) {
        document.querySelector(`[name="${validationResult.firstErrorField}"]`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }
    submitFormAnswers(formValues, String(formData.id), submit);
  };
  const getCurrentStepName = (activeStepIndex) => formData.generalFormData.steps[activeStepIndex].stepName;
  const nextStep = () => {
    if (isLastStep) {
      formRef.current?.requestSubmit();
    } else if (validateCurrentStep()) {
      setActiveStep(activeStep + 1);
    } else {
      console.warn("Please fix validation errors before proceeding");
    }
  };
  const prevStep = () => {
    setActiveStep(activeStep - 1);
  };
  const isLastStep = activeStep === formData.generalFormData.steps.length;
  const isFirstStep = activeStep === 1;
  return /* @__PURE__ */ jsx("main", { className: mainContentStyle, children: /* @__PURE__ */ jsxs(Container, { className: mainContainerStyle, children: [
    /* @__PURE__ */ jsx(
      Title,
      {
        title: formData.generalFormData.formHeader.title,
        subtitle: formData.generalFormData.formHeader.subtitle,
        className: formTitleStyle,
        titleClassName: titleStyle,
        subtitleClassName: subtitleStyle
      }
    ),
    /* @__PURE__ */ jsxs(Form, { ref: formRef, method: "post", onSubmit: handleFormSubmit, children: [
      /* @__PURE__ */ jsx(Container, { className: stepsWrapperStyle, children: /* @__PURE__ */ jsx(
        Steps,
        {
          steps: formData.generalFormData.steps,
          activeStep,
          styling: {
            badge: { stepBadgeCompletedClasses: badgeActiveStyle },
            statusLine: { fillDone: progressLineActiveStyle },
            label: {
              stepActiveLabelClasses: labelActiveStyle,
              stepLabelClasses: labelStyle
            }
          }
        }
      ) }),
      /* @__PURE__ */ jsx("hr", { className: dividerStyle }),
      isFirstStep && /* @__PURE__ */ jsx(
        CompanyInfo,
        {
          companyName: generalData.organizationName,
          companyNameLabel: formData.generalFormData.companyBlock.companyName,
          orgNumber: generalData.organizationNumber,
          orgNumberLabel: formData.generalFormData.companyBlock.orgNumber
        }
      ),
      /* @__PURE__ */ jsx(Container, { className: formQuestionsContainer, children: /* @__PURE__ */ jsx(
        Questions,
        {
          questions: formData.steps,
          formValues,
          onChange: handleChange,
          onBlur: handleOnBlur,
          validationErrors,
          activeStep,
          countryList: formData.countryList,
          activeStepName: getCurrentStepName(activeStep - 1)
        }
      ) }),
      error && /* @__PURE__ */ jsx(ErrorView, { message: error.message }),
      /* @__PURE__ */ jsxs(
        Container,
        {
          className: isFirstStep ? singleButtonContainerStyle : buttonContainerStyle,
          children: [
            !isFirstStep && /* @__PURE__ */ jsx(
              Button,
              {
                label: [
                  /* @__PURE__ */ jsx(Icon, { iconName: "chevron-left", iconPrefix: "far" }, "arrow-1"),
                  ` ${formData.generalFormData.button.back}`
                ],
                onClick: prevStep,
                type: "button",
                disabled: isSubmitting
              }
            ),
            /* @__PURE__ */ jsx(
              Button,
              {
                label: [
                  `${isLastStep ? formData.generalFormData.button.submit : formData.generalFormData.button.next} `,
                  /* @__PURE__ */ jsx(Icon, { iconName: "chevron-right", iconPrefix: "far" }, "arrow-2")
                ],
                onClick: nextStep,
                type: "button",
                disabled: isSubmitting
              }
            )
          ]
        }
      )
    ] })
  ] }) });
};
const tailwindStyles = "/assets/global-mVfkxMrT.css";
var bodyStyles = "_1dfwfod0";
var swedenB2BTheme = "_944cwd0";
function getThemeClass(productId) {
  const themeMap = {
    "sweden-b2b-application": swedenB2BTheme
  };
  return themeMap[productId] || swedenB2BTheme;
}
function useActivityTracker(throttleMs = 1e3) {
  const lastActivityRef = useRef(Date.now());
  const lastUpdateRef = useRef(Date.now());
  useEffect(() => {
    const onActivity = () => {
      const now = Date.now();
      if (now - lastUpdateRef.current >= throttleMs) {
        lastActivityRef.current = now;
        lastUpdateRef.current = now;
      }
    };
    const events = [
      { name: "mousemove" },
      { name: "keydown" },
      { name: "touchstart", options: { passive: true } },
      { name: "touchmove", options: { passive: true } },
      { name: "scroll", options: { passive: true } }
    ];
    events.forEach(({ name, options }) => window.addEventListener(name, onActivity, options));
    return () => {
      events.forEach(
        ({ name, options }) => window.removeEventListener(name, onActivity, options)
      );
    };
  }, [throttleMs]);
  const getLastActivity = () => lastActivityRef.current;
  return { getLastActivity, lastActivityRef };
}
function useExpiryTimer({
  expiresAtMs,
  getLastActivity,
  refreshCount,
  maxRefresh,
  onAttemptRefresh,
  onShowModal,
  onFatal,
  now
}) {
  const timerRef = useRef(null);
  const activeExpRef = useRef(0);
  const firedForExpRef = useRef(null);
  const isVisible = () => typeof document !== "undefined" && document.visibilityState === "visible";
  useEffect(() => {
    if (!expiresAtMs) return;
    activeExpRef.current = expiresAtMs;
    const WARNING_TIME = 6e4;
    const delay = Math.max(0, expiresAtMs - now() - WARNING_TIME);
    if (timerRef.current) clearTimeout(timerRef.current);
    const expForThisTimer = expiresAtMs;
    const fire = async () => {
      if (activeExpRef.current !== expForThisTimer) return;
      if (firedForExpRef.current === expForThisTimer) return;
      firedForExpRef.current = expForThisTimer;
      if (refreshCount >= maxRefresh) {
        const remainingMs = Math.max(0, expForThisTimer - now());
        console.log("expiring", remainingMs);
        onShowModal({ type: "expired", remainingMs });
        return;
      }
      if (!isVisible()) {
        const vis = () => {
          document.removeEventListener("visibilitychange", vis);
          if (activeExpRef.current === expForThisTimer) void fire();
        };
        document.addEventListener("visibilitychange", vis, { once: true });
        return;
      }
      const INACTIVITY_LIMIT = 3e4;
      const inactiveMs = now() - getLastActivity();
      const isActiveRecently = inactiveMs < INACTIVITY_LIMIT;
      if (isActiveRecently) {
        try {
          const res = await onAttemptRefresh();
          if (!res) {
            const resp = new Response("Session refresh failed", {
              status: 401,
              statusText: "Session refresh failed"
            });
            onFatal(resp);
            return;
          }
        } catch (err) {
          console.error("[useExpiryTimer] refresh error", err);
          const message = err instanceof Error ? err.message : "Unknown refresh error";
          const resp = new Response(message, {
            status: 401,
            statusText: "Session refresh error"
          });
          onFatal(resp);
        }
      } else {
        const remainingMs = Math.max(5e3, expForThisTimer - now());
        onShowModal({ type: "refresh", remainingMs });
      }
    };
    if (delay === 0) {
      void fire();
    } else {
      timerRef.current = setTimeout(fire, delay);
    }
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [
    expiresAtMs,
    refreshCount,
    maxRefresh,
    getLastActivity,
    onAttemptRefresh,
    onShowModal,
    onFatal,
    now
  ]);
}
const useSessionManager = () => {
  const loaderData = useLoaderData();
  const { exp, sessionRefreshCount, maxSessionRefresh } = loaderData;
  const now = () => Date.now();
  const [expiresAt, setExpiresAt] = useState(exp ?? 0);
  const [refreshCount, setRefreshCount] = useState(sessionRefreshCount ?? 0);
  const { getLastActivity } = useActivityTracker();
  const [fatalResponse, setFatalResponse] = useState(null);
  const attemptRefresh = async () => {
    try {
      const res = await requestSessionRefresh();
      if (!res) return null;
      setExpiresAt(res.exp);
      setRefreshCount(res.sessionRefreshCount);
      return res;
    } catch (err) {
      console.error("attemptRefresh error", err);
      return null;
    }
  };
  useEffect(() => {
    const onRefreshRequest = async () => {
      try {
        const res = await attemptRefresh();
        if (!res) {
          const resp = new Response("Session refresh failed", {
            status: 401,
            statusText: "Unauthorized"
          });
          window.dispatchEvent(
            new CustomEvent("session:refresh-response", {
              detail: { success: false, response: resp }
            })
          );
          return;
        }
        window.dispatchEvent(
          new CustomEvent("session:refresh-response", {
            detail: { success: true, result: res }
          })
        );
      } catch (err) {
        console.error("[useSessionManager] refresh on request failed:", err);
        const message = err instanceof Error ? err.message : "Unknown refresh error";
        const resp = new Response(message, {
          status: 500,
          statusText: "Session Refresh Error"
        });
        window.dispatchEvent(
          new CustomEvent("session:refresh-response", {
            detail: { success: false, response: resp }
          })
        );
      }
    };
    window.addEventListener("session:refresh-request", onRefreshRequest);
    return () => {
      window.removeEventListener(
        "session:refresh-request",
        onRefreshRequest
      );
    };
  }, [attemptRefresh]);
  const onShowModal = (payload) => showSessionModal(payload);
  const onFatal = (response) => {
    setFatalResponse(response);
  };
  useExpiryTimer({
    expiresAtMs: expiresAt,
    getLastActivity,
    refreshCount,
    maxRefresh: maxSessionRefresh ?? 1,
    onAttemptRefresh: attemptRefresh,
    onShowModal,
    onFatal,
    now
  });
  return fatalResponse;
};
const appConfigSchema = z.object({
  env: z.enum(["local", "development", "production"]),
  bffBaseUrl: z.string(),
  apiBaseUrl: z.string(),
  sessionSecret: z.string(),
  testMode: z.number(),
  optionalPropExample: z.boolean().default(false)
});
function defineConfig(config) {
  return appConfigSchema.parse(config);
}
const bffUrl$2 = "http://localhost:3500/v2/gw";
function createLocalConfig() {
  return defineConfig({
    env: "local",
    bffBaseUrl: `${bffUrl$2}`,
    apiBaseUrl: `${bffUrl$2}/kyc`,
    testMode: 0,
    sessionSecret: "b/+01TNUZjK2t30sCBaWVC5uf/bVT2xrVFKt7CSM35R7RtVpIep72fQwgxQWESrK"
  });
}
const bffUrl$1 = "https://inbound5.alb.public.858251697328.aws.opr-finance.com/v2/gw";
function createDevelopmentConfig() {
  return defineConfig({
    env: "development",
    bffBaseUrl: `${bffUrl$1}`,
    apiBaseUrl: `${bffUrl$1}/kyc`,
    testMode: 0,
    sessionSecret: "SFZrUuaYAXWE/oLmGO3ShnEs5LMOTSkGYeYVSXx8PDDh1ACwGv7AY0hF1uHV9MTe"
  });
}
const bffUrl = "https://inbound5.alb.public.039067103537.aws.opr-finance.com/v2/gw";
function createProductionConfig() {
  return defineConfig({
    env: "production",
    bffBaseUrl: `${bffUrl}`,
    apiBaseUrl: `${bffUrl}/kyc`,
    testMode: 1,
    sessionSecret: "MJXg6A6mGotVYSq79dAfDHw0tN85wQ26DsKd0LVTr3SoPFneJQQaGYBddtKAN265"
  });
}
const appConfig = getConfig();
function getConfig() {
  switch (process.env.APP_ENV) {
    case "production":
      return createProductionConfig();
    case "development":
      return createDevelopmentConfig();
    case "local":
      return createLocalConfig();
    default:
      throw new Error(`Invalid APP_ENV "${process.env.APP_ENV}"`);
  }
}
const buildUrl = (path, param) => {
  const { bffBaseUrl } = appConfig;
  if (!param) return `${bffBaseUrl}/${path}`;
  return `${bffBaseUrl}/${path}/${param}`;
};
const handleFetchResponse = async (response) => {
  if (!response.ok) {
    const errorBody = await response.text();
    console.error("API Error Response:", errorBody);
    throw new Error(`Request failed with status ${response.status}`);
  }
  const responseText = await response.text();
  try {
    return JSON.parse(responseText);
  } catch {
    const fixedJson = responseText.replace(/,(\s*[}\]])/g, "$1");
    return JSON.parse(fixedJson);
  }
};
const getRequest = async (url, authToken) => {
  const method = "GET";
  const headers = new Headers({
    "Content-Type": "application/json",
    authorization: authToken
  });
  const options = {
    method,
    headers
  };
  try {
    const response = await fetch(url, options);
    return await handleFetchResponse(response);
  } catch (error) {
    console.error(`Error with request to ${url}:`, error);
    throw new Error("API request failed");
  }
};
const postRequest = async (url, authToken, data) => {
  const method = "POST";
  const headers = new Headers({
    "Content-Type": "application/json",
    authorization: authToken
  });
  const options = {
    method,
    headers,
    ...data ? { body: JSON.stringify(data) } : {}
  };
  try {
    const response = await fetch(url, options);
    return await handleFetchResponse(response);
  } catch (error) {
    console.error(`Error with request to ${url}:`, error);
    throw new Error("API request failed");
  }
};
const deleteRequest = async (url, authToken) => {
  const method = "DELETE";
  const headers = new Headers({
    "Content-Type": "application/json",
    authorization: authToken
  });
  const options = {
    method,
    headers
  };
  try {
    const response = await fetch(url, options);
    return await handleFetchResponse(response);
  } catch (error) {
    console.error(`Error with request to ${url}:`, error);
    throw new Error("API request failed");
  }
};
const cacheSessionServicePath = "cache/session";
async function bffPost(body, id = "") {
  const url = buildUrl(cacheSessionServicePath, id);
  return postRequest(url, id, body);
}
async function bffGet(id) {
  const url = buildUrl(cacheSessionServicePath, id);
  try {
    return await getRequest(url, id);
  } catch (error) {
    console.error("Failed to get session data from bff redis", error);
    return null;
  }
}
async function bffDelete(id) {
  const url = buildUrl(cacheSessionServicePath, id);
  try {
    await deleteRequest(url, id);
  } catch (error) {
    console.error("Failed to delete session data from bff redis", error);
  }
}
const { sessionSecret } = appConfig;
const sessionCookie = createCookie("opr_kyc", {
  httpOnly: true,
  path: "/",
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  secrets: [sessionSecret],
  // maxAge is initially set for 60 sec, then it will be set per request when committing the session (calculated from sessionInfo.exp)
  maxAge: 60
});
function sessionStorage() {
  return createSessionStorage({
    cookie: sessionCookie,
    // createData: called when there's no session id cookie (create new session in redis)
    createData: async (data) => {
      const payload = {
        applicationId: data.applicationId ?? "",
        clientId: data.clientId ?? "",
        kycType: data.kycType ?? "",
        loginUrl: data.loginUrl ?? "",
        kycDoneUrl: data.kycDoneUrl ?? "",
        company: data.company ?? {
          orgNumber: "",
          companyName: "",
          sniCode: ""
        },
        session: data.session ?? {
          sessionId: "",
          exp: 0,
          sessionRefreshCount: 0,
          maxSessionRefresh: 0,
          kcUserId: ""
        },
        auth: data.auth ?? {
          given_name: "",
          family_name: "",
          ssn: "",
          iat: 0
        }
      };
      const res = await bffPost(payload);
      console.log("session CREATED", res);
      const newId = res?.redisKey ?? "";
      return newId;
    },
    async readData(id) {
      console.log("readData", id);
      if (!id) return null;
      const res = await bffGet(id);
      console.log("Session FETCHED");
      return res ? { ...res } : null;
    },
    async updateData(id, data) {
      const payload = {
        ...data
      };
      await bffPost(payload, id);
      console.log("Session UPDATED");
    },
    async deleteData(id) {
      await bffDelete(id);
      console.log("Session DELETED");
    }
  });
}
const { getSession, commitSession, destroySession } = sessionStorage();
const getOrganizationFromSession = async (request) => {
  const session = await getSession(request.headers.get("Cookie"));
  const sessionId = session.get("session")?.sessionId;
  const organizationName = session.get("company")?.companyName ?? "";
  const organizationNumber = session.get("company")?.orgNumber ?? "";
  const sniCode = session.get("company")?.sniCode ?? "";
  return {
    sessionId: sessionId ?? "",
    organizationName,
    organizationNumber,
    sniCode
  };
};
const getSessionProps = async (request, ...keys) => {
  const cookieHeader = request.headers.get("Cookie");
  const session = await getSession(cookieHeader);
  const data = session.data;
  const result = {};
  for (const key of keys) {
    result[key] = data[key];
  }
  return result;
};
async function buildDestroySessionHeader(request) {
  const session = await getSession(request.headers.get("Cookie"));
  const setCookie = await destroySession(session);
  return { "Set-Cookie": setCookie };
}
const getStatusMessages = async (lang = "en") => {
  const { bffBaseUrl } = appConfig;
  const url = `${bffBaseUrl}/content/status-message/${lang}`;
  try {
    const response = await fetch(url, {
      headers: { "Content-Type": "application/json" }
    });
    if (!response.ok) return {};
    const data = await response.json();
    return data?.data?.messages || {};
  } catch (error) {
    console.error("Failed to fetch status messages:", error);
    return {};
  }
};
const DEFAULT_THEME = "sweden-b2b-application";
const links = () => [{
  rel: "stylesheet",
  href: tailwindStyles
}];
const handle = {
  id: "root"
};
const loader$2 = async ({
  request
}) => {
  const session = await getSession(request.headers?.get("Cookie"));
  const productId = session.get("clientId") ?? DEFAULT_THEME;
  const cacheSession = session.get("session");
  const sessionId = cacheSession?.sessionId ?? void 0;
  const exp = cacheSession?.exp ?? 0;
  const maxSessionRefresh = cacheSession?.maxSessionRefresh ?? 1;
  const sessionRefreshCount = cacheSession?.sessionRefreshCount ?? 0;
  const applicationId = session.get("applicationId") ?? void 0;
  const lang = getLanguageFromProductId(productId);
  let statusMessages;
  try {
    statusMessages = await getStatusMessages(lang);
  } catch (error) {
    console.error("Failed to fetch status messages:", error);
    statusMessages = void 0;
  }
  return {
    theme: productId,
    sessionId,
    productId,
    exp,
    maxSessionRefresh,
    sessionRefreshCount,
    applicationId,
    statusMessages
  };
};
function Document({
  children,
  theme = DEFAULT_THEME,
  lang = "en"
}) {
  const themeClass = getThemeClass(theme);
  return /* @__PURE__ */ jsxs("html", {
    lang,
    "data-theme": theme,
    children: [/* @__PURE__ */ jsxs("head", {
      children: [/* @__PURE__ */ jsx("meta", {
        charSet: "utf-8"
      }), /* @__PURE__ */ jsx("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      }), /* @__PURE__ */ jsx(Meta, {}), /* @__PURE__ */ jsx(Links, {})]
    }), /* @__PURE__ */ jsxs("body", {
      className: `${themeClass} ${bodyStyles}`,
      children: [children, /* @__PURE__ */ jsx(ScrollRestoration, {}), /* @__PURE__ */ jsx(Scripts, {})]
    })]
  });
}
function ThrowResponse({
  response
}) {
  throw response;
}
function SessionManagerMount() {
  const fatalResponse = useSessionManager();
  if (fatalResponse) {
    return /* @__PURE__ */ jsx(ThrowResponse, {
      response: fatalResponse
    });
  }
  return null;
}
function SessionManagerGate() {
  const sessionData = useLoaderData();
  const hasSession = Boolean(sessionData?.sessionId);
  return hasSession ? /* @__PURE__ */ jsx(SessionManagerMount, {}) : null;
}
const root = UNSAFE_withComponentProps(function App() {
  const initialSession = useLoaderData();
  const derivedLang = getLanguageFromProductId(initialSession?.productId || DEFAULT_THEME);
  return /* @__PURE__ */ jsxs(Document, {
    theme: initialSession?.theme || DEFAULT_THEME,
    lang: derivedLang,
    children: [/* @__PURE__ */ jsx(SessionManagerGate, {}), /* @__PURE__ */ jsx(Outlet, {})]
  });
});
const ErrorBoundary$1 = UNSAFE_withErrorBoundaryProps(function ErrorBoundary() {
  const error = useRouteError();
  const rootLoaderData = useRouteLoaderData("root");
  const derivedLang = getLanguageFromProductId(rootLoaderData?.productId || DEFAULT_THEME);
  let status = 500;
  let message = "Unknown error";
  let data = {};
  if (isRouteErrorResponse(error)) {
    status = error.status;
    message = error.statusText || "Route Error response";
    data = error.data;
  } else if (error instanceof Error) {
    message = error.message || "Application error";
    data = {
      stack: error.stack
    };
  } else {
    data = {
      raw: error
    };
  }
  return /* @__PURE__ */ jsx(Document, {
    theme: DEFAULT_THEME,
    lang: derivedLang,
    children: /* @__PURE__ */ jsx(ErrorHandler, {
      status,
      message,
      data,
      statusMessages: rootLoaderData?.statusMessages
    })
  });
});
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary: ErrorBoundary$1,
  default: root,
  handle,
  links,
  loader: loader$2
}, Symbol.toStringTag, { value: "Module" }));
const verifyBffSession = async (clientId, sessionId) => {
  const verifyPath = "authenticate/verify";
  const url = buildUrl(verifyPath, clientId);
  try {
    const response = await getRequest(url, sessionId);
    return response;
  } catch (error) {
    console.error("Failed to verify session", error);
    return { status: false, ttl: 0 };
  }
};
const endBffSession = async (sessionId, clientId) => {
  const logoutPath = "authenticate/logout";
  const url = buildUrl(logoutPath, clientId);
  return getRequest(url, sessionId);
};
const refreshBffSession = async (sessionId, clientId) => {
  const url = buildUrl("refresh", clientId);
  console.log("refreshSession", clientId, sessionId);
  const response = await getRequest(url, sessionId);
  console.log("refresh response: ", response);
  return response;
};
var headerStyles = "duhc3t0";
var headerContentContainer = "duhc3t1";
var headerLogoContainer = "duhc3t2";
var headerLogoImage = "duhc3t3";
var headerTitle = "duhc3t4";
const Header = (props) => {
  return /* @__PURE__ */ jsx("header", { className: headerStyles, children: /* @__PURE__ */ jsxs(Container, { className: headerContentContainer, children: [
    /* @__PURE__ */ jsx(Container, { className: headerLogoContainer, children: /* @__PURE__ */ jsx("div", { className: headerLogoImage }) }),
    props.title && /* @__PURE__ */ jsx(Container, { children: /* @__PURE__ */ jsx("h1", { className: headerTitle, children: props.title }) })
  ] }) });
};
var footerStyle = "smsigo0";
var footerSectionContainerStyle = "smsigo1";
var footerSectionStyle = "smsigo2";
var footerHeadingStyle = "smsigo3";
var footerTextStyle = "smsigo4";
const Footer = ({ footer }) => {
  const {
    customerServiceLabel,
    customerServiceText,
    contactInfoLabel,
    contactInfoText,
    addressLabel,
    addressText
  } = footer;
  return /* @__PURE__ */ jsx("footer", { className: footerStyle, children: /* @__PURE__ */ jsxs("div", { className: footerSectionContainerStyle, children: [
    /* @__PURE__ */ jsxs("div", { className: footerSectionStyle, children: [
      /* @__PURE__ */ jsx("h2", { className: footerHeadingStyle, children: customerServiceLabel }),
      /* @__PURE__ */ jsx("p", { className: footerTextStyle, children: customerServiceText })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: footerSectionStyle, children: [
      /* @__PURE__ */ jsx("h2", { className: footerHeadingStyle, children: contactInfoLabel }),
      /* @__PURE__ */ jsx("p", { className: footerTextStyle, children: contactInfoText })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: footerSectionStyle, children: [
      /* @__PURE__ */ jsx("h2", { className: footerHeadingStyle, children: addressLabel }),
      /* @__PURE__ */ jsx("p", { className: footerTextStyle, children: addressText })
    ] })
  ] }) });
};
const parseDynamicFields = (item) => {
  let result = {
    addBObutton: null,
    boMaxCount: null,
    countryParameter: null,
    countryPlaceholder: null,
    countryQuestion: null,
    dependentQuestion: null,
    infoItems: [],
    nameParameter: null,
    namePlaceholder: null,
    nameQuestion: null,
    ownershipParameter: null,
    ownershipPlaceholder: null,
    ownershipQuestion: null,
    ssnParameter: null,
    ssnPlaceholder: null,
    ssnQuestion: null,
    pepParameter: null,
    pepQuestion: null,
    pepOptions: null,
    useCountryList: null,
    automaticAnalysis: null,
    automaticAnalysisType: null
  };
  if (!item.question.dynamicField) return result;
  const infoItems = [];
  item.question.dynamicField.forEach((dynamicField) => {
    if (isDependentQuestion(dynamicField)) {
      const parentParameter = item.question.questionParameter;
      const dependentParameter = dynamicField.questionParameter;
      const compositeKey = `${parentParameter}::${dependentParameter}`;
      result.dependentQuestion = {
        __component: "kyc.dependent-question",
        componentType: dynamicField.componentType,
        conditionValue: dynamicField.conditionValue,
        id: dynamicField.id,
        options: dynamicField.options,
        questionDescription: dynamicField.questionDescription,
        questionLabel: dynamicField.questionLabel,
        questionParameter: compositeKey,
        useCountryList: dynamicField.useCountryList,
        automaticAnalysis: dynamicField.automaticAnalysis,
        automaticAnalysisType: dynamicField.automaticAnalysisType,
        placeholder: dynamicField.placeholder,
        errorMessages: Array.isArray(dynamicField.errorMessages) ? dynamicField.errorMessages.map((item2) => ({
          error: item2.error,
          message: item2.message
        })) : [],
        infoItems: []
      };
    }
    if (isInfo(dynamicField)) {
      infoItems.push({
        componentType: dynamicField.componentType,
        infoHeader: dynamicField.infoHeader,
        infoDescription: dynamicField.infoDescription
      });
    }
    if (isBeneficialOwnerQuestion(dynamicField)) {
      const pepOptionsArray = dynamicField.pepOptions ? [
        {
          text: dynamicField.pepOptions.yes.text,
          value: dynamicField.pepOptions.yes.value
        },
        {
          text: dynamicField.pepOptions.no.text,
          value: dynamicField.pepOptions.no.value
        }
      ] : null;
      result = {
        ...result,
        ...dynamicField,
        pepOptions: pepOptionsArray
      };
    }
    if (isCountryOptions(dynamicField)) {
      result.useCountryList = dynamicField.useCountryList;
    }
  });
  result.infoItems = infoItems;
  return result;
};
const parseResponse = (apiResponse) => {
  const {
    id,
    product,
    formType,
    loginUrl,
    kycDoneUrl,
    steps,
    button,
    footer,
    companyBlock,
    formHeader,
    sessionModal,
    setOfQuestions
  } = apiResponse;
  if (!setOfQuestions || !Array.isArray(setOfQuestions)) {
    console.error("Invalid API response - questions is missing or not an array:", apiResponse);
    throw new Error("Invalid API response: questions array is missing");
  }
  const parsedSteps = [];
  for (const [k, v] of Object.entries(steps)) {
    const item = {
      stepLabel: v,
      stepName: k
    };
    parsedSteps.push(item);
  }
  let useCountryList = false;
  const stepKeyNames = Object.keys(steps);
  const parsedQuestionsByStep = /* @__PURE__ */ new Map();
  const answers = /* @__PURE__ */ new Map();
  setOfQuestions.forEach((item) => {
    const stepKeyName = stepKeyNames[item.question.step - 1];
    const answerFieldName = item.question.questionParameter;
    answers.set(answerFieldName, {
      questionId: String(item.id),
      question: answerFieldName,
      questionLabel: item.question.questionLabel,
      automaticAnalysis: item.question.automaticAnalysis ?? false,
      type: item.question.automaticAnalysis ? item.question.automaticAnalysisType : null,
      answer: "",
      answerText: void 0
    });
    item.question.dynamicField?.forEach((currentField) => {
      if (isDependentQuestion(currentField)) {
        const depField = `${answerFieldName}::${currentField.questionParameter}`;
        answers.set(depField, {
          questionId: String(currentField.id),
          question: depField,
          questionLabel: currentField.questionLabel,
          automaticAnalysis: currentField.automaticAnalysis ?? false,
          type: currentField.automaticAnalysis ? currentField.automaticAnalysisType : null,
          answer: "",
          answerText: void 0
        });
      }
    });
    const question = {
      componentType: item.question.componentType,
      step: item.question.step,
      questionParameter: item.question.questionParameter,
      questionLabel: item.question.questionLabel,
      placeholder: item.question.placeholder,
      options: item.question.options,
      errorMessages: item.question.errorMessages,
      ...parseDynamicFields(item)
    };
    const parsedQuestion = {
      id: item.id,
      question
    };
    if (!useCountryList) useCountryList = isCountryListUsed(parsedQuestion);
    if (parsedQuestionsByStep.has(stepKeyName)) {
      const stepData = parsedQuestionsByStep.get(stepKeyName);
      stepData?.push(parsedQuestion);
    } else parsedQuestionsByStep.set(stepKeyName, [parsedQuestion]);
  });
  const generalFormData = {
    steps: parsedSteps,
    button,
    footer,
    companyBlock,
    formHeader,
    sessionModal,
    useCountryList
  };
  return {
    id,
    product,
    formType,
    loginUrl,
    kycDoneUrl,
    generalFormData,
    steps: parsedQuestionsByStep,
    answers
  };
};
const getCountryList = async (productId, sessionId) => {
  const { apiBaseUrl } = appConfig;
  const url = `${apiBaseUrl}/countrylist/${productId}`;
  const response = await getRequest(url, sessionId);
  return response;
};
const getAndParseFormData = async (productId, kycType, sessionId) => {
  const { apiBaseUrl } = appConfig;
  const url = `${apiBaseUrl}/form/${productId}/${kycType}`;
  const response = await getRequest(url, sessionId);
  const parsedFormData = parseResponse(response);
  if (parsedFormData.generalFormData.useCountryList)
    parsedFormData.countryList = await getCountryList(productId, sessionId);
  return parsedFormData;
};
function mapDataForPayload(payload) {
  return {
    ...payload,
    answers: payload.answers.map((entry2) => {
      let finalAnswer = entry2.answer;
      let finalAnswerText = entry2.answerText;
      if (entry2.answer && typeof entry2.answer === "object" && !Array.isArray(entry2.answer) && "value" in entry2.answer && "text" in entry2.answer) {
        const item = entry2.answer;
        finalAnswer = item.value;
        finalAnswerText = item.text;
      }
      if (Array.isArray(entry2.answer) && entry2.answer.length > 0 && typeof entry2.answer[0] === "object" && "value" in entry2.answer[0]) {
        const items = entry2.answer;
        finalAnswer = items.map((item) => item.value);
        finalAnswerText = items.map((item) => item.text);
      }
      return {
        questionId: entry2.questionId,
        question: entry2.question,
        questionLabel: entry2.questionLabel,
        automaticAnalysis: entry2.automaticAnalysis ?? false,
        type: entry2.type,
        answer: finalAnswer,
        ...finalAnswerText && { answerText: finalAnswerText }
      };
    })
  };
}
async function sendFormData(data, productId = "", kycType = "", applicationId = "", sessionId = "") {
  const { apiBaseUrl } = appConfig;
  const url = `${apiBaseUrl}/form/${productId}/${kycType}/${applicationId}`;
  return postRequest(url, sessionId, data);
}
function computeMaxAgeFromExp(expSeconds, defaultSec = 300) {
  if (!expSeconds) return defaultSec;
  const nowSec = Math.floor(Date.now() / 1e3);
  const ttl = Math.max(1, expSeconds - nowSec);
  return ttl;
}
function populateHiddenFields(answers, SNICode) {
  if (answers.has("SNICode")) {
    const existingAnswer = answers.get("SNICode");
    answers.set("SNICode", {
      ...existingAnswer,
      questionLabel: "SNICode",
      answer: SNICode
    });
  }
  if (answers.has("DistanceAgreement")) {
    const existingAnswer = answers.get("DistanceAgreement");
    answers.set("DistanceAgreement", {
      ...existingAnswer,
      questionLabel: "DistanceAgreement",
      answer: true,
      answerText: "Ja"
      //TODO: also translations, same as for checkbox in Question.tsx
    });
  }
  return answers;
}
const loader$1 = async ({
  request,
  params
}) => {
  const {
    kycType,
    productId
  } = params;
  if (!productId || !kycType) {
    throw new Response("Missing id and/or form type", {
      status: 400,
      statusText: "Bad Request"
    });
  }
  const loaderData = {
    pageData: {},
    formData: {},
    answers: /* @__PURE__ */ new Map(),
    sessionData: {}
  };
  const session = await getSession(request.headers?.get("Cookie"));
  const {
    sessionId,
    organizationName,
    organizationNumber,
    sniCode
  } = await getOrganizationFromSession(request);
  const exp = session.get("session")?.exp ?? Date.now();
  if (!sessionId) {
    throw new Response("Session not found", {
      status: 401,
      statusText: "Unauthorized"
    });
  }
  try {
    const {
      status,
      ttl
    } = await verifyBffSession(productId, sessionId);
    if (!status || !ttl) {
      const headers = await buildDestroySessionHeader(request);
      throw new Response("Invalid session", {
        status: 401,
        statusText: "Unauthorized",
        headers
      });
    }
    const parsedFormData = await getAndParseFormData(productId, kycType, sessionId);
    populateHiddenFields(parsedFormData.answers, sniCode);
    const {
      loginUrl,
      kycDoneUrl
    } = parsedFormData;
    loaderData.formData = parsedFormData;
    loaderData.pageData = {
      organizationName,
      kycType,
      organizationNumber,
      productId,
      sniCode
    };
    loaderData.sessionData = {
      applicationId: session.get("applicationId") ?? "",
      productId: session.get("clientId") ?? "",
      sessionRefreshCount: session.get("session")?.sessionRefreshCount ?? 0,
      maxSessionRefresh: session.get("session")?.maxSessionRefresh ?? 1,
      exp,
      loginUrl: loginUrl ?? ""
    };
    const maxAge = computeMaxAgeFromExp(exp / 1e3);
    session.set("loginUrl", loginUrl);
    session.set("kycDoneUrl", kycDoneUrl);
    await commitSession(session, {
      maxAge
    });
    return {
      ...loaderData
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    const headers = await buildDestroySessionHeader(request);
    throw new Response("Error fetching data", {
      status: 500,
      statusText: "Internal Server Error",
      headers
    });
  }
};
const action$2 = async ({
  request,
  params
}) => {
  const {
    kycType,
    productId
  } = params;
  if (!kycType || !productId) {
    return {
      success: false,
      message: "Missing route parameters"
    };
  }
  try {
    const session = await getSession(request.headers?.get("Cookie"));
    const {
      applicationId,
      kycDoneUrl
    } = await getSessionProps(request, "applicationId", "kycDoneUrl");
    const kcUserId = session.get("session")?.kcUserId;
    const authData = session.get("auth");
    const {
      sessionId,
      organizationName,
      organizationNumber
    } = await getOrganizationFromSession(request);
    const formData = await request.formData();
    const answersJson = formData.get("answers");
    const questionSetId = formData.get("questionSetId");
    if (!answersJson || !applicationId || !questionSetId || !kcUserId || !authData) {
      console.error("Missing required data");
      return {
        success: false,
        message: "Missing required data",
        error: {
          hasAnswers: !!answersJson,
          hasAppId: !!applicationId,
          hasQSetId: !!questionSetId,
          hasUserId: !!kcUserId,
          hasAuthData: !!authData
        }
      };
    }
    const answerEntries = JSON.parse(answersJson);
    const bankIdAuthData = authData;
    const payload = mapDataForPayload({
      userId: kcUserId,
      applicationId,
      productId,
      questionSetId,
      organizationName,
      organizationNumber,
      bankIdAuth: {
        givenName: bankIdAuthData.given_name || "",
        familyName: bankIdAuthData.family_name || "",
        ssn: bankIdAuthData.ssn || "",
        iat: bankIdAuthData.iat || 0
      },
      answers: answerEntries
    });
    const result = await sendFormData(payload, productId, kycType, applicationId, sessionId);
    console.log("Backend result:", result);
    if (result.status === "ok") {
      try {
        const cookieHeader = await destroySession(session);
        const headers = {};
        if (cookieHeader) {
          headers["Set-Cookie"] = cookieHeader;
        }
        return new Response(null, {
          status: 303,
          headers: {
            ...headers,
            Location: kycDoneUrl
          }
        });
      } catch (err) {
        console.error("Failed to destroy session server-side (thank-you):", err);
        return new Response(null, {
          status: 303,
          headers: {
            Location: kycDoneUrl
          }
        });
      }
    }
    return {
      success: false,
      message: "Submission failed: API returned error",
      serverResult: result
    };
  } catch (error) {
    console.error("Error submitting form:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const errorStack = error instanceof Error ? error.stack : void 0;
    return {
      success: false,
      message: `Failed to submit form: ${errorMessage}`,
      error: {
        message: errorMessage,
        stack: errorStack,
        type: error instanceof Error ? error.constructor.name : typeof error
      }
    };
  }
};
const $productId_$kycType = UNSAFE_withComponentProps(function KycFormPage() {
  const actionData = useActionData();
  const loaderData = useLoaderData();
  const error = React.useMemo(() => {
    if (!actionData || !loaderData) return void 0;
    return actionData.success === false ? {
      message: actionData.message
    } : void 0;
  }, [actionData, loaderData]);
  const formData = loaderData.formData;
  const pageData = loaderData.pageData;
  const sessionData = loaderData.sessionData;
  const {
    applicationId,
    loginUrl
  } = sessionData;
  useEffect(() => {
    if (applicationId) {
      localStorage.setItem("applicationId", applicationId);
    }
    if (loginUrl) localStorage.setItem("loginUrl", loginUrl);
  }, [applicationId, loginUrl]);
  return /* @__PURE__ */ jsxs(Container, {
    className: pageContentStyle,
    children: [/* @__PURE__ */ jsx(Header, {
      title: formData.generalFormData.formHeader.title
    }), /* @__PURE__ */ jsx(FormPage, {
      generalData: pageData,
      formData,
      error
    }), /* @__PURE__ */ jsx(Footer, {
      footer: formData.generalFormData.footer
    }), /* @__PURE__ */ jsx(SessionModalManager, {
      ...formData.generalFormData.sessionModal,
      sessionData
    })]
  });
});
const ErrorBoundary2 = UNSAFE_withErrorBoundaryProps(function ErrorBoundary3() {
  const error = useRouteError();
  const rootData = useRouteLoaderData("root");
  let status = 500;
  let message = "Unknown error";
  let data = {};
  if (isRouteErrorResponse(error)) {
    status = error.status ?? 500;
    message = error.statusText || "Something went wrong";
    data = error.data ?? void 0;
  } else if (error instanceof Error) {
    message = error.message || "Application error";
    data = {
      stack: error.stack
    };
  } else {
    status = error instanceof Response ? error.status : 500;
    message = error instanceof Response ? error.statusText : "Error";
    data = {
      raw: error
    };
  }
  return /* @__PURE__ */ jsx(ErrorHandler, {
    status,
    message,
    data,
    statusMessages: rootData?.statusMessages
  });
});
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary: ErrorBoundary2,
  action: action$2,
  default: $productId_$kycType,
  loader: loader$1
}, Symbol.toStringTag, { value: "Module" }));
const action$1 = async ({
  request
}) => {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const session = await getSession(cookieHeader);
  const sessionId = session.get("session")?.sessionId;
  const clientId = session.get("clientId");
  if (!sessionId || !clientId) {
    return new Response(JSON.stringify({
      error: "Missing session"
    }), {
      status: 401,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
  try {
    const result = await refreshBffSession(sessionId, clientId);
    if (!result || !result.sessionId || !result.exp) {
      const destroyHeaders = await buildDestroySessionHeader(request);
      return new Response(JSON.stringify({
        error: "Session refresh failed"
      }), {
        status: 401,
        headers: {
          ...destroyHeaders,
          "Content-Type": "application/json"
        }
      });
    }
    let exp = result.exp;
    const maxAge = computeMaxAgeFromExp(exp);
    if (typeof exp === "number" && exp < 1e12) exp = exp * 1e3;
    const cacheSessionData = session.get("session") ?? {
      sessionId: "",
      exp: 0,
      sessionRefreshCount: 0,
      maxSessionRefresh: 0,
      kcUserId: ""
    };
    const updatedSessionData = {
      ...cacheSessionData,
      exp,
      sessionRefreshCount: result.sessionRefreshCount ?? 0,
      sessionId: result.sessionId
    };
    session.set("session", updatedSessionData);
    const setCookie = await commitSession(session, {
      maxAge
    });
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        "Set-Cookie": setCookie,
        "Content-Type": "application/json"
      }
    });
  } catch (err) {
    console.error("refresh action error", err);
    const destroyHeaders = await buildDestroySessionHeader(request);
    return new Response(JSON.stringify({
      error: "Failed refreshing session"
    }), {
      status: 500,
      headers: {
        ...destroyHeaders,
        "Content-Type": "application/json"
      }
    });
  }
};
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$1
}, Symbol.toStringTag, { value: "Module" }));
const action = async ({
  request
}) => {
  const cookie = request.headers.get("cookie") || "";
  const session = await getSession(cookie);
  if (!session) {
    return jsonResponse({
      success: false,
      message: "Session not found in Redis",
      cookieCleared: false
    }, 401);
  }
  const sessionId = session.get("session")?.sessionId;
  const clientId = session.get("clientId");
  if (!sessionId || !clientId) {
    return jsonResponse({
      success: false,
      message: "Session or client ID not found",
      cookieCleared: false
    }, 401);
  }
  let backendStatus = null;
  let backendOk = false;
  let backendMessage;
  try {
    const result = await endBffSession(sessionId, clientId);
    backendStatus = result.status;
    backendOk = backendStatus === 200 || backendStatus === 204;
    backendMessage = "Backend logout completed";
    console.log("Backend logout result:", result);
  } catch (err) {
    backendStatus = null;
    backendOk = false;
    backendMessage = String(err ?? "Unknown error calling backend logout");
    console.error("Error calling backend logout:", err);
  }
  let cookieHeader = null;
  let cookieCleared = false;
  try {
    cookieHeader = await destroySession(session);
    cookieCleared = Boolean(cookieHeader);
  } catch (cookieErr) {
    console.error("Failed to clear local session cookie:", cookieErr);
    cookieCleared = false;
  }
  const body = {
    success: true,
    message: cookieCleared ? "Session ended locally." : "Session endpoint hit. Local cookie clearing failed; you may still be signed in in this browser.",
    cookieCleared,
    backend: {
      status: backendStatus,
      ok: backendOk,
      message: backendMessage
    }
  };
  const headers = {
    "Content-Type": "application/json"
  };
  if (cookieCleared && cookieHeader) {
    headers["Set-Cookie"] = cookieHeader;
  }
  return new Response(JSON.stringify(body), {
    status: 200,
    headers
  });
};
function jsonResponse(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json"
    }
  });
}
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action
}, Symbol.toStringTag, { value: "Module" }));
const getTestData = (appId, id, expires) => {
  return {
    applicationId: appId,
    clientId: "sweden-b2b-application",
    kycType: "onboarding",
    loginUrl: "https://ansok.858251697328.aws.opr-foretagslan.se/start",
    kycDoneUrl: "https://ansok.858251697328.aws.opr-foretagslan.se/thank-you?status=kyc_ready",
    company: {
      companyName: "OPR-Finance AB",
      orgNumber: "556707-7044",
      sniCode: "45892 jordbruks"
    },
    session: {
      kcUserId: "test-kc-user-id",
      sessionId: id,
      exp: expires,
      sessionRefreshCount: 0,
      maxSessionRefresh: 5
    },
    auth: {
      given_name: "Test Name",
      family_name: "Test Surname",
      ssn: "1234567",
      iat: Date.now()
    }
  };
};
const loader = async ({
  request
}) => {
  const url = new URL(request.url);
  const searchParams = Object.fromEntries(url.searchParams.entries());
  let cachedData = null;
  const {
    testMode
  } = appConfig;
  if (testMode === 1) {
    const expires = (Math.floor(Date.now() / 1e3) + 5 * 60) * 1e3;
    const {
      appid,
      id
    } = searchParams;
    console.log(`Test Mode with appId: ${appid} and sessonId ${id}`);
    cachedData = getTestData(appid, id, expires);
  } else {
    const {
      key
    } = searchParams;
    cachedData = await bffGet(key);
  }
  console.log("cachedData", cachedData);
  if (!cachedData) {
    throw new Response("Invalid or expired session", {
      status: 401,
      statusText: "Unauthorized"
    });
  }
  const {
    clientId,
    kycType
  } = cachedData;
  const {
    sessionId,
    exp
  } = cachedData.session;
  const {
    status,
    ttl
  } = await verifyBffSession(clientId, sessionId);
  if (!status || !ttl) {
    const headers = await buildDestroySessionHeader(request);
    throw new Response("Invalid or expired session", {
      status: 401,
      statusText: "Unauthorized",
      headers
    });
  }
  console.log("start cache-session FLOW");
  const maxAge = computeMaxAgeFromExp(exp ? exp / 1e3 : Date.now() / 1e3);
  const session = await getSession(request.headers.get("cookie"));
  const sessionValues = {
    ...cachedData,
    kycDoneUrl: "",
    loginUrl: ""
  };
  Object.entries(sessionValues).forEach(([k, v]) => {
    if (v !== void 0) session.set(k, v);
  });
  const cookieHeader = await commitSession(session, {
    maxAge
  });
  return redirect(`/${clientId}/${kycType}`, {
    headers: {
      "Set-Cookie": cookieHeader
    }
  });
};
const _index = UNSAFE_withComponentProps(function Index() {
  return null;
});
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _index,
  loader
}, Symbol.toStringTag, { value: "Module" }));
const route5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-BdtN8ozW.js", "imports": ["/assets/jsx-runtime-u17CrQMm.js", "/assets/chunk-WWGJGFF6-CEBmBqlZ.js", "/assets/index-CoXxLMa9.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": true, "module": "/assets/root-Br5aWBAS.js", "imports": ["/assets/jsx-runtime-u17CrQMm.js", "/assets/chunk-WWGJGFF6-CEBmBqlZ.js", "/assets/index-CoXxLMa9.js", "/assets/SessionModalManager-C4fSKPVD.js"], "css": ["/assets/root-D80hnhh4.css", "/assets/SessionModalManager-D9jA6q33.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/$productId.$kycType": { "id": "routes/$productId.$kycType", "parentId": "root", "path": ":productId/:kycType", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": true, "module": "/assets/_productId._kycType-neJikNXx.js", "imports": ["/assets/chunk-WWGJGFF6-CEBmBqlZ.js", "/assets/jsx-runtime-u17CrQMm.js", "/assets/SessionModalManager-C4fSKPVD.js", "/assets/index-CoXxLMa9.js"], "css": ["/assets/_productId-CT9B_9vP.css", "/assets/SessionModalManager-D9jA6q33.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/refresh-session": { "id": "routes/refresh-session", "parentId": "root", "path": "refresh-session", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/refresh-session-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/end-session": { "id": "routes/end-session", "parentId": "root", "path": "end-session", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/end-session-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/_index": { "id": "routes/_index", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/_index-Bw1WqFt4.js", "imports": ["/assets/chunk-WWGJGFF6-CEBmBqlZ.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/types": { "id": "routes/types", "parentId": "root", "path": "types", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/index-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 } }, "url": "/assets/manifest-2f4ae3b7.js", "version": "2f4ae3b7", "sri": void 0 };
const assetsBuildDirectory = "build/client";
const basename = "/";
const future = { "unstable_optimizeDeps": false, "unstable_subResourceIntegrity": false, "v8_middleware": false, "v8_splitRouteModules": false, "v8_viteEnvironmentApi": false };
const ssr = true;
const isSpaMode = false;
const prerender = [];
const routeDiscovery = { "mode": "lazy", "manifestPath": "/__manifest" };
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/$productId.$kycType": {
    id: "routes/$productId.$kycType",
    parentId: "root",
    path: ":productId/:kycType",
    index: void 0,
    caseSensitive: void 0,
    module: route1
  },
  "routes/refresh-session": {
    id: "routes/refresh-session",
    parentId: "root",
    path: "refresh-session",
    index: void 0,
    caseSensitive: void 0,
    module: route2
  },
  "routes/end-session": {
    id: "routes/end-session",
    parentId: "root",
    path: "end-session",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route4
  },
  "routes/types": {
    id: "routes/types",
    parentId: "root",
    path: "types",
    index: void 0,
    caseSensitive: void 0,
    module: route5
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  prerender,
  publicPath,
  routeDiscovery,
  routes,
  ssr
};

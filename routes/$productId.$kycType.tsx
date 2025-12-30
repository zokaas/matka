import React, { JSX, useEffect } from "react";
import {
    ActionFunction,
    ActionFunctionArgs,
    isRouteErrorResponse,
    useActionData,
    useLoaderData,
    useRouteError,
    useRouteLoaderData,
} from "react-router";

import {
    getSession as getCachedSession,
    destroySession,
    buildDestroySessionHeader,
    commitSession,
    getSessionProps,
    getOrganizationFromSession,
} from "~/services/session/cacheSession.server";
import { verifyBffSession } from "~/services/session/sessionProvider.server";

import {
    T_ClientSessionData,
    T_ProductIdLoaderData,
    T_ProductIdPageData,
} from "./types/productIdPage";
import { T_ParsedFormData, T_AnswerObject } from "~/types";
import { Route } from "apps/kyc/.react-router/types/app/+types/root";

import { Header } from "@ui/header";
import { Container } from "@ui/container";
import { pageContentStyle } from "~/styles/pageContentStyle.css";
import { ErrorHandler, FormPage, SessionModalManager, T_ErrorView } from "apps/kyc/components";
import { Footer } from "@ui/footer";
import { T_ActionResponse } from "./types";
import { getAndParseFormData } from "~/services/api/get-form-data.server";
import { mapDataForPayload } from "~/services/utils/mapDataForPayload.server";
import { sendFormData } from "~/services/api/api-kyc.server";
import { computeMaxAgeFromExp } from "~/utils/expiryUtils.server";
import { LoaderData } from "~/root";
import { populateHiddenFields } from "~/utils/populateHiddenFields";

export const loader = async ({
    request,
    params,
}: Route.LoaderArgs): Promise<T_ProductIdLoaderData> => {
    const { kycType, productId } = params;

    if (!productId || !kycType) {
        throw new Response("Missing id and/or form type", {
            status: 400,
            statusText: "Bad Request",
        });
    }

    const loaderData: T_ProductIdLoaderData = {
        pageData: {},
        formData: {},
        answers: new Map(),
        sessionData: {},
    };

    const session = await getCachedSession(request.headers?.get("Cookie"));
    const { sessionId, organizationName, organizationNumber, sniCode } =
        await getOrganizationFromSession(request);
    const exp = session.get("session")?.exp ?? Date.now();

    if (!sessionId) {
        throw new Response("Session not found", { status: 401, statusText: "Unauthorized" });
    }

    try {
        const { status, ttl } = await verifyBffSession(productId, sessionId);

        if (!status || !ttl) {
            const headers = await buildDestroySessionHeader(request);
            // treat as unauthorized / session invalid
            throw new Response("Invalid session", {
                status: 401,
                statusText: "Unauthorized",
                headers,
            });
        }

        const parsedFormData = await getAndParseFormData(productId, kycType, sessionId);
        populateHiddenFields(parsedFormData.answers, sniCode);

        const { loginUrl, kycDoneUrl } = parsedFormData;
        loaderData.formData = parsedFormData;
        loaderData.pageData = {
            organizationName,
            kycType,
            organizationNumber,
            productId,
            sniCode,
        };
        loaderData.sessionData = {
            applicationId: session.get("applicationId") ?? "",
            applicationUuid: session.get("applicationUuid") ?? "",
            productId: session.get("clientId") ?? "",
            sessionRefreshCount: session.get("session")?.sessionRefreshCount ?? 0,
            maxSessionRefresh: session.get("session")?.maxSessionRefresh ?? 1,
            exp,
            loginUrl: loginUrl ?? "",
        };

        const maxAge = computeMaxAgeFromExp(exp / 1000);
        session.set("loginUrl", loginUrl);
        session.set("kycDoneUrl", kycDoneUrl);
        await commitSession(session, { maxAge });

        return {
            ...loaderData,
        };
    } catch (error) {
        console.error("Error fetching data:", error);
        const headers = await buildDestroySessionHeader(request);
        throw new Response("Error fetching data", {
            status: 500,
            statusText: "Internal Server Error",
            headers,
        });
    }
};

export const action: ActionFunction = async ({ request, params }: ActionFunctionArgs) => {
    const { kycType, productId } = params;

    if (!kycType || !productId) {
        return { success: false, message: "Missing route parameters" };
    }

    try {
        const session = await getCachedSession(request.headers?.get("Cookie"));
        const { applicationUuid, kycDoneUrl } = await getSessionProps(
            request,
            "applicationUuid",
            "kycDoneUrl"
        );

        let applicationId = session.get("applicationId");
        if (!applicationId) applicationId = "";
        const kcUserId = session.get("session")?.kcUserId;
        const authData = session.get("auth");

        const { sessionId, organizationName, organizationNumber } =
            await getOrganizationFromSession(request);

        const formData = await request.formData();
        const answersJson = formData.get("answers");
        const questionSetId = formData.get("questionSetId");

        console.log("applicationId", applicationId);
        console.log("answersJson", answersJson);
        console.log("applicationUuid", applicationUuid);
        console.log("questionSetId", questionSetId);
        console.log("kcUserId", kcUserId);
        console.log("authData", authData);

        if (
            !answersJson ||
            !applicationId ||
            !applicationUuid ||
            !questionSetId ||
            !kcUserId ||
            !authData
        ) {
            console.error("Missing required data");
            console.debug("missing answersJson", !answersJson);
            console.debug("missing applicationUuid", !applicationUuid);
            console.debug("missing applicationId", !applicationId);
            console.debug("missing questionSetId", !questionSetId);
            console.debug("missing kcUserId", !kcUserId);
            console.debug("missing authData", !authData);
            return {
                success: false,
                message: "Missing required data",
                error: {
                    hasAnswers: !!answersJson,
                    hasAppId: !!applicationId,
                    hasAppUuid: !!applicationUuid,
                    hasQSetId: !!questionSetId,
                    hasUserId: !!kcUserId,
                    hasAuthData: !!authData,
                },
            };
        }

        const answerEntries = JSON.parse(answersJson as string) as Array<T_AnswerObject>;

        const bankIdAuthData = authData;

        const payload = mapDataForPayload({
            userId: kcUserId,
            applicationId,
            applicationUuid,
            productId,
            questionSetId: questionSetId as string,
            organizationName,
            organizationNumber,
            bankIdAuth: {
                givenName: bankIdAuthData.given_name || "",
                familyName: bankIdAuthData.family_name || "",
                ssn: bankIdAuthData.ssn || "",
                iat: bankIdAuthData.iat || 0,
            },
            answers: answerEntries,
        });

        const result = await sendFormData(payload, productId, kycType, applicationId, sessionId);

        console.log("Backend result:", result);

        if (result.status === "ok") {
            // Attempt to clear server-side session cookie and return it with the redirect
            try {
                const cookieHeader = await destroySession(session); // returns Set-Cookie value
                const headers: Record<string, string> = {};
                if (cookieHeader) {
                    headers["Set-Cookie"] = cookieHeader;
                }
                // 303 See Other -> PRG pattern.
                return new Response(null, {
                    status: 303,
                    headers: {
                        ...headers,
                        Location: kycDoneUrl,
                    },
                });
            } catch (err) {
                console.error("Failed to destroy session server-side (thank-you):", err);
                // Still redirect even if cookie clearing failed — still PRG
                return new Response(null, {
                    status: 303,
                    headers: { Location: kycDoneUrl },
                });
            }
        }
        //domain failure (e.g. validation or API returned not-ok)
        return {
            success: false,
            message: "Submission failed: API returned error",
            serverResult: result,
        } as T_ActionResponse;
    } catch (error) {
        console.error("Error submitting form:", error);

        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        const errorStack = error instanceof Error ? error.stack : undefined;

        return {
            success: false,
            message: `Failed to submit form: ${errorMessage}`,
            error: {
                message: errorMessage,
                stack: errorStack,
                type: error instanceof Error ? error.constructor.name : typeof error,
            },
        };
    }
};

export default function KycFormPage(): JSX.Element {
    const actionData = useActionData<T_ActionResponse | undefined>();
    const loaderData = useLoaderData<T_ProductIdLoaderData>();

    const error = React.useMemo<T_ErrorView | undefined>(() => {
        if (!actionData || !loaderData) return undefined;
        return actionData.success === false ? { message: actionData.message } : undefined;
    }, [actionData, loaderData]);

    const formData = loaderData.formData as T_ParsedFormData;
    const pageData = loaderData.pageData as T_ProductIdPageData;
    const sessionData = loaderData.sessionData as T_ClientSessionData;
    // save application Uuid for the case when session is not valid
    const { applicationUuid, loginUrl } = sessionData;
    useEffect(() => {
        if (applicationUuid) {
            localStorage.setItem("applicationUuid", applicationUuid);
        }
        if (loginUrl) localStorage.setItem("loginUrl", loginUrl);
    }, [applicationUuid, loginUrl]);

    return (
        <Container className={pageContentStyle}>
            <Header title={formData.generalFormData.formHeader.title} />
            <FormPage generalData={pageData} formData={formData} error={error} />
            <Footer footer={formData.generalFormData.footer} />
            <SessionModalManager
                {...formData.generalFormData.sessionModal}
                sessionData={sessionData}
            />
        </Container>
    );
}

export function ErrorBoundary() {
    const error = useRouteError();
    const rootData = useRouteLoaderData<LoaderData>("root");

    let status = 500;
    let message = "Unknown error";
    let data: unknown = {};

    if (isRouteErrorResponse(error)) {
        status = error.status ?? 500;
        message = error.statusText || "Something went wrong";
        data = error.data ?? undefined;
    } else if (error instanceof Error) {
        message = error.message || "Application error";
        data = { stack: error.stack };
    } else {
        status = error instanceof Response ? error.status : 500;
        message = error instanceof Response ? error.statusText : "Error";
        data = { raw: error };
    }

    return (
        <ErrorHandler
            status={status}
            message={message}
            data={data}
            statusMessages={rootData?.statusMessages}
        />
    );
}

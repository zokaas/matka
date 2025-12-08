import React, { useEffect } from "react";
import {
    ActionFunction,
    ActionFunctionArgs,
    useActionData,
    useLoaderData,
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
import { FormPage } from "../../components/Form";
import { T_ParsedFormData, T_AnswerObject } from "~/types";
import { Route } from "apps/kyc/.react-router/types/app/+types/root";

import { Header } from "@ui/header";
import { Container } from "@ui/container";
import { pageContentStyle } from "~/styles/pageContentStyle.css";
import { SessionModalManager, T_ErrorView } from "apps/kyc/components";
import { Footer } from "@ui/footer";
import { T_ActionResponse } from "./types";
import { getAndParseFormData } from "~/services/api/get-form-data.server";
import { mapDataForPayload } from "~/services/utils/mapDataForPayload.server";
import { sendFormData } from "~/services/api/api-kyc.server";
import { computeMaxAgeFromExp } from "~/utils/expiryUtils.server";

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
    const { sessionId, organizationName, organizationNumber } =
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

        const { loginUrl, kycDoneUrl } = parsedFormData;
        loaderData.formData = parsedFormData;
        loaderData.pageData = {
            organizationName,
            kycType,
            organizationNumber,
            productId,
        };
        loaderData.sessionData = {
            applicationId: session.get("applicationId") ?? "",
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
        const { applicationId, kycDoneUrl } = await getSessionProps(
            request,
            "applicationId",
            "kycDoneUrl"
        );
        const kcUserId = session.get("session")?.kcUserId;

        const { sessionId, organizationName, organizationNumber } =
            await getOrganizationFromSession(request);

        const formData = await request.formData();
        const answersJson = formData.get("answers");
        const questionSetId = formData.get("questionSetId");

        if (!answersJson || !applicationId || !questionSetId || !kcUserId) {
            console.error("Missing required data");
            return {
                success: false,
                message: "Missing required data",
                error: {
                    hasAnswers: !!answersJson,
                    hasAppId: !!applicationId,
                    hasQSetId: !!questionSetId,
                    hasUserId: !!kcUserId,
                },
            };
        }

        const answerEntries = JSON.parse(answersJson as string) as Array<T_AnswerObject>;

        const payload = mapDataForPayload(
            answerEntries,
            kcUserId,
            applicationId,
            productId,
            questionSetId as string,
            organizationName,
            organizationNumber
        );
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
    // save application id for the case when session is not valid
    const { applicationId, loginUrl } = sessionData;
    useEffect(() => {
        if (applicationId) {
            localStorage.setItem("applicationId", applicationId);
        }
        if (loginUrl) localStorage.setItem("loginUrl", loginUrl);
    }, [applicationId, loginUrl]);

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

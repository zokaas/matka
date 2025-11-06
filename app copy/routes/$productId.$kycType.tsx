import React from "react";
import {
    ActionFunction,
    ActionFunctionArgs,
    isRouteErrorResponse,
    useActionData,
    useLoaderData,
    useNavigate,
    useRouteError,
} from "react-router";
import { verifySession } from "~/services/sessionProvider.server";
import {
    endOwnSession,
    getOrganizationFromSession,
    getSession,
} from "~/services/sessionStorage.server";

import { getAndParseFormData } from "~/services/api/get-form-data.server";
import { T_ProductIdLoaderData, T_ProductIdPageData } from "./types/productIdPage";
import { FormPage } from "../../components/Form";
import { T_ParsedFormData, T_AnswerObject } from "~/types";
import { Route } from "apps/kyc/.react-router/types/app/+types/root";

import { Header } from "@ui/header";
import { Container } from "@ui/container";
import { pageContentStyle } from "~/styles/pageContentStyle.css";
import { sendFormData } from "~/services/api/api-kyc.server";
import { mapDataForPayload } from "~/services/utils/mapDataForPayload.server";
import { SessionModalManager, ErrorHandler, T_ErrorView } from "apps/kyc/components";
import { Footer } from "@ui/footer";
import { useSession } from "~/context";
import { T_ActionResponse } from "./types";

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
    };

    const { sessionId, organizationName, organizationNumber } =
        await getOrganizationFromSession(request);

    if (!sessionId) {
        throw new Response("Session not found", { status: 401, statusText: "Unauthorized" });
    }

    try {
        const { status, ttl } = await verifySession(productId, sessionId);

        if (!status || !ttl) {
            // treat as unauthorized / session invalid
            throw new Response("Invalid session", { status: 401, statusText: "Unauthorized" });
        }

        loaderData.formData = await getAndParseFormData(productId, kycType, sessionId);
        loaderData.pageData = {
            organizationName: encodeURIComponent(organizationName),
            kycType,
            organizationNumber,
            productId,
            ttl,
        };

        return {
            ...loaderData,
        };
    } catch (error) {
        console.error("Error fetching data:", error);
        throw new Response("Error fetching data", {
            status: 500,
            statusText: "Internal Server Error",
        });
    }
};

export const action: ActionFunction = async ({ request, params }: ActionFunctionArgs) => {
    const { kycType, productId } = params;

    if (!kycType || !productId) {
        return { success: false, message: "Missing route parameters" };
    }

    try {
        const session = await getSession(request.headers?.get("Cookie"));
        const applicationId = session.get("applicationId");
        const kcUserId = session.get("kcUserId");
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
        console.log("payload", payload);
        const result = await sendFormData(payload, productId, kycType, applicationId, sessionId);

        console.log("Backend result:", result);

        if (result.status === "ok") {
            // Attempt to clear server-side session cookie and return it with the redirect
            try {
                const cookieHeader = await endOwnSession(request); // returns Set-Cookie value
                const headers: Record<string, string> = {};
                if (cookieHeader) {
                    headers["Set-Cookie"] = cookieHeader;
                }
                // 303 See Other -> PRG pattern.
                return new Response(null, {
                    status: 303,
                    headers: {
                        ...headers,
                        Location: "/thank-you",
                    },
                });
            } catch (err) {
                console.error("Failed to destroy session server-side (thank-you):", err);
                // Still redirect even if cookie clearing failed — still PRG
                return new Response(null, {
                    status: 303,
                    headers: { Location: "/thank-you" },
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

    const error = React.useMemo<T_ErrorView | undefined>(() => {
        if (!actionData) return undefined;
        return actionData.success === false ? { message: actionData.message } : undefined;
    }, [actionData]);

    const { session } = useSession();
    const navigate = useNavigate();
    // If no active session, navigate away (prevents showing form after logout)
    React.useEffect(() => {
        if (session.status !== "active") {
            // Replace history so back doesn't bring user back to the form
            navigate("/", { replace: true });
        }
    }, [session.status, navigate]);

    const loaderData = useLoaderData<T_ProductIdLoaderData>();
    const formData = loaderData.formData as T_ParsedFormData;
    const pageData = loaderData.pageData as T_ProductIdPageData;
    const { productId } = pageData;

    return (
        <Container className={pageContentStyle}>
            <Header logoSrc="/logos/t.svg" title={formData.generalFormData.formHeader.title} />
            <FormPage generalData={pageData} formData={formData} error={error} />
            <Footer footer={formData.generalFormData.footer} />
            <SessionModalManager {...formData.generalFormData.sessionModal} productId={productId} />
        </Container>
    );
}

export function ErrorBoundary() {
    const error = useRouteError();

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

    return <ErrorHandler status={status} message={message} data={data} />;
}

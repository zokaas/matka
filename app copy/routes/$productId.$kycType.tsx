import React from "react";
import { ActionFunctionArgs, Navigate, redirect, useLoaderData } from "react-router";
import { verifySession } from "~/services/sessionProvider.server";
import { getOrganizationFromSession, getSession } from "~/services/sessionStorage.server";

import { getAndParseFormData } from "~/services/api/get-form-data.server";
import { T_ProductIdLoaderData, T_ProductIdPageData } from "./types/productIdPage";
import { FormPage } from "../../components/Form";
import { T_ParsedFormData, T_AnswerObject } from "~/types";
import { Route } from "apps/kyc/.react-router/types/app/+types/root";

import { Header } from "@ui/header";
import { Container } from "@ui/container";
import { pageContentStyle } from "~/styles/pageContentStyle.css";
import { SessionModalManager } from "apps/kyc/components";
import { sendFormData } from "~/services/api/api-kyc.server";
import { mapDataForPayload } from "~/services/utils/mapDataForPayload.server";

export const loader = async ({
    request,
    params,
}: Route.LoaderArgs): Promise<T_ProductIdLoaderData> => {
    const { kycType, productId } = params;

    const loaderData: T_ProductIdLoaderData = {
        pageData: {},
        formData: {},
        answers: new Map(),
    };

    if (!productId || !kycType)
        return {
            ...loaderData,
            error: {
                message: "Missing id and / or form type",
                type: "paramMissing",
            },
        };

    const { sessionId, companyName, orgNumber } = await getOrganizationFromSession(request);

    try {
        const { status, ttl } = await verifySession(productId, sessionId);

        if (!status || !ttl) {
            return {
                ...loaderData,
                error: {
                    message: "Error happened",
                    type: "generalError",
                },
            };
        }

        loaderData.formData = await getAndParseFormData(productId, kycType, sessionId);
        loaderData.pageData = {
            companyName,
            kycType,
            orgNumber,
            productId,
            ttl,
        };

        if (!sessionId)
            return {
                ...loaderData,
                error: {
                    message: "Session not found",
                    type: "sessionError",
                },
            };

        return {
            ...loaderData,
        };
    } catch (error) {
        console.error("Error fetching data:", error);
        throw new Response("Error fetching data", { status: 500 });
    }
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
    const { kycType, productId } = params;

    if (!kycType || !productId) {
        return { success: false, message: "Missing route parameters" };
    }

    try {
        const session = await getSession(request.headers?.get("Cookie"));
        const applicationId = session.get("applicationId");
        const kcUserId = session.get("kcUserId");
        const { sessionId, companyName, orgNumber } = await getOrganizationFromSession(request);

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
            companyName,
            orgNumber
        );
        console.log("payload", payload);
        const result = await sendFormData(payload, productId, kycType, applicationId, sessionId);

        console.log("Backend result:", result);

        if (result.status === "ok") {
            return redirect("/thank-you");
        }

        return {
            success: true,
            message: "Form submitted successfully",
            data: result,
        };
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
    const loaderData = useLoaderData<T_ProductIdLoaderData>();

    if (loaderData.error) return <Navigate replace to="/error" />;

    const formData = loaderData.formData as T_ParsedFormData;
    const pageData = loaderData.pageData as T_ProductIdPageData;

    return (
        <Container className={pageContentStyle}>
            <Header logoSrc="/logos/t.svg" title={formData.generalFormData.formHeader.title} />
            <FormPage generalData={pageData} formData={formData} />
            <SessionModalManager {...formData.generalFormData.sessionModal} />
        </Container>
    );
}

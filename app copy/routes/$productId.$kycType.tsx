// app copy/routes/$productId.$kycType.tsx
import React from "react";
import { ActionFunctionArgs, Navigate, useLoaderData } from "react-router";
import { verifySession } from "~/services/sessionProvider.server";
import { getOrganizationFromSession, getSession } from "~/services/sessionStorage.server";

import { getAndParseFormData } from "~/services/api/get-form-data.server";
import { T_ProductIdLoaderData, T_ProductIdPageData } from "./types/productIdPage";
import { FormPage } from "../../components/Form";
import { T_ParsedFormData } from "~/types";
import { Route } from "apps/kyc/.react-router/types/app/+types/root";

import { Header } from "@ui/header";
import { Container } from "@ui/container";
import { pageContentStyle } from "~/styles/pageContentStyle.css";
import { SessionModalManager } from "apps/kyc/components";
import { sendFormData } from "~/services/api/api-kyc.server";

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

// app copy/routes/$productId.$kycType.tsx
export const action = async ({ request, params }: ActionFunctionArgs) => {
    console.log("=== ACTION CALLED ===");
    const { kycType, productId } = params;

    console.log("Params:", { kycType, productId });

    try {
        const { sessionId } = await getOrganizationFromSession(request);
        console.log("Session ID:", sessionId);

        const formData = await request.formData();
        console.log("FormData entries:");
        for (const [key, value] of formData.entries()) {
            console.log(`  ${key}:`, value);
        }

        const answersJson = formData.get("answers");
        const applicationId = formData.get("applicationId") as string;

        console.log("Extracted data:", {
            answersJson: answersJson ? "present" : "missing",
            applicationId,
            productId,
            kycType,
        });

        if (!answersJson || !productId || !kycType || !applicationId) {
            console.error("Missing required data");
            return {
                success: false,
                message: "Missing required data",
                error: { answersJson, applicationId, productId, kycType },
            };
        }

        const answers = JSON.parse(answersJson as string);
        console.log("Parsed answers:", answers);
        console.log(
            "Answers with values:",
            answers.filter((a: any) => a.answer !== "")
        );

        // Get additional required data from session
        const session = await getSession(request.headers?.get("Cookie"));
        const kcUserId = session.get("kcUserId"); // Keycloak user ID from session

        // Get questionSetId from the form metadata
        // You might need to pass this from the loader or get it from the API
        const questionSetId = "1"; // TODO: Get this from somewhere proper

        console.log("Building payload with:", {
            userId: kcUserId,
            applicationId,
            productId,
            questionSetId,
            answersCount: answers.length,
        });

        // Build the payload according to backend requirements
        const payload = {
            userId: kcUserId,
            applicationId: applicationId,
            productId: productId,
            questionSetId: questionSetId, // Use the one from form
            answers: answers,
        };

        // Send to backend
        console.log("Calling sendFormData with payload:", payload);
        const result = await sendFormData(payload, productId, kycType, applicationId, sessionId);

        console.log("Backend result:", result);

        return {
            success: true,
            message: "Form submitted successfully",
            data: result,
        };
    } catch (error) {
        console.error("Error submitting form:", error);

        // Extract error details
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

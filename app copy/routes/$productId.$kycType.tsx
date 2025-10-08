import React from "react";
import { Navigate, useLoaderData } from "react-router";
import { verifySession } from "~/services/sessionProvider.server";
import { getOrganizationFromSession } from "~/services/sessionStorage.server";

import { getAndParseFormData } from "~/services/api/get-form-data.server";
import { T_ProductIdLoaderData, T_ProductIdPageData } from "./types/productIdPage";
import { FormPage } from "../../components/Form";
import { T_ParsedFormData } from "~/types";
import { Route } from "apps/kyc/.react-router/types/app/+types/root";

import { Header } from "@ui/header";
import { Container } from "@ui/container";
import { pageContentStyle } from "~/styles/pageContentStyle.css";
import { SessionModalManager } from "apps/kyc/components";

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

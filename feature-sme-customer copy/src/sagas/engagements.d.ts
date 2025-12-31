import { E_EngagementActionConstants } from "../types";
export declare function watchEngagementTrigger(): Generator<import("redux-saga/effects").ForkEffect<never>, void, unknown>;
export declare function handleEngagementTrigger(): Generator<import("redux-saga/effects").SelectEffect | import("redux-saga/effects").CallEffect<{
    reference: string;
    referenceType: "SSN" | "OTHERS";
    engagements: (import("packages/api-definitions/src").components["schemas"]["BusinessIndividualEngagement"] | import("packages/api-definitions/src").components["schemas"]["ConsumerAccountEngagement"] | import("packages/api-definitions/src").components["schemas"]["ConsumerApplicationEngagement"] | import("packages/api-definitions/src").components["schemas"]["ConsumerOriginationEngagement"])[];
}> | import("redux-saga/effects").PutEffect<import("typesafe-actions").PayloadAction<E_EngagementActionConstants.GET_ENGAGEMENT_SUCCESS, {
    engagementType?: "BUSINESS_INDIVIDUAL";
    smeId?: string;
    organizationNumber?: string;
    companyName?: string;
    createDateTime?: string;
    updateDateTime?: string;
    applicationId?: string;
    accountId?: string;
    accountNumber?: string;
    businessIndividual?: import("packages/api-definitions/src").components["schemas"]["EngagementBusinessIndividual"];
}[]>> | import("redux-saga/effects").PutEffect<import("typesafe-actions").PayloadAction<E_EngagementActionConstants.GET_ENGAGEMENT_ERROR, import("../types").T_ResponseError>>, void, any>;

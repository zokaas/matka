import { ActionType } from "typesafe-actions";
import { E_EngagementActionConstants } from "../types";
import { T_ResponseError } from "../types";
export declare const engagementActions: {
    engagementInitializer: import("typesafe-actions").PayloadActionCreator<E_EngagementActionConstants.GET_ENGAGEMENT_INITIALIZEER, import("../types").T_Config>;
    engagementTrigger: import("typesafe-actions").EmptyActionCreator<E_EngagementActionConstants.GET_ENGAGEMENT_TRIGGER>;
    engagementSuccess: import("typesafe-actions").PayloadActionCreator<E_EngagementActionConstants.GET_ENGAGEMENT_SUCCESS, {
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
    }[]>;
    engagementError: import("typesafe-actions").PayloadActionCreator<E_EngagementActionConstants.GET_ENGAGEMENT_ERROR, T_ResponseError>;
    saveSmeIdSuccess: import("typesafe-actions").PayloadActionCreator<E_EngagementActionConstants.SAVE_ACTIVE_SMEID_SUCCESS, string>;
};
export type EngagementAction = ActionType<typeof engagementActions>;

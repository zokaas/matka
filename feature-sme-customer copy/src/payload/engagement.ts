import {
    T_EngagementApiResponse,
    T_EngagementBusinessIndividual,
    T_EngagementConsumerAccount,
    T_EngagementConsumerApplication,
    T_EngagementConsumerOrigination,
} from "../types";

export const getBusinessEngagements = (
    engagements: T_EngagementApiResponse
): Array<T_EngagementBusinessIndividual> => {
    const businessIndividuals: Array<T_EngagementBusinessIndividual> =
        engagements.engagements.filter(
            (
                engagement:
                    | T_EngagementBusinessIndividual
                    | T_EngagementConsumerAccount
                    | T_EngagementConsumerApplication
                    | T_EngagementConsumerOrigination
            ) => engagement.engagementType === "BUSINESS_INDIVIDUAL"
        ) as Array<T_EngagementBusinessIndividual>;

    const filteredWithRoles = businessIndividuals.filter(
        (item) =>
            item.businessIndividual?.roleType === "boardMember" &&
            item.businessIndividual?.role === "GUARANTOR"
    ) as Array<T_EngagementBusinessIndividual>;

    return filteredWithRoles;
};

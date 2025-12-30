import { PRODUCTS_WITHOUT_APPLICATION_UUID } from "apps/kyc/config";
import { T_MissingFields } from "~/routes/types";

export const requiresApplicationUuid = (productId: string) =>
    !PRODUCTS_WITHOUT_APPLICATION_UUID.has(productId);

export function getMissingRequiredData({
    answersJson,
    applicationId,
    applicationUuid,
    mustHaveApplicationUuid,
    questionSetId,
    kcUserId,
    authData,
}: {
    answersJson?: unknown;
    applicationId?: unknown;
    applicationUuid?: unknown;
    mustHaveApplicationUuid: boolean;
    questionSetId?: unknown;
    kcUserId?: unknown;
    authData?: unknown;
}): {
    missing: T_MissingFields;
    hasMissingRequiredData: boolean;
} {
    const missing: T_MissingFields = {
        answersJson: !answersJson,
        applicationId: !applicationId,
        applicationUuid: mustHaveApplicationUuid && !applicationUuid,
        questionSetId: !questionSetId,
        kcUserId: !kcUserId,
        authData: !authData,
    };

    return {
        missing,
        hasMissingRequiredData: Object.values(missing).some(Boolean),
    };
}

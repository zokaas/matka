import {
    T_ApplicationReducerState,
    T_Guarantor,
    T_IndividualGuarantor,
} from "@opr-finance/feature-sme-customer/src/types";

export function isIndividualGuarantor(g: T_Guarantor | undefined): g is T_IndividualGuarantor {
    // pick a property that only the individual has
    return !!g && "reference" in g;
}

export function getApplicantSsnFromApplication(
    applicationState?: T_ApplicationReducerState
): string | undefined {
    const guarantees = applicationState?.application?.guarantees;
    if (!guarantees || guarantees.length === 0) return undefined;

    const guarantor = guarantees[0]?.guarantor;
    if (!isIndividualGuarantor(guarantor)) return undefined;

    return guarantor.reference;
}

import { T_BasicCompany, T_CompanyDataForKyc } from "../types";

export function mapCompanyDataForKyc(
    company: T_BasicCompany | undefined | null
): T_CompanyDataForKyc {
    return {
        organizationNumber: company?.organizationNumber ?? "",
        name: company?.name ?? "",
        sni: company?.sni ?? "",
        sni_text: company?.sni_text ?? "",
    };
}

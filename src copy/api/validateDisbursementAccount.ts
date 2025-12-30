import * as VP from "@opr-finance/api-definitions";

const frendsUrl = process.env.REACT_APP_FRENDS_URL;

export async function validateDisbursementAccount(data: string | undefined) {
    if (!data || data?.length === 0) return true;

    const url = `${frendsUrl}/v1/se/validate`;
    const payload = { type: "SE-CLEARING", number: data };

    const result = await fetch(url, {
        method: "POST",
        body: JSON.stringify(payload),
    });

    const response: VP.components["schemas"]["ValidationMessage"] = await result.json();

    return response.valid;
}

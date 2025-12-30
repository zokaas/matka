export function getLanguageFromProductId(productId: string): "sv" | "en" | "fi" {
    const lowerCaseProductId = productId.toLowerCase();

    if (lowerCaseProductId.includes("sweden") || lowerCaseProductId.includes("se")) {
        return "sv";
    }

    if (lowerCaseProductId.includes("finland") || lowerCaseProductId.includes("fi")) {
        return "fi";
    }

    return "en";
}

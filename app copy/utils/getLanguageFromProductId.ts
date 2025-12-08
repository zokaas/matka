
export function getLanguageFromProductId(productId: string): "sv" | "en" | "fi" {
    const lowerProductId = productId.toLowerCase();

    if (lowerProductId.includes("sweden") || lowerProductId.includes("-se")) {
        return "sv";
    }

    if (lowerProductId.includes("finland") || lowerProductId.includes("-fi")) {
        return "fi";
    }

    return "en";
}

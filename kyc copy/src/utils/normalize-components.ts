export function normalizeComponents<T>(input: T): T {
  if (Array.isArray(input)) {
    return input.map(normalizeComponents) as unknown as T;
  }

  if (input && typeof input === "object") {
    const obj = input as Record<string, unknown>;
    const next: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(obj)) {
      if (key === "__component" && typeof value === "string") {
        next[key] = value.replace(/-(se|fi)$/i, ""); // kyc.xxx-se -> kyc.xxx
      } else {
        next[key] = normalizeComponents(value);
      }
    }

    return next as T;
  }

  return input;
}

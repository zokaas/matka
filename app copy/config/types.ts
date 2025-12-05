import { z } from "zod";
export const appConfigSchema = z.object({
    env: z.enum(["local", "development", "production"]),
    bffBaseUrl: z.string(),
    apiBaseUrl: z.string(),
    sessionSecret: z.string(),
    optionalPropExample: z.boolean().default(false),
});
export type AppConfig = z.infer<typeof appConfigSchema>;
export type RequiredConfig = Optional<AppConfig, KeysWithFallbackValue>;
type KeysWithFallbackValue = "optionalPropExample";
type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

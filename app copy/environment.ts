import * as z from "zod";
import { makeTypedEnvironment } from "./utils";

// Define the public environment schema.
const publicEnvSchema = z.object({
    PUBLIC_APP_ENV: z.string().min(1),
    PUBLIC_APP_BASE_URL: z.string().url().min(1),
});

// Extend the public schema to create the full environment schema.
const envSchema = publicEnvSchema.extend({
    MODE: z.enum(["development", "production", "test", "local"]).default("development"),
    BFF_BASE_URL: z.string().min(1),
    API_BASE_URL: z.string().min(1),
    BFF_KYC_BASE_PATH: z.string().min(1),
    STRAPI_BASE_URL: z.string().min(1),
    STRAPI_AUTH_TOKEN: z.string().min(1),
    USE_MOCK_DATA: z
        .string()
        .optional()
        .transform((val) => val === "true"),
});
// Create the environment parsers for public and full schemas.
const getPublicEnv = makeTypedEnvironment(publicEnvSchema.parse);
const getEnv = makeTypedEnvironment(envSchema.parse);

export { getEnv, getPublicEnv };

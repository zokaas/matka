import { defineConfig } from "../defineConfig";

const bffUrl = "https://inbound5.alb.public.858251697328.aws.opr-finance.com/v2/gw";

export function createDevelopmentConfig() {
    return defineConfig({
        env: "development",
        bffBaseUrl: `${bffUrl}`,
        apiBaseUrl: `${bffUrl}/kyc`,
        testMode: 0,
        sessionSecret: "SFZrUuaYAXWE/oLmGO3ShnEs5LMOTSkGYeYVSXx8PDDh1ACwGv7AY0hF1uHV9MTe",
    });
}

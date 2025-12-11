import { defineConfig } from "../defineConfig";

const bffUrl = "https://inbound5.alb.public.039067103537.aws.opr-finance.com/v2/gw";

export function createProductionConfig() {
    return defineConfig({
        env: "production",
        bffBaseUrl: `${bffUrl}`,
        apiBaseUrl: `${bffUrl}/kyc`,
        testMode: 1,
        sessionSecret: "MJXg6A6mGotVYSq79dAfDHw0tN85wQ26DsKd0LVTr3SoPFneJQQaGYBddtKAN265",
    });
}

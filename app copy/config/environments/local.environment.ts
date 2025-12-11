import { defineConfig } from "../defineConfig";

const bffUrl = "http://localhost:3500/v2/gw";

export function createLocalConfig() {
    return defineConfig({
        env: "local",
        bffBaseUrl: `${bffUrl}`,
        apiBaseUrl: `${bffUrl}/kyc`,
        testMode: 0,
        sessionSecret: "b/+01TNUZjK2t30sCBaWVC5uf/bVT2xrVFKt7CSM35R7RtVpIep72fQwgxQWESrK",
    });
}

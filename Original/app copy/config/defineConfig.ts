import { appConfigSchema, RequiredConfig } from "./types";

export function defineConfig(config: RequiredConfig) {
    return appConfigSchema.parse(config);
}

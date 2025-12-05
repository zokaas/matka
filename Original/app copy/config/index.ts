import { createLocalConfig } from "./environments/local.environment";
import { createDevelopmentConfig } from "./environments/development.environment";
import { createProductionConfig } from "./environments/production.environment";

export const appConfig = getConfig();

function getConfig() {
    switch (process.env.APP_ENV) {
        case "production":
            return createProductionConfig();
        case "development":
            return createDevelopmentConfig();
        case "local":
            return createLocalConfig();
        default:
            throw new Error(`Invalid APP_ENV "${process.env.APP_ENV}"`);
    }
}

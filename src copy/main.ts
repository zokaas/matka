import { join } from "path";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { AppModule } from "./app.module";

const getWhitelistedUrls = () => {
    return process.env.WHITELISTED_URLS.split(",");
};

async function bootstrap() {
    const logger = new Logger("Bootstrap");
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    const configService = app.get<ConfigService>(ConfigService);

    const appEnv = configService.get("app.environment");
    logger.log("ENV", appEnv);
    const globalPath = configService.get("app.globalPath");
    app.setGlobalPrefix(globalPath);

    app.enableCors({
        credentials: true,
        origin: getWhitelistedUrls(),
    });

    if (appEnv === "development") app.useStaticAssets(join(__dirname, "..", "mock"));

    app.useStaticAssets(join(__dirname, "resources/views/css"));
    app.setBaseViewsDir(join(__dirname, "resources/views"));
    app.setViewEngine("pug");

    const PORT = parseInt(configService.get("app.port"));
    logger.log(`Server port is ${PORT}`);

    await app.listen(PORT);
}
bootstrap();

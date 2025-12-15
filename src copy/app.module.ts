import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AppRepository } from "./app.repository";
import { ContentfulModule } from "./contentful/contentful.module";

import configuration from "./config/configuration";

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [configuration],
            isGlobal: true,
        }),
        ContentfulModule,
    ],
    controllers: [AppController],
    providers: [AppService, AppRepository],
})
export class AppModule {}

import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { RedisModule } from "@songkeys/nestjs-redis";
import { DevtoolsModule } from "@nestjs/devtools-integration";

import { LoggerModule } from "@opr-finance/logger";
import { RedisClientModule } from "@opr-finance/redis-client";

import appConfiguration from "./config/app.configuration";
import { ApiAuthSessionController } from "./api-auth-session.controller";
import { ApiAuthSessionService } from "./api-auth-session.service";

@Module({
  imports: [
    DevtoolsModule.register({
      http: process.env.CURRENT_ENV === "local",
      port: 4101,
    }),
    ConfigModule.forRoot({
      load: [appConfiguration],
      isGlobal: true,
    }),
    RedisModule.forRootAsync({
      useFactory: (config: ConfigService) => {
        // console.log("Redis config:", config.get("redis"));
        return {
          config: {
            host: config.get("redis.host"),
            port: config.get("redis.port"),
            password: config.get("redis.password"),
          },
        };
      },
      inject: [ConfigService],
    }),
    LoggerModule,
    RedisClientModule,
  ],
  controllers: [ApiAuthSessionController],
  providers: [ApiAuthSessionService],
})
export class ApiAuthSessionModule {}

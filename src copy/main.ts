import { Logger, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory, PartialGraphHost } from "@nestjs/core";
import helmet from "helmet";
import * as cookieParser from "cookie-parser";
import * as passport from "passport";
import * as session from "express-session";

import * as fs from "fs";

import { ApiAuthSessionModule } from "./api-auth-session.module";
import { IAppProps } from "@opr-finance/config";
import { RedisStore } from "connect-redis";
import { Redis } from "ioredis";
import { IRedisClientConfigModule } from "@opr-finance/redis-client";

async function bootstrap() {
  const logger = new Logger("Bootstrap");

  const app = await NestFactory.create(ApiAuthSessionModule, {
    snapshot: true,
    abortOnError: false, // <--- THIS
  });

  const configService = app.get<ConfigService>(ConfigService);

  const { port, corsWhitelistedUrls, globalPathPrefix, sessionSecret } =
    configService.get<IAppProps>("app");

  const redisConf = configService.get<IRedisClientConfigModule>("redis");

  const redis = new Redis({
    host: redisConf.host,
    port: redisConf.port,
    password: redisConf.password,
  });

  const redisStore = new RedisStore({
    client: redis,
    prefix: "auth:",
  });

  app.setGlobalPrefix(globalPathPrefix);
  app.enableCors({
    credentials: true,
    origin: corsWhitelistedUrls,
  });
  app.use(helmet());
  app.use(cookieParser());
  app.use(
    session({
      store: redisStore,
      secret: sessionSecret, // to sign session id
      resave: false, // will default to false in near future: https://github.com/expressjs/session#resave
      saveUninitialized: false, // will default to false in near future: https://github.com/expressjs/session#saveuninitialized
      rolling: true, // keep session alive
      cookie: {
        sameSite: false,
        maxAge: 30 * 60 * 1000, // session expires in 1hr, refreshed by `rolling: true` option.
        httpOnly: true, // so that cookie can't be accessed via client-side script
      },
    })
  );

  app.useGlobalPipes(new ValidationPipe());
  app.use(passport.initialize());
  app.use(passport.session());

  logger.log(`Server port is ${port}`);

  await app.listen(port);
}

bootstrap().catch((err) => {
  console.log(err.message);
  fs.writeFileSync("graph_auth.json", PartialGraphHost.toString() ?? "");
  process.exit(1);
});

import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import * as passport from "passport";
import { PassportModule } from "@nestjs/passport";
import { LoggerModule } from "@opr-finance/logger";
import { AuthenticationMiddleware, SessionMiddleware } from "./middlewares";
import {
  AuthenticationController,
  ImpersonateController,
  RefreshController,
} from "./controllers";
import {
  AdminSessionService,
  AuthenticationClientService,
  AuthenticationService,
  ImpersonateService,
  RefreshService,
  SessionService,
} from "./services";
import { SessionSerializer } from "./session.serializer";
import { SessionRefreshMiddleware } from "./middlewares/refresh.middleware";
import { UserSessionService } from "./services/user-session.service";

@Module({
  imports: [
    LoggerModule,
    HttpModule,
    PassportModule.register({ session: true, defaultStrategy: "oidc" }),
  ],
  providers: [
    AuthenticationService,
    SessionSerializer,
    AuthenticationClientService,
    SessionService,
    ImpersonateService,
    AdminSessionService,
    RefreshService,
    UserSessionService,
  ],
  controllers: [
    AuthenticationController,
    ImpersonateController,
    RefreshController,
  ],
  exports: [AuthenticationService, SessionService, AdminSessionService],
})
export class AuthenticationModule {
  public async configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        AuthenticationMiddleware,
        passport.authenticate("oidc", {
          failureMessage: true,
          failureRedirect: "/v2/gw/authenticate/login/error",
        })
      )
      .exclude(
        { path: "/authenticate/logout/(.*)", method: RequestMethod.GET },
        { path: "/authenticate/login/error", method: RequestMethod.GET },
        { path: "/authenticate/sessioninfo/(.*)", method: RequestMethod.GET },
        { path: "/authenticate/userinfo/(.*)", method: RequestMethod.GET },
        { path: "/authenticate/verify/(.*)", method: RequestMethod.GET }
      )
      .forRoutes(AuthenticationController);

    consumer
      .apply(SessionMiddleware)
      .exclude(
        { path: "/authenticate/start/(.*)", method: RequestMethod.ALL },
        { path: "/authenticate/login/(.*)", method: RequestMethod.ALL }
      )
      .forRoutes(AuthenticationController);

    consumer.apply(SessionRefreshMiddleware).forRoutes(RefreshController);
  }
}

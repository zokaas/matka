import { MiddlewareConsumer, Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";

import { LoggerModule, LoggerService } from "@opr-finance/logger";
import {
  AuthenticationModule,
  ImpersonateMiddleware,
  SessionMiddleware,
} from "@opr-finance/authentication";

import {
  LfpUsersService,
  TransactionsService,
  ViljaPlatformService,
  ViljaApplicationService,
  ViljaPlatformRequestsService,
  VpImpersonateService,
} from "./services";
import {
  ViljaPlatformController,
  VpImpersonateController,
  TransactionsController,
} from "./controllers";

@Module({
  imports: [LoggerModule, HttpModule, AuthenticationModule],
  providers: [
    ViljaPlatformRequestsService,
    ViljaPlatformService,
    LoggerService,
    LfpUsersService,
    TransactionsService,
    ViljaApplicationService,
    VpImpersonateService,
  ],
  exports: [ViljaPlatformService, ViljaApplicationService, LoggerService],
  controllers: [
    ViljaPlatformController,
    VpImpersonateController,
    TransactionsController,
  ],
})
export class ViljaPlatformModule {
  public async configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(SessionMiddleware)
      .forRoutes(
        ViljaPlatformController,
        TransactionsController,
        VpImpersonateController
      );

    consumer.apply(ImpersonateMiddleware).forRoutes(VpImpersonateController);
  }
}

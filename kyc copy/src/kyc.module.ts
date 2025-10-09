import { MiddlewareConsumer, Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { LoggerModule, LoggerService } from "@opr-finance/logger";
import { KycService } from "./kyc.service";
import { KycController } from "./kyc.controller";
import {
  AuthenticationModule,
  SessionMiddleware,
} from "@opr-finance/authentication";
import { KycFormParser } from "./utils/kyc-form-parser";

@Module({
  imports: [LoggerModule, HttpModule, AuthenticationModule],
  providers: [KycService, LoggerService, KycFormParser],
  exports: [KycService, LoggerService],
  controllers: [KycController],
})
export class KycModule {
  public async configure(consumer: MiddlewareConsumer) {
    consumer.apply(SessionMiddleware).forRoutes(KycController);
  }
}

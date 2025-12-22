import { MiddlewareConsumer, Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { ViljaPlatformModule } from "@opr-finance/vilja-platform";
import { KeycloakModule } from "@opr-finance/keycloak";
import {
  AdminSessionMiddleware,
  AuthenticationModule,
} from "@opr-finance/authentication";
import { TeamsMessagingModule } from "@opr-finance/teams-messaging";
import { StrapiModule } from "@opr-finance/strapi";
import { CompanyLoanFlexNlController } from "./controllers/company-loan-flex-nl.controller";
import {
  ApplicationHandlingService,
  CompanyLoanFlexNlService,
  ErrorHandlingService,
  HandleApplicationsInRedisService,
  HandleNewApplicationService,
  KeycloakApplicationHandlingService,
} from "./services";
import { ApplicationToolsService } from "./services/application-tools.service";

@Module({
  imports: [
    HttpModule,
    ViljaPlatformModule,
    AuthenticationModule,
    KeycloakModule,
    TeamsMessagingModule,
    StrapiModule,
  ],
  providers: [
    CompanyLoanFlexNlService,
    HandleApplicationsInRedisService,
    ApplicationHandlingService,
    KeycloakApplicationHandlingService,
    ErrorHandlingService,
    HandleNewApplicationService,
    ApplicationToolsService,
  ],
  exports: [CompanyLoanFlexNlService],
  controllers: [CompanyLoanFlexNlController],
})
export class CompanyLoanFlexNlModule {
  public async configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AdminSessionMiddleware)
      .forRoutes(CompanyLoanFlexNlController);
  }
}

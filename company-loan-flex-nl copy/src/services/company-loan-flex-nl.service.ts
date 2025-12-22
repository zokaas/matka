import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { HandleApplicationsInRedisService } from "./handle-applications-in-redis.service";
import { NL_CHECK_APPLICATIONS_EVENT } from "libs/helpers/event.constants";
import {
  APP_STATUS_ACCOUNT_CREATED,
  APP_STATUS_REJECTED,
} from "@opr-finance/vilja-platform";
import { TeamsGeneralErrorDto } from "@opr-finance/teams-messaging";
import { ApplicationListEntity } from "../entities";
import { ApplicationHandlingService } from "./application-handling.service";
import { ErrorHandlingService } from "./error-handling.service";

@Injectable()
export class CompanyLoanFlexNlService {
  constructor(
    private readonly handleApplicationsFromRedisService: HandleApplicationsInRedisService,
    private readonly applicationHandlingService: ApplicationHandlingService,
    private readonly errorHandlingService: ErrorHandlingService
  ) {}

  private readonly logger = new Logger(CompanyLoanFlexNlService.name);

  private async handleApplications(
    applicationEnitity: ApplicationListEntity
  ): Promise<void> {
    let currentApplicationId = null;
    try {
      for (currentApplicationId of applicationEnitity.applications) {
        console.log(currentApplicationId);

        const { applicationState, applicationData } =
          await this.applicationHandlingService.getApplicationAndState(
            currentApplicationId,
            applicationEnitity.kcClientId
          );

        if (applicationState === APP_STATUS_REJECTED) {
          await this.applicationHandlingService.applicationRejected(
            currentApplicationId
          );
          continue;
        }

        if (applicationState === APP_STATUS_ACCOUNT_CREATED) {
          await this.applicationHandlingService.applicationAccepted(
            applicationData,
            applicationEnitity.kcClientId,
            applicationEnitity.realm
          );
        }
      }
    } catch (error) {
      console.log(error);
      console.log(currentApplicationId);
      const errorText = `Error while handling application with id ${currentApplicationId}.\
      Stacktrace: ${error}`;

      const errorObj: TeamsGeneralErrorDto = {
        client: applicationEnitity.kcClientId,
        error: errorText,
      };

      this.errorHandlingService.handleGeneralError(errorObj);

      this.logger.error(
        `Vilja response status was ${error.status}, while handling applications`
      );
    }
  }

  @OnEvent(NL_CHECK_APPLICATIONS_EVENT)
  async startFlow(): Promise<void> {
    this.logger.debug("Handle applications");

    const applicationListEntity =
      await this.handleApplicationsFromRedisService.getApplicationListObject();

    if (applicationListEntity.listLocked) {
      this.logger.debug("List already locked");
      return;
    }

    if (applicationListEntity.applications.length === 0) {
      this.logger.debug("No applications to handle");
      return;
    }

    // handle Applications
    this.handleApplications(applicationListEntity);
  }
}

import { Injectable, Logger } from "@nestjs/common";
import {
  ApplicationDataDto,
  ViljaApplicationService,
  ViljaPlatformService,
} from "@opr-finance/vilja-platform";
import { AdminSessionService } from "@opr-finance/authentication";
import { HandleApplicationsInRedisService } from "./handle-applications-in-redis.service";
import { KeycloakApplicationHandlingService } from "./keycloak-application-handling.service";
import { TeamsResponseAndStatusErrorDto } from "@opr-finance/teams-messaging";
import { ErrorHandlingService } from "./error-handling.service";
import { HandleNewApplicationService } from "./handle-new-application.service";
import { ApplicationCreatedResponseDto } from "../dtos/application-created-response.dto";
import { ApplicationPayloadDto } from "../dtos";

@Injectable()
export class ApplicationHandlingService {
  constructor(
    private readonly handleApplicationsFromRedisService: HandleApplicationsInRedisService,
    private readonly viljaPlatformService: ViljaPlatformService,
    private readonly viljaApplicationService: ViljaApplicationService,
    private readonly adminSessionService: AdminSessionService,
    private readonly keycloakApplicationHandlingService: KeycloakApplicationHandlingService,
    private readonly errorHandlingService: ErrorHandlingService,
    private readonly handleNewApplicationService: HandleNewApplicationService
  ) {}

  private readonly logger = new Logger(ApplicationHandlingService.name);

  private async addViljaRoles(
    applicationData: ApplicationDataDto,
    kcClientId: string
  ): Promise<boolean> {
    const applicationId = applicationData.id;
    this.logger.debug(
      `Got event, application id: ${applicationId}, and clientID: ${kcClientId}`
    );
    const path = "api/customer/v6/smes";
    const contentType = "application/json";
    const guarantor = applicationData.guarantees[0].guarantor;
    const smeId = applicationData.smeId;

    try {
      await this.viljaApplicationService.addRoleToCompany(
        kcClientId,
        path,
        contentType,
        "boardMembers",
        guarantor,
        smeId
      );

      await this.viljaApplicationService.addRoleToCompany(
        kcClientId,
        path,
        contentType,
        "admins",
        guarantor,
        smeId
      );

      return true;
    } catch (error) {
      const guarantorsCount = error.response.length;
      const errorText = `Error happened during adding roles to company in Vilja.\
      Application id: ${applicationId}. \
      Guarantors count in application: ${guarantorsCount} \
      \
      Please check the BFF logs and company/application data in Vilja Paltform \
      ${error.status === 409 && "According to response code (409), this entity is already attached to company. This application will not be chekced anymore."}`;
      const errorObj: TeamsResponseAndStatusErrorDto = {
        error: errorText,
        errorResponse: "",
        errorStatus: error.status,
        client: kcClientId,
      };

      this.errorHandlingService.handleViljaError(errorObj);

      this.logger.error(
        `Backend response status was ${error.status}, while handling application with id ${applicationId}`
      );
      if (error.status === 409) {
        return true;
      }

      return false;
    }
  }

  async getApplicationAndState(
    id: string,
    kcClientId: string
  ): Promise<{
    applicationState: string;
    applicationData: ApplicationDataDto;
  }> {
    const applicationData =
      await this.viljaPlatformService.getDataFromVp<ApplicationDataDto>(
        kcClientId,
        `api/loan/v8/applications/${id}`,
        "application/json"
      );
    const { applicationState } = applicationData;

    return { applicationData, applicationState };
  }

  async applicationRejected(id: string): Promise<void> {
    await this.handleApplicationsFromRedisService.moveApplicationIdToRejected(
      id
    );
    this.logger.debug(`Handled application id ${id}`);
  }

  async applicationAccepted(
    applicationData: ApplicationDataDto,
    kcClientId: string,
    kcRealm: string
  ): Promise<void> {
    // Add Vilja Roles
    const success = await this.addViljaRoles(applicationData, kcClientId);

    if (success) {
      // Move application to Vilja done
      await this.handleApplicationsFromRedisService.moveApplicationIdToViljaDone(
        applicationData.id
      );

      // Add Keycloak user
      const { email } = applicationData.guarantees[0].guarantor;
      const { access_token } =
        await this.adminSessionService.returnAdminSession(kcRealm);
      const id =
        await this.keycloakApplicationHandlingService.createProfileInKeycloak(
          applicationData,
          access_token,
          kcClientId
        );
      this.logger.debug(`User with id: ${id} created in Keycloak`);

      // Send email
      await this.keycloakApplicationHandlingService.sendWelcomeEmail(
        email,
        access_token,
        kcClientId
      );

      // Application handling DONE
      await this.handleApplicationsFromRedisService.moveApplicationIdToDone(
        applicationData.id
      );
    }
  }

  async newApplication(
    applicationData: ApplicationPayloadDto,
    kcClientId: string,
    clientIP: string
  ): Promise<ApplicationCreatedResponseDto> {
    applicationData.application.dynamicFields.applicationInfo.clientIP =
      clientIP;

    const responseObject =
      await this.handleNewApplicationService.handleNewApplication(
        applicationData,
        kcClientId
      );

    return responseObject;
  }
}

import { Injectable, Logger } from "@nestjs/common";
import {
  ApplicationDataDto,
  IndividualGuarantorDto,
} from "@opr-finance/vilja-platform";
import { KeycloakService, UserDto } from "@opr-finance/keycloak";
import { UPDATE_PASSWORD, USERPASS, VERIFY_EMAIL } from "../constants";
import { ErrorHandlingService } from "./error-handling.service";
import { TeamsResponseAndStatusErrorDto } from "@opr-finance/teams-messaging";

@Injectable()
export class KeycloakApplicationHandlingService {
  constructor(
    private readonly keycloakService: KeycloakService,
    private readonly errorHandlingService: ErrorHandlingService
  ) {}
  private readonly logger = new Logger(KeycloakApplicationHandlingService.name);

  private createUserObject(
    applicationUserData: IndividualGuarantorDto
  ): UserDto {
    const userObject = new UserDto();
    userObject.username = applicationUserData.email;
    userObject.email = applicationUserData.email;
    userObject.firstName = applicationUserData.givenName;
    userObject.lastName = applicationUserData.surname;
    userObject.enabled = true;
    userObject.requiredActions = [VERIFY_EMAIL, UPDATE_PASSWORD];
    userObject.attributes = {
      authentication_method: [USERPASS],
      companyName: [""],
      organizationId: [""],
      reference: [applicationUserData.reference],
      reftype: [applicationUserData.referenceType],
    };

    return userObject;
  }

  async createProfileInKeycloak(
    applicationData: ApplicationDataDto,
    accessToken: string,
    kcClientId: string
  ): Promise<string> {
    const userObject = this.createUserObject(
      applicationData.guarantees[0].guarantor
    );

    try {
      const id: string = await this.keycloakService.createUser(
        kcClientId,
        accessToken,
        userObject
      );

      return id;
    } catch (error) {
      const errorText = `Error happened during creating user with id ${userObject.email} in Keycloak. Status: ${error.status}`;
      const errorResponse: string =
        error.status >= 500 ? error.response : JSON.stringify(error.response);
      const errorObject: TeamsResponseAndStatusErrorDto = {
        errorResponse,
        errorStatus: error.status,
        error: errorText,
        client: kcClientId,
      };

      this.errorHandlingService.handleKeycloakError(errorObject);
      this.logger.error(
        `Backend response status was ${error.status}, while creating profile in Keycloak with id ${userObject.email}`
      );
    }
  }

  async sendWelcomeEmail(
    username: string,
    accessToken: string,
    kcClientId: string
  ) {
    try {
      await this.keycloakService.sendWelcomeEmailbyUserId(
        accessToken,
        username,
        kcClientId
      );
    } catch (error) {
      const errorText = `Error happened while sending welcome email to user ${username}. Email not sent. Status: ${error.status}`;
      const errorResponse: string =
        error.status >= 500 ? error.response : JSON.stringify(error.response);
      const errorObject: TeamsResponseAndStatusErrorDto = {
        errorResponse,
        errorStatus: error.status,
        error: errorText,
        client: kcClientId,
      };

      this.errorHandlingService.handleKeycloakError(errorObject);

      this.logger.error(
        `Backend response status was ${error.status}, while sending welcome email in Keycloak for user ${username}`
      );
    }
  }

  async checkUser(
    kcClientId: string,
    username: string,
    accessToken: string
  ): Promise<boolean> {
    const result: boolean = await this.keycloakService.isExistingUser(
      kcClientId,
      username,
      accessToken
    );
    return result;
  }
}

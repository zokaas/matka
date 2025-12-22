import { Injectable } from "@nestjs/common";
import {
  TeamsGeneralErrorDto,
  TeamsMessagingService,
  TeamsResponseAndStatusErrorDto,
} from "@opr-finance/teams-messaging";

@Injectable()
export class ErrorHandlingService {
  constructor(private readonly teamsMessagingService: TeamsMessagingService) {}

  async handleGeneralError(messageObject: TeamsGeneralErrorDto): Promise<void> {
    const card = this.teamsMessagingService.createGeneralErrorTeamsCard(
      messageObject.error
    );
    await this.teamsMessagingService.sendTeamsMessage(
      card,
      messageObject.client
    );
  }

  async handleViljaError(
    messageObject: TeamsResponseAndStatusErrorDto
  ): Promise<void> {
    const card = this.teamsMessagingService.createViljaErrorTeamsCard(
      messageObject.error,
      messageObject.errorResponse,
      messageObject.errorStatus
    );

    await this.teamsMessagingService.sendTeamsMessage(
      card,
      messageObject.client
    );
  }

  async handleKeycloakError(
    messageObject: TeamsResponseAndStatusErrorDto
  ): Promise<void> {
    const card = this.teamsMessagingService.createKeycloakErrorTeamsCard(
      messageObject.error,
      messageObject.errorResponse,
      messageObject.errorStatus
    );
    await this.teamsMessagingService.sendTeamsMessage(
      card,
      messageObject.client
    );
  }
}

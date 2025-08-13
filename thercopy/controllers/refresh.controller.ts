import {
  Controller,
  Get,
  Logger,
  UseGuards,
  Headers,
  Param,
} from "@nestjs/common";
import { AuthenticationService, RefreshService } from "../services";
import { AuthenticationGuard } from "../guards";
import { SessionUser } from "../decorators";
import { RefreshSessionDto, SessionDto, SessionResponseDto } from "../dtos";

@Controller("refresh")
export class RefreshController {
  private readonly logger = new Logger(RefreshController.name);
  constructor(
    private readonly refreshService: RefreshService,
    private readonly authenticationService: AuthenticationService
  ) {}

  @Get("/:kcClientId")
  @UseGuards(AuthenticationGuard)
  async refreshSession(
    @Headers("authorization") sessionId: string,
    @Param("kcClientId") kcClientId: string,
    @SessionUser() sessionUser: SessionDto
  ): Promise<RefreshSessionDto> {
    const session =
      await this.authenticationService.sessionData<SessionResponseDto>(
        "POST",
        `session/${sessionId}`,
        sessionUser
      );
    return await this.refreshService.refreshSession(
      session.sessionId,
      kcClientId
    );
  }
}

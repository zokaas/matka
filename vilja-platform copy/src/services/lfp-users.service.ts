import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ViljaApplicationService } from "./vilja-application.service";
import { AdminDto } from "../dtos";

@Injectable()
export class LfpUsersService {
  constructor(
    private readonly configService: ConfigService,
    private readonly viljaApplicationService: ViljaApplicationService
  ) {}
  private readonly logger = new Logger(LfpUsersService.name);

  lfpConfigs(kcClientId: string): { baseUrl: string; predefinedToken: string } {
    return {
      baseUrl: this.configService.get<string>(
        `viljaPlatform.${kcClientId}.baseUrl`
      ),
      predefinedToken: this.configService.get<string>(
        `viljaPlatform.${kcClientId}.token`
      ),
    };
  }

  async createBoardMemberAndAdmin<T = unknown>(
    kcClientId: string,
    payload: AdminDto,
    smeId: string,
    role: string
  ): Promise<T> {
    try {
      return await this.viljaApplicationService.addRoleToCompany(
        kcClientId,
        "api/customer/v6/smes",
        "application/json",
        role,
        payload,
        smeId
      );
    } catch (e) {
      this.logger.error(
        `error createBoardMemberAndAdmin, ${e.message}, ${e.status}, ${role},`
      );
    }
  }
}

import { Body, Controller, Post, Param } from "@nestjs/common";
import { LoggerService } from "./logger.service";
import { LogBodyDto } from "./dto";

@Controller("logger/:kcClientId")
export class LoggerController {
  constructor(private readonly loggerService: LoggerService) {}

  @Post()
  async log(@Param("kcClientId") kcClientId: string, @Body() body: LogBodyDto) {
    const { level, message, ...data } = body;
    const lvl = String(level).toLowerCase();

    const content = `[${kcClientId}] ${message}`;
    const payload = { kcClientId, ...data };

    if (lvl === "error") {
      this.loggerService.logError(content, payload);
    } else {
      this.loggerService.logDebug(content, payload);
    }

    return { ok: true };
  }
}

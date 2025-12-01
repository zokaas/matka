import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createLogger, format, LoggerOptions, transports } from "winston";

@Injectable()
export class LoggerService {
  private readonly datadogApiKey: string;
  private readonly datadogService: string;
  private readonly datadogHost: string;

  constructor(private readonly configService: ConfigService) {
    this.datadogHost = this.configService.get<string>("logger.host");
    this.datadogService = this.configService.get<string>("logger.service");
    this.datadogApiKey = this.configService.get<string>("logger.apiKey");
  }

  getHttpTransportOptions() {
    return {
      host: this.datadogHost,
      path: `/api/v2/logs?dd-api-key=${this.datadogApiKey}&ddsource=nodejs&service=${this.datadogService}`,
      ssl: true,
    };
  }

  createLoggerInstance(options?: LoggerOptions) {
    const logger = createLogger({
      level: options?.level ? options?.level : "silly",
      exitOnError: false,
      format: format.combine(format.timestamp(), format.json()),
      transports: [new transports.Http(this.getHttpTransportOptions())],
      // transports: [new transports.File({ filename: `logs/gateway.log` })],
    });
    return logger;
  }

  logError(requestName: string, errorData: unknown) {
    const logger = this.createLoggerInstance();
    return logger.error(requestName, errorData);
  }

  logDebug(requestName: string, data: unknown = {}) {
    const logger = this.createLoggerInstance();
    return logger.debug(requestName, data);
  }
}

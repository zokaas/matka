import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { LoggerService } from "./logger.service";
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly loggerService: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const now = Date.now();
    const req = context.switchToHttp().getRequest();
    const logger = this.loggerService.createLoggerInstance({ level: "info" });

    const {
      path,
      method,
      headers: { authorization },
      params: { kcClientId },
      body,
    } = req;

    return next.handle().pipe(
      tap((data) => {
        setTimeout(() => {
          const statusCode = context.switchToHttp().getResponse().statusCode;
          const name = context.getClass().name;
          const requestName = `${name} - ${
            kcClientId || name
          } - ${path} - ${statusCode}`;

          const request = { path, method, authorization, kcClientId, body };
          const response = {
            statusCode,
            data: data,
            duration: Date.now() - now,
          };

          if (statusCode < 400) {
            logger.debug(requestName, {
              request,
              response,
            });
          }
        }, 0);
      })
    );
  }
}

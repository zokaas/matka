import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { IRequestWithUser } from "../interfaces";

@Injectable()
export class AuthenticationGuard implements CanActivate {
  private readonly logger = new Logger(AuthenticationGuard.name);

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const controllerName = context.getClass().name;

      const request = context.switchToHttp().getRequest<IRequestWithUser>();
      const sessionId = request.headers.authorization;
      const kcClientId = request.params.kcClientId;

      this.logger.log(
        `${AuthenticationGuard.name} running on controller: ${controllerName}. Client id: ${kcClientId}, sessionId: ${sessionId}`
      );

      if (!sessionId) return false;

      const { user } = request;

      if (!user) return false;

      const { ref } = user.userInfo.attrs;
      const { exp } = user.userIntrospect;
      const now = Math.round(new Date().getTime() / 1000);

      this.logger.debug(
        `Guard checking user with ref = ${ref}, and session id sessionId = ${sessionId}`
      );

      if (now > exp) {
        this.logger.log(`Session with id ${sessionId} expired`);
        return false;
      }

      return true;
    } catch (error) {
      this.logger.error(`Some other error happened. Message: ${error.message}`);
      return false;
    }
  }
}

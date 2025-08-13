import { ExecutionContext, Injectable, Logger } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class OidcLoginGuard extends AuthGuard("oidc") {
  private readonly logger = new Logger(OidcLoginGuard.name);
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const result = (await super.canActivate(context)) as boolean;

    await super.logIn(request);
    return result;
  }
}

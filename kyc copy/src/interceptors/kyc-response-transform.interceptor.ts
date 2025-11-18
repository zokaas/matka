import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ApiFormDto } from "../dtos";
import { KycFormParser } from "../utils";

@Injectable()
export class KycResponseTransformInterceptor implements NestInterceptor {
  private readonly logger = new Logger(KycResponseTransformInterceptor.name);

  constructor(private readonly kycFormParser: KycFormParser) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { kcClientId } = request.params;

    return next.handle().pipe(
      map((data: ApiFormDto) => {
        this.logger.log(`Transforming form data for product: ${kcClientId}`);
        this.logger.debug(
          `Raw ApiFormDto for ${kcClientId}: ${JSON.stringify(data, null, 2)}`
        );

        const parsed = this.kycFormParser.parseProductData(data, kcClientId);

        this.logger.debug(
          `Transformed KycFormDto for ${kcClientId}: ${JSON.stringify(
            parsed,
            null,
            2
          )}`
        );

        return parsed;
      })
    );
  }
}

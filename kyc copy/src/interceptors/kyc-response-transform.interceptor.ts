import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ApiFormDto, KycFormDto } from "../dtos";
import { KycFormParser } from "../utils";

@Injectable()
export class KycResponseTransformInterceptor
  implements NestInterceptor<ApiFormDto, KycFormDto>
{
  private readonly logger = new Logger(KycResponseTransformInterceptor.name);

  constructor(private readonly kycFormParser: KycFormParser) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<ApiFormDto>
  ): Observable<KycFormDto> {
    const request = context.switchToHttp().getRequest();
    const { kcClientId } = request.params;

    return next.handle().pipe(
      map((data: ApiFormDto): KycFormDto => {
        //Keeping logs for testing
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

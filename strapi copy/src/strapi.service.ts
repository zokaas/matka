import { HttpService } from "@nestjs/axios";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { LoggerService } from "@opr-finance/logger";
import { AxiosRequestConfig } from "axios";
import { catchError, lastValueFrom, map } from "rxjs";
import { InjectRedis } from "@songkeys/nestjs-redis";
import Redis from "ioredis";

@Injectable()
export class StrapiService {
  private readonly strapiBaseUrl =
    this.configService.get<string>("strapi.baseUrl");
  private readonly strapiToken = this.configService.get<string>("strapi.token");
  private readonly logger = new Logger(StrapiService.name);
  private readonly defaultTtl = 3600;
  private readonly keyPrefix = "strapi:";

  constructor(
    private readonly configService: ConfigService,
    protected httpService: HttpService,
    protected loggerService: LoggerService,
    @InjectRedis() private readonly redis: Redis
  ) {}


  private async fetchFromStrapi(
    url: string,
    cacheKey: string,
    contentType: string = "application/json",
    cacheTtl: number = this.defaultTtl
  ) {

    try {
      const cachedData = await this.redis.get(cacheKey);
      if (cachedData) {
        this.logger.log(`Cache hit for ${cacheKey}`);
        return JSON.parse(cachedData);
      }
    } catch (error) {
      this.logger.warn(`Redis error when getting from cache: ${error.message}`);
    }

    this.logger.log(`Cache miss for ${cacheKey}, fetching from Strapi`);

    const config: AxiosRequestConfig<never> = {
      url,
      method: "GET",
      headers: {
        "Content-Type": contentType,
        Authorization: `Bearer ${this.strapiToken}`,
      },
    };

    try {
      const response = await lastValueFrom(
        this.httpService.request(config).pipe(
          map((res) => res.data),
          catchError((err) => {
            const statusCode = err.response?.status ?? 500;
            const data = err.response?.data ?? "empty";

            this.logger.log(err);

            this.loggerService.logError(
              `strapi.service - ${url} - ${statusCode}`,
              {
                response: { statusCode, data },
                request: config,
              }
            );
            throw new Error(data);
          })
        )
      );

      try {
        await this.redis.set(
          cacheKey,
          JSON.stringify(response),
          "EX",
          cacheTtl
        );
      } catch (error) {
        this.logger.warn(`Redis error when setting cache: ${error.message}`);
      }

      return response;
    } catch (error) {
      this.loggerService.logError(
        `Failed to fetch from Strapi: ${error.message}`,
        {
          error: error.stack,
          url,
        }
      );
      throw error;
    }
  }
//for flex nl online and everyday fi static
  async getTranslations(
    contentType: string,
    product: string,
    type: string,
    lang: string
  ) {
    const cacheKey = `${this.keyPrefix}${product}:${type}:${lang}`;
    const queryString = `?locale=${lang}&populate=all`;

    const url =
      type === "global"
        ? `${this.strapiBaseUrl}/api/${type}${queryString}`
        : `${this.strapiBaseUrl}/api/${product}-${type}${queryString}`;

    return this.fetchFromStrapi(url, cacheKey, contentType);
  }
//kyc status(error) messages
  async getStatusMessages(lang: string = "en") {
    const cacheKey = `${this.keyPrefix}status-messages:${lang}`;
    const url = `${this.strapiBaseUrl}/api/status-messages?locale=${lang}`;

    return this.fetchFromStrapi(url, cacheKey);
  }
}

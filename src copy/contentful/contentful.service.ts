import { HttpException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Logger } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { AxiosResponse, AxiosRequestConfig, Method } from "axios";
import { catchError, lastValueFrom, map } from "rxjs";

import { ContentfulResponseDto } from "./dto/contentfulResponse.dto";

@Injectable()
export class ContentfulService {
    constructor(private readonly configService: ConfigService, private httpService: HttpService) {
        this.accessToken = this.configService.get<string>("contentful.accessToken");
        this.space = this.configService.get<string>("contentful.space");
        this.contentType = this.configService.get<string>("contentful.contentType");
        this.environment = this.configService.get<string>("contentful.environment");
    }

    private accessToken: string;
    private space: string;
    private contentType: string;
    private environment: string;

    private readonly logger = new Logger(ContentfulService.name);

    logConfigs() {
        this.logger.log(`accesToken: ${this.accessToken}`);
        this.logger.log(`space: ${this.space}`);
        this.logger.log(`contentType: ${this.contentType}`);
        this.logger.log(`environment: ${this.environment}`);
    }

    async getStaticContent(id: string): Promise<ContentfulResponseDto> {
        const url = this.configService.get("contentful.queryUrl");
        const method: Method = "POST";

        let parsedResponse = { media: {} };

        const entryId = this.configService.get(`contentful.${id}`);
        if (typeof entryId !== "undefined") {
            const requestQuery = {
                query: `query($entryId: String!) {
                    staticContent(id: $entryId){
                        slug
                        mediaCollection {
                            items {
                                value {
                                    url
                                    title
                                }
                                key
                            }
                        }
                    }
                }`,
                variables: { entryId },
            };

            const config: AxiosRequestConfig<any> = {
                url,
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this.accessToken}`,
                },
                data: requestQuery,
            };

            const response = await lastValueFrom(
                this.httpService.request(config).pipe(
                    map((res) => res.data),
                    catchError((err) => {
                        throw new HttpException(err.response.data, err.response.status);
                    })
                )
            );
            parsedResponse = this.parseMediaResponse(response);
        }

        return parsedResponse;
    }

    private parseMediaResponse(response) {
        const items = response.data.staticContent.mediaCollection.items;
        let media = {};
        items.forEach((item) => {
            media = { ...media, [item.key]: item.value.url };
        });

        return {
            media,
        };
    }

    private changeLiterals() {}
}

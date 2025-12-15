import {
    Body,
    Controller,
    Get,
    Header,
    HttpCode,
    Logger,
    Param,
    Post,
    StreamableFile,
} from "@nestjs/common";
// import { Response } from "express";

import { AppService } from "./app.service";
import { ContentfulService } from "./contentful/contentful.service";
// import * as MOCKED_RESPONSE from "../mock/fi/b2b/yritysluotto/statement.json";
// import * as MOCKED_RESPONSE_TRANSACTIONS from "../mock/fi/flex/online/transactions.json";
// import * as MOCKED_RESPONSE_OVERVIEW_FI from "../mock/fi/flex/online/yearlyOverview.json";
// import * as MOCKED_RESPONSE_OVERVIEW_SE from "../mock/se/flex/online/yearlyOverview.json";
// import * as MOCKED_RESPONSE_OVERVIEW_NL from "../mock/nl/flex/online/yearlyOverview.json";

//import { ViewMetaDto } from "./dto/viewMeta.dto";
import { TemplateDataDto } from "./dto/templateData.dto";

@Controller()
export class AppController {
    private readonly logger = new Logger(AppController.name);
    constructor(
        private readonly appService: AppService,
        private contentfulService: ContentfulService
    ) {}

    @Get("/health")
    getHello(): { status: string } {
        return this.appService.getHello();
    }

    /* @Get("/pdf/:source/:lang/:product/:type")
    async showGeneratedStatement(
        @Res() res: Response,
        @Param("source") source: string,
        @Param("lang") lang: string,
        @Param("product") product: string,
        @Param("type") type: string
    ): Promise<any> {
        const translationObj = await this.contentfulService.getStaticContent(
            `${source}-${product}-${lang}-${type}`
        );

        const viewMeta: ViewMetaDto = { source, lang, product, type };

        return res.render(this.appService.getViewName(viewMeta, "GET"), {
            translationObj,
            includes: {
                css: `/${lang}/${source}/${product}/${type}.css`,
            },
            data: MOCKED_RESPONSE,
        });
    } */

    @Post("/pdf/:source/:lang/:product/:type")
    @Header("Content-Type", "application/pdf")
    @HttpCode(200)
    async generatePdf(
        @Body() body: any,
        @Param("source") source: string,
        @Param("lang") lang: string,
        @Param("product") product: string,
        @Param("type") type: string
    ): Promise<StreamableFile> {
        this.logger.log(`Path: /pdf/${source}/${lang}/${product}/${type}`);
        // const mockedResponse = product === "online" ? MOCKED_RESPONSE_OVERVIEW_NL : MOCKED_RESPONSE;
        const translationObj = await this.contentfulService.getStaticContent(
            `${source}-${product}-${lang}-${type}`
        );
        const templateObj: TemplateDataDto = {
            sourceInfo: {
                lang,
                product,
                source,
                type,
            },
            templateProps: {
                data: body, // or mockedResponse
                includes: {
                    // TODO: Not in use, remove it at some point
                    css: `/resources/views/css/${lang}/${source}/${product}/${type}.css`,
                },
                translationObj,
            },
        };

        const htmlPage = this.appService.createHtmlPage(templateObj);
        const htmlAsPdf = await this.appService.getPdf(htmlPage);

        return new StreamableFile(htmlAsPdf);
    }
}

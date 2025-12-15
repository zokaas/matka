import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Method } from "axios";
import { join } from "path";
import { renderFile } from "pug";
import { AppRepository } from "./app.repository";

import { TemplateDataDto } from "./dto/templateData.dto";
import { ViewMetaDto } from "./dto/viewMeta.dto";

@Injectable()
export class AppService {
    constructor(private readonly appRepository: AppRepository) {}
    getHello(): { status: string } {
        return {
            status: "Never gonna give you up, never gonna let you down",
        };
    }

    getViewName(templateMeta: ViewMetaDto, method: Method = "POST"): string {
        const folderPrefix = "./resources/views/";
        const templatePath = `${templateMeta.lang}/${templateMeta.source}/${templateMeta.product}/${templateMeta.type}`;
        const fileExtension = ".pug";
        return method === "POST" ? folderPrefix + templatePath + fileExtension : templatePath;
    }

    createHtmlPage(templateData: TemplateDataDto): string {
        const templatePath = this.getViewName(templateData.sourceInfo);
        const pathToTemplate = join(__dirname, templatePath);

        const htmlPage = renderFile(pathToTemplate, templateData.templateProps) as string;

        return htmlPage;
    }

    async getPdf(data: string) {
        try {
            const pdfContent = await this.appRepository.htmlToPdf(data);
            return pdfContent;
        } catch (err) {
            throw new HttpException("Error in getPdf", HttpStatus.INTERNAL_SERVER_ERROR, {
                cause: new Error(err),
            });
        }
    }
}

import { Injectable } from "@nestjs/common";
import puppeteer, { Browser, PDFOptions } from "puppeteer";
import { PdfMarginsDto } from "./dto/pdfMargins.dto";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AppRepository {
    margins: PdfMarginsDto = {
        top: "1.5cm",
        right: "1.5cm",
        bottom: "1.5cm",
        left: "1.5cm",
    };

    constructor(private configService: ConfigService) {}

    async htmlToPdf(content: string, margins?: PdfMarginsDto) {
        if (margins) {
            this.margins = { ...this.margins, ...margins };
        }

        try {
            const environment = this.configService.get("app.env");
            const browser: Browser = await puppeteer.launch({
                headless: true,
                args: ["--no-sandbox"],
                ...(environment !== "local" && { executablePath: "/usr/bin/chromium-browser" }),
            });

            const page = await browser.newPage();
            await page.setContent(content);

            const pdfPageOptions: PDFOptions = {
                format: "a4",
                preferCSSPageSize: true,
                printBackground: true,
                margin: this.margins,
            };

            const pdfStream = await page.pdf(pdfPageOptions);

            await browser.close();
            return pdfStream;
        } catch (err) {
            const bufferdErr = Buffer.from(err);
            console.log(err);

            return bufferdErr;
        }
    }
}

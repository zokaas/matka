import { Controller, Get, Header, Param } from "@nestjs/common";
import { StrapiService } from "./strapi.service";
import { ContentType } from "@opr-finance/decorators";
import { StrapiResponseDto } from "./dtos";
@Controller("content")
export class StrapiController {
  constructor(private readonly strapiService: StrapiService) {}

  @Get("/:product/:type/:lang")
  @Header("Cache-Control", "no-store, must-revalidate")
  async getTranslations(
    @ContentType() contentType: string,
    @Param("product") product: string,
    @Param("type") type: string,
    @Param("lang") lang: string
  ): Promise<StrapiResponseDto> {
    return this.strapiService.getTranslations(contentType, product, type, lang);
  }

  @Get("/status-messages/:lang")
  @Header("Cache-Control", "public, max-age=3600")
  async getStatusMessages(
    @Param("lang") lang: string
  ): Promise<StrapiResponseDto> {
    return this.strapiService.getStatusMessages(lang);
  }
}
